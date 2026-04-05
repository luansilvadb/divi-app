"use strict";
/**
 * Search history manager for transaction search.
 * Stores recent searches in localStorage.
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchHistory = getSearchHistory;
exports.addToSearchHistory = addToSearchHistory;
exports.clearSearchHistory = clearSearchHistory;
var SEARCH_HISTORY_KEY = 'divi-transaction-search-history';
var MAX_HISTORY = 10;
function getSearchHistory() {
    try {
        var stored = localStorage.getItem(SEARCH_HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    catch (_a) {
        return [];
    }
}
function addToSearchHistory(query) {
    if (!query || query.trim().length < 2)
        return;
    var history = getSearchHistory();
    var normalizedQuery = query.trim();
    // Remove if already exists (to move to top)
    var filtered = history.filter(function (q) { return q.toLowerCase() !== normalizedQuery.toLowerCase(); });
    // Add to beginning
    var updated = __spreadArray([normalizedQuery], filtered, true).slice(0, MAX_HISTORY);
    try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
    }
    catch (_a) {
        // Silently fail if localStorage is unavailable
    }
}
function clearSearchHistory() {
    try {
        localStorage.removeItem(SEARCH_HISTORY_KEY);
    }
    catch (_a) {
        // Silently fail
    }
}
