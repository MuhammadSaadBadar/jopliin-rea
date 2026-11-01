/**
 * ==============================================================================
 * REA INVESTIGATION EVIDENCE - SCREENSHOT 3
 * Module: @joplin/lib/services/search/SearchEngineUtils.ts
 *         & @joplin/lib/services/search/SearchEngine.ts
 * Source: joplin-extracted/main-html.bundle.js (lines ~9110611 - 9127675)
 * REA Node ID: jag_node_17a0ed92bea178dde70f32456c0059bc0f783661ad95cb241920791c66878483
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. SearchEngineUtils.notesForQuery()
// Bridges SearchEngine results with Note.previews() database model hydration
// ------------------------------------------------------------------------------
class SearchEngineUtils {
    static async notesForQuery(query, showCompletedTodos, options = null, engine = null) {
        options = Object.assign({ appendWildCards: false }, options);
        engine = engine || SearchEngine.instance();

        // If query starts with '/', user explicitly requests basic SQL LIKE search
        let searchType = SearchType.Auto;
        if (query.length && query[0] === '/') {
            searchType = SearchType.Basic;
        }

        // 1. Execute search query across notes and FTS tables
        const results = await engine.search(query, {
            searchType: searchType,
            appendWildCards: options.appendWildCards,
        });

        const noteIds = results.map(r => r.id);
        const fields = options.fields ? options.fields : Note.previewFields().slice();

        // 2. Fetch hydrated note preview objects for matching IDs
        const previewOptions = Object.assign({
            order: [],
            fields: fields,
            conditions: [`id IN (${Note.escapeIdsForSql(noteIds)})`],
        }, options);

        const previews = await Note.previews(null, previewOptions);
        let filteredPreviews = [...previews];

        if (showCompletedTodos && !Setting.value('showCompletedTodos')) {
            filteredPreviews = previews.filter(n => n.is_todo === 0 || (n.is_todo === 1 && n.todo_completed === 0));
        }

        // 3. Preserve the exact relevance ordering returned by the search engine
        const orderedNotes = [];
        for (let i = 0; i < filteredPreviews.length; i++) {
            const index = noteIds.indexOf(filteredPreviews[i].id);
            orderedNotes[index] = filteredPreviews[i];
        }

        return {
            notes: orderedNotes.filter(n => !!n),
            results: results,
        };
    }
}

// ------------------------------------------------------------------------------
// 2. SearchEngine.search() & SearchEngine.determineSearchType_()
// Core search engine routing: FTS vs Basic vs Non-Latin vs Semantic
// ------------------------------------------------------------------------------
class SearchEngine {
    static instance() {
        if (!this.instance_) this.instance_ = new SearchEngine();
        return this.instance_;
    }

    determineSearchType_(query, parsedQuery, preferredSearchType) {
        if (preferredSearchType === SearchType.Basic) return SearchType.Basic;
        if (preferredSearchType === SearchType.Nonlatin) return SearchType.Nonlatin;
        if (preferredSearchType === SearchType.Semantic && this.canSemanticSearch_(query, parsedQuery)) {
            return SearchType.Semantic;
        }

        const terms = filterParser(query);
        const textToInspect = terms
            .filter(t => t.name === 'text' || t.name === 'title' || t.name === 'body')
            .map(t => t.value)
            .join(' ');
        
        const script = scriptType(textToInspect);

        if (!Setting.value('db.ftsEnabled')) {
            return SearchEngine.SEARCH_TYPE_BASIC;
        }

        // Japanese, Chinese, Korean, Thai use non-latin tokenization
        if (['ja', 'zh', 'ko', 'th'].includes(script)) {
            return SearchEngine.SEARCH_TYPE_NONLATIN_SCRIPT;
        }

        return SearchEngine.SEARCH_TYPE_FTS;
    }

    async search(query, options = null) {
        if (!query) return [];
        options = Object.assign({
            searchType: SearchEngine.SEARCH_TYPE_AUTO,
            appendWildCards: false,
            includeOrphanedResources: false,
        }, options);

        const parsedQuery = await this.parseQuery(query);
        const selectedSearchType = this.determineSearchType_(query, parsedQuery, options.searchType);
        let results = [];

        // Route A: Basic SQL LIKE search
        if (selectedSearchType === SearchEngine.SEARCH_TYPE_BASIC) {
            results = await this.basicSearch(this.normalizeText_(query));
            this.processResults_(results, parsedQuery, false);

        // Route B: Local vector semantic search
        } else if (selectedSearchType === SearchType.Semantic) {
            results = await this.semanticSearch(query, parsedQuery);

        // Route C: SQLite FTS full-text search
        } else {
            if (options.appendWildCards) {
                parsedQuery.allTerms = parsedQuery.allTerms.map(term => {
                    if (term.name === 'text' && !term.wildcard) {
                        return Object.assign({}, term, {
                            wildcard: true,
                            value: term.value.endsWith('"') 
                                ? `${term.value.substring(0, term.value.length - 1)}*"`
                                : `${term.value}*`,
                        });
                    }
                    return term;
                });
            }

            const isFts = (selectedSearchType === SearchType.Fts);
            try {
                // Generate parameterized SQL query from parsed terms
                const { query: sql, params } = queryBuilder(parsedQuery.allTerms, isFts);
                results = await this.db().selectAll(sql, params);

                results = results.map(row => Object.assign({}, row, {
                    item_type: ModelType.Note,
                    searchType: [selectedSearchType],
                }));

                // Route D: OCR / Attachment content search (if enabled in settings)
                const hasNonTextTerms = !!parsedQuery.allTerms.find(t => t.name !== 'text');
                if (!hasNonTextTerms && Setting.value('ocr.searchInExtractedContent')) {
                    const ocrTerms = parsedQuery.allTerms.map(t => t.value).join(' ');
                    const ocrResults = await this.db().selectAll(`
                        SELECT id, title, user_updated_time,
                               offsets(items_fts) AS offsets,
                               matchinfo(items_fts, 'pcnalx') AS matchinfo,
                               item_id, item_type
                        FROM items_fts
                        WHERE title MATCH ? OR body MATCH ?
                    `, [ocrTerms, ocrTerms]);

                    // Map matching resource attachments back to their parent notes
                    const resourceNotes = await Resource.associatedResourceNotes(ocrResults.map(r => r.item_id));
                    // ... map and merge OCR hits into results ...
                    results = results.concat(ocrResults);
                }

                // Rank results by title vs body match and FTS matchinfo weights
                this.processResults_(results, parsedQuery, isFts);
            } catch (err) {
                this.logger().warn(`Cannot execute MATCH query: ${query}: ${err.message}`);
                results = [];
            }
        }

        // Fallback: Check if query matches a note ID or callback URL directly
        if (!results.length) {
            results = await this.searchFromItemIds(query);
        }

        return results;
    }
}
