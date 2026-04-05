"use strict";
/**
 * Transaction search utility with fuzzy matching and multi-field support.
 * Provides case/accent insensitive search across title, category, wallet, and amount.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTransactions = searchTransactions;
exports.getSearchSuggestions = getSearchSuggestions;
// Normalize string for search: lowercase + remove accents
function normalizeString(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}
// Simple fuzzy matching: checks if all characters of query appear in order in target
function fuzzyMatch(target, query) {
    var normalizedTarget = normalizeString(target);
    var normalizedQuery = normalizeString(query);
    var targetIndex = 0;
    var queryIndex = 0;
    while (targetIndex < normalizedTarget.length && queryIndex < normalizedQuery.length) {
        if (normalizedTarget[targetIndex] === normalizedQuery[queryIndex]) {
            queryIndex++;
        }
        targetIndex++;
    }
    return queryIndex === normalizedQuery.length;
}
/**
 * Search transactions across multiple fields with fuzzy matching.
 * @param query - Search query string
 * @param context - Transactions and lookup maps
 * @returns Array of matching transactions
 */
function searchTransactions(query, context) {
    if (!query || query.trim() === '') {
        return context.transactions;
    }
    var normalizedQuery = normalizeString(query.trim());
    var words = normalizedQuery.split(/\s+/).filter(Boolean);
    return context.transactions.filter(function (t) {
        var title = t.title || '';
        var category = t.category_id ? context.categoryMap[t.category_id] : undefined;
        var wallet = t.wallet_id ? context.walletMap[t.wallet_id] : undefined;
        var categoryName = (category === null || category === void 0 ? void 0 : category.name) || '';
        var walletName = (wallet === null || wallet === void 0 ? void 0 : wallet.name) || '';
        var amountStr = t.amount.toFixed(2);
        var typeStr = t.type === 'income' ? 'entrada renda' : 'saida despesa gasto';
        // Build searchable text for each field
        var fields = [
            normalizeString(title),
            normalizeString(categoryName),
            normalizeString(walletName),
            normalizeString(amountStr),
            normalizeString(typeStr),
        ];
        // All words must match at least one field (AND logic between words)
        return words.every(function (word) {
            return fields.some(function (field) { return fuzzyMatch(field, word); });
        });
    });
}
/**
 * Get search suggestions based on partial query.
 * Returns matching categories, wallets, and recent transaction titles.
 */
function getSearchSuggestions(query, context, maxSuggestions) {
    if (maxSuggestions === void 0) { maxSuggestions = 8; }
    if (!query || query.trim().length < 2) {
        return [];
    }
    var normalizedQuery = normalizeString(query.trim());
    var suggestions = new Set();
    // Add matching categories
    for (var _i = 0, _a = Object.values(context.categoryMap); _i < _a.length; _i++) {
        var cat = _a[_i];
        if (fuzzyMatch(normalizeString(cat.name), normalizedQuery)) {
            suggestions.add(cat.name);
        }
    }
    // Add matching wallets
    for (var _b = 0, _c = Object.values(context.walletMap); _b < _c.length; _b++) {
        var wallet = _c[_b];
        if (fuzzyMatch(normalizeString(wallet.name), normalizedQuery)) {
            suggestions.add(wallet.name);
        }
    }
    // Add matching transaction titles
    for (var _d = 0, _e = context.transactions; _d < _e.length; _d++) {
        var t = _e[_d];
        if (t.title && fuzzyMatch(normalizeString(t.title), normalizedQuery)) {
            suggestions.add(t.title);
        }
        if (suggestions.size >= maxSuggestions)
            break;
    }
    return Array.from(suggestions).slice(0, maxSuggestions);
}
