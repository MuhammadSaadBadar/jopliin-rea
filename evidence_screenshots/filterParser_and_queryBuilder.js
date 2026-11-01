/**
 * ==============================================================================
 * REA INVESTIGATION EVIDENCE - SCREENSHOT 4
 * Module: @joplin/lib/services/search/filterParser.ts
 *         & @joplin/lib/services/search/queryBuilder.ts
 * Source: joplin-extracted/main-html.bundle.js (lines ~8981525 - 8991578)
 * REA Evidence: Extracted from webpack bundle functions 'skr' and 'ckr'
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. filterParser.ts ('skr' in bundle)
// Parses user query into tokenized filter terms and keywords
// ------------------------------------------------------------------------------
function filterParser(query) {
    // Valid metadata filter keywords supported by Joplin
    const supportedFilters = new Set([
        'any',          // 'any:1' turns search into OR logic instead of AND
        'title',        // 'title:Meeting'
        'body',         // 'body:Report'
        'tag',          // 'tag:work'
        'notebook',     // 'notebook:"Projects"'
        'created',      // 'created:day-7' or 'created:20260101'
        'updated',      // 'updated:month-1'
        'type',         // 'type:note' or 'type:todo'
        'iscompleted',  // 'iscompleted:1' or 'iscompleted:0'
        'due',          // 'due:day+3'
        'latitude',     // 'latitude:37.7'
        'longitude',    // 'longitude:-122.4'
        'altitude',     // 'altitude:100'
        'resource',     // 'resource:application/pdf'
        'sourceurl',    // 'sourceurl:github.com'
        'id'            // 'id:3bf2...'
    ]);

    function makeTerm(name, value) {
        return name.startsWith('-')
            ? { name: name.slice(1).toLowerCase(), value: value, negated: true }
            : { name: name.toLowerCase(), value: value, negated: false };
    }

    // Tokenize space-separated, quoted ("..."), and prefixed terms (prefix:value)
    const rawTerms = getTerms(query, supportedFilters);
    const parsedTerms = [];

    for (let i = 0; i < rawTerms.length; i++) {
        const { name, value, negated } = rawTerms[i];
        if (name !== '_') {
            if (!supportedFilters.has(name)) {
                throw new Error(`Invalid filter: ${name}`);
            }
            if (name === 'tag' || name === 'notebook' || name === 'resource' || name === 'sourceurl') {
                parsedTerms.push({ name, value: value.replace(/[*]/g, '%'), negated });
            } else {
                parsedTerms.push({ name, value, negated });
            }
        } else {
            // General text term
            parsedTerms.push({ name: 'text', value, negated });
        }
    }

    return parsedTerms;
}

// ------------------------------------------------------------------------------
// 2. queryBuilder.ts ('ckr' in bundle)
// Translates parsed filter terms into SQLite CTEs and FTS MATCH clauses
// ------------------------------------------------------------------------------
function queryBuilder(terms, isFts = true) {
    const whereClauses = [];
    const params = [];
    const ctes = [];
    
    // Determine overall relation: AND (default) or OR (if 'any:1' was specified)
    const relation = terms.find(t => t.name === 'any' && t.value === '1') ? 'OR' : 'AND';
    const tableName = isFts ? 'notes_fts' : 'notes';

    // Base SELECT statement with FTS offsets() and matchinfo() metrics
    whereClauses.push(`
        SELECT
            ${tableName}.id,
            ${tableName}.title,
            ${isFts ? "offsets(notes_fts) AS offsets, matchinfo(notes_fts, 'pcnalx') AS matchinfo," : ""}
            ${tableName}.user_created_time,
            ${tableName}.user_updated_time,
            ${tableName}.is_todo,
            ${tableName}.todo_completed,
            ${tableName}.parent_id
        FROM ${tableName}
        WHERE 1
    `);

    // A. Notebook Hierarchy Filter (Constructs Common Table Expression CTE)
    function _notebookFilter(notebookTerms, inclusionMode) {
        if (!notebookTerms.length) return;
        const likeClauses = notebookTerms.map(() => 'folders.title LIKE ?').join(' OR ');
        const cteName = (inclusionMode === 'EXCLUSION') ? 'notebooks_not_in_scope' : 'notebooks_in_scope';

        const cte = `
            ${cteName}(id) AS (
                SELECT folders.id FROM folders WHERE id IN (
                    SELECT id FROM folders WHERE ${likeClauses}
                )
                UNION ALL
                SELECT folders.id FROM folders JOIN ${cteName} ON folders.parent_id = ${cteName}.id
            )
        `;
        ctes.push(cte);
        params.push(...notebookTerms);
        whereClauses.push(`AND ROWID ${inclusionMode === 'EXCLUSION' ? 'NOT' : ''} IN (
            SELECT ${tableName}.ROWID FROM ${cteName} JOIN ${tableName} ON ${cteName}.id = ${tableName}.parent_id
        )`);
    }

    // B. Text Search Filter (FTS MATCH ? vs SQL LIKE ?)
    function textFilter(textTerms) {
        const positive = textTerms.filter(t => !t.negated);
        if (positive.length > 0) {
            if (isFts) {
                // SQLite FTS MATCH syntax
                whereClauses.push(`${relation} notes_fts MATCH ?`);
                const matchString = positive.map(t => (t.name === 'text' ? t.value : `${t.name}:${t.value}`)).join(' ');
                params.push(matchString);
            } else {
                // Fallback SQL LIKE syntax
                positive.forEach(t => {
                    whereClauses.push(`${relation} (notes.title LIKE ? OR notes.body LIKE ?)`);
                    params.push(`%${t.value}%`, `%${t.value}%`);
                });
            }
        }
    }

    // Apply all filter handlers (Tag, Resource, Date, Todo status, Location, Text)
    // ... apply filters ...
    textFilter(terms.filter(t => t.name === 'title' || t.name === 'body' || t.name === 'text'));

    let finalQuery = '';
    if (ctes.length > 0) {
        finalQuery = `WITH RECURSIVE ${ctes.join(',')} ${whereClauses.join(' ')}`;
    } else {
        finalQuery = whereClauses.join(' ');
    }

    return { query: finalQuery, params: params };
}
