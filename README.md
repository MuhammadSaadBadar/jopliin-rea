# Joplin Desktop Note Search Reverse Engineering Investigation (REA)

This repository contains the reverse engineering findings, evidence records, extracted methods, and architectural documentation for the **Note Search subsystem** in Joplin Desktop (`@joplin/app-desktop` v3.7.22).

This analysis was conducted using the **REA (Reverse Engineer Anything)** static analysis framework (`analyze-javascript-application`).

---

## REA Analysis Evidence Identity
- **REA Evidence ID**: `ev_d21ed3f45a8ac0d2d656b29fa5f5ca2a050326241016493db50ea1017825b96a`
- **Target SHA-256 Digest**: `40529240375cb86f31230cef2bee45d218f28f61176563f1a33bb49cff64be2d`
- **Provider**: `rea-javascript-application` (v1)
- **Inventory Manifest ID**: `agm_814a16dc478dcbcf4d18f5427aae88176ca8139b665cef94ce92674342508aae`
- **Graph Coverage**: 15,420 nodes, 17,368 edges

---

## Subsystem Architecture & Control Flow

1. **User Input Layer (`gui/SearchBar/SearchBar.tsx`)**:
   - Manages query state using React hooks.
   - Debounces input by 500ms (`debounce(search, 500)`).
   - Dispatches Redux actions `SEARCH_UPDATE` and `SEARCH_SELECT`.
2. **Middleware & Application Controller (`@joplin/lib/BaseApplication.ts`)**:
   - `generalMiddleware` intercepts `SEARCH_SELECT`.
   - Calls `refreshNotes(state)` which extracts the query pattern from `state.searches`.
3. **Search Coordination (`@joplin/lib/services/search/SearchEngineUtils.ts`)**:
   - Routes query through `notesForQuery(query, showCompletedTodos, options)`.
   - Checks if query begins with `/` (forcing basic SQL `LIKE` mode).
   - Calls `SearchEngine.instance().search(query)`.
   - Passes returned note IDs into `Note.previews()` with an SQL filter `conditions: ['id IN (...)']`.
   - Re-sorts retrieved note preview models to match relevance order.
4. **Core Search Engine (`@joplin/lib/services/search/SearchEngine.ts`)**:
   - `parseQuery(query)`: Uses `filterParser.ts` to tokenize metadata filters (`notebook:`, `tag:`, `created:`, `type:`, `iscompleted:`, etc.) and text phrases.
   - `determineSearchType_()`: Detects query script and database settings. Non-Latin scripts (Japanese, Chinese, Korean, Thai) use non-latin tokenization; otherwise FTS (Full-Text Search) is used.
   - `queryBuilder.ts`: Constructs parameterized SQL queries with recursive Common Table Expressions (`WITH RECURSIVE notebooks_in_scope ...`) and `notes_fts MATCH ?` expressions.
   - Executes queries against SQLite tables (`notes_fts`, `notes_normalized`, `items_fts`).
   - If enabled, searches OCR attachment text in `items_fts` and associates hits to notes.
   - Ranks results using `processResults_()` (prioritizing title matches, uncompleted tasks, and FTS matchinfo weights).
5. **Hydration & UI Updates**:
   - Dispatches `SET_HIGHLIGHTED` with search terms.
   - Dispatches `SEARCH_RESULTS_SET` and `NOTE_UPDATE_ALL`.
   - `gui/NoteList/NoteList2.tsx` renders the list of matching notes.
   - The active Note Editor highlights matching search terms in the note body.

---

## Evidence Files & Screenshot Reference

The [`evidence_screenshots/`](./evidence_screenshots/) folder contains cleanly formatted standalone files specifically prepared for evidence documentation:

- **[`screenshot_3_SearchEngine_and_SearchEngineUtils.js`](./evidence_screenshots/screenshot_3_SearchEngine_and_SearchEngineUtils.js)**:
  Contains `SearchEngineUtils.notesForQuery()`, `SearchEngine.search()`, and `SearchEngine.determineSearchType_()`.
- **[`screenshot_4_filterParser_and_queryBuilder.js`](./evidence_screenshots/screenshot_4_filterParser_and_queryBuilder.js)**:
  Contains `filterParser()` (supported filters Set) and `queryBuilder()` (recursive CTEs and FTS MATCH clauses).
- **[`screenshot_5_rea_evidence_record.json`](./evidence_screenshots/screenshot_5_rea_evidence_record.json)**:
  Contains the REA evidence record citing exact node IDs for `SearchEngine`, `SearchBar`, `BaseApplication`, `reducer`, and `NoteList2`.
