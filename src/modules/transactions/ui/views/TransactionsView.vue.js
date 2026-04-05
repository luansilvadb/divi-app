"use strict";
/// <reference types="D:/software/divi/divi-app/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="D:/software/divi/divi-app/node_modules/@vue/language-core/types/props-fallback.d.ts" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var transactionStore_1 = require("../../application/stores/transactionStore");
var formatters_1 = require("@/shared/utils/formatters");
var useIsMobile_1 = require("@/shared/composables/useIsMobile");
var BaseButton_vue_1 = require("@/shared/components/atoms/BaseButton.vue");
var BaseCard_vue_1 = require("@/shared/components/atoms/BaseCard.vue");
var BaseProgressBar_vue_1 = require("@/shared/components/atoms/BaseProgressBar.vue");
var BaseSummaryItem_vue_1 = require("@/shared/components/molecules/BaseSummaryItem.vue");
var StandardPageLayout_vue_1 = require("@/shared/components/templates/StandardPageLayout.vue");
var TransactionDialog_vue_1 = require("@/shared/components/organisms/TransactionDialog.vue");
var BaseConfirmDialog_vue_1 = require("@/shared/components/molecules/BaseConfirmDialog.vue");
var TransactionItem_vue_1 = require("../components/TransactionItem.vue");
var checkbox_1 = require("primevue/checkbox");
var button_1 = require("primevue/button");
var toast_1 = require("primevue/toast");
var autocomplete_1 = require("primevue/autocomplete");
var usetoast_1 = require("primevue/usetoast");
var search_1 = require("../../utils/search");
var searchHistory_1 = require("../../utils/searchHistory");
var store = (0, transactionStore_1.useTransactionStore)();
var toast = (0, usetoast_1.useToast)();
var isMobile = (0, useIsMobile_1.useIsMobile)();
var showForm = (0, vue_1.ref)(false);
var editingTransaction = (0, vue_1.ref)(null);
var openNewForm = function () {
    editingTransaction.value = null;
    showForm.value = true;
};
var showConfirmDelete = (0, vue_1.ref)(false);
var transactionToDelete = (0, vue_1.ref)(null);
var currentDate = (0, vue_1.ref)(new Date());
// Search state
var searchQuery = (0, vue_1.ref)('');
var searchSuggestions = (0, vue_1.ref)([]);
var searchHistory = (0, vue_1.ref)((0, searchHistory_1.getSearchHistory)());
// Bulk selection state
var selectedTransactions = (0, vue_1.ref)(new Set());
var isBulkMode = (0, vue_1.ref)(false);
// Filter presets state
var activeFilter = (0, vue_1.ref)('all');
// Advanced filters state
var showAdvancedFilters = (0, vue_1.ref)(false);
var filterCategory = (0, vue_1.ref)('');
var filterWallet = (0, vue_1.ref)('');
var filterAmountMin = (0, vue_1.ref)(null);
var filterAmountMax = (0, vue_1.ref)(null);
// Search context for multi-field search
var searchContext = (0, vue_1.computed)(function () { return ({
    transactions: store.transactions || [],
    categoryMap: store.categoryMap || {},
    walletMap: store.walletMap || {},
}); });
// Search suggestions for AutoComplete
function searchSuggestionsHandler(event) {
    var query = event.query;
    if (!query || query.trim().length < 2) {
        // Show search history when query is empty
        searchSuggestions.value = __spreadArray([], searchHistory.value, true);
        return;
    }
    // Get suggestions from search utility
    var suggestions = (0, search_1.getSearchSuggestions)(query, searchContext.value);
    // Add matching history entries
    var historyMatches = searchHistory.value.filter(function (h) {
        return h.toLowerCase().includes(query.toLowerCase());
    });
    searchSuggestions.value = __spreadArray([], new Set(__spreadArray(__spreadArray([], suggestions, true), historyMatches, true)), true).slice(0, 10);
}
function onSearchSelect(event) {
    searchQuery.value = event.value;
    (0, searchHistory_1.addToSearchHistory)(event.value);
}
function onSearchClear() {
    searchQuery.value = '';
    searchSuggestions.value = [];
}
function handleClearSearchHistory() {
    (0, searchHistory_1.clearSearchHistory)();
    searchHistory.value = [];
}
function handleClearFilters() {
    filterCategory.value = '';
    filterWallet.value = '';
    filterAmountMin.value = null;
    filterAmountMax.value = null;
}
// Date Labels
var monthLabelOnly = (0, vue_1.computed)(function () {
    return (0, formatters_1.formatMonthLong)(currentDate.value);
});
// Grouping Logic: Moved to store for performance
var groupedTransactions = (0, vue_1.computed)(function () { return store.groupedTransactions; });
// Apply search and filters to grouped transactions
var filteredGroupedTransactions = (0, vue_1.computed)(function () {
    var transactions = store.transactions;
    // Apply type filter
    if (activeFilter.value !== 'all') {
        transactions = transactions.filter(function (t) {
            return activeFilter.value === 'income' ? t.type === 'income' : t.type === 'expense';
        });
    }
    // Apply advanced filters
    if (filterCategory.value && filterCategory.value !== '') {
        transactions = transactions.filter(function (t) { return t.category_id === filterCategory.value; });
    }
    if (filterWallet.value && filterWallet.value !== '') {
        transactions = transactions.filter(function (t) {
            if (!t.wallet_id)
                return false;
            return t.wallet_id === filterWallet.value;
        });
    }
    if (filterAmountMin.value !== null) {
        transactions = transactions.filter(function (t) { return t.amount >= filterAmountMin.value; });
    }
    if (filterAmountMax.value !== null) {
        transactions = transactions.filter(function (t) { return t.amount <= filterAmountMax.value; });
    }
    // Apply search using utility
    if (searchQuery.value && searchQuery.value.trim()) {
        var searchResult = (0, search_1.searchTransactions)(searchQuery.value, {
            transactions: transactions,
            categoryMap: store.categoryMap || {},
            walletMap: store.walletMap || {},
        });
        transactions = searchResult;
    }
    // Re-group filtered transactions
    var grouped = {};
    for (var _i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
        var t = transactions_1[_i];
        if (!t.date)
            continue;
        var dateKey = new Date(t.date + 'T12:00:00').toISOString().split('T')[0];
        if (!grouped[dateKey]) {
            grouped[dateKey] = { items: [] };
        }
        grouped[dateKey].items.push(t);
    }
    return grouped;
});
// Bulk actions
function toggleBulkMode() {
    isBulkMode.value = !isBulkMode.value;
    if (!isBulkMode.value) {
        selectedTransactions.value.clear();
    }
}
function toggleTransactionSelection(id) {
    if (selectedTransactions.value.has(id)) {
        selectedTransactions.value.delete(id);
    }
    else {
        selectedTransactions.value.add(id);
    }
}
function selectAll() {
    var allIds = Object.values(groupedTransactions.value).flatMap(function (group) { return group.items.map(function (t) { return t.id; }); });
    selectedTransactions.value = new Set(allIds);
}
function clearSelection() {
    selectedTransactions.value.clear();
}
function bulkDelete() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, id;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (selectedTransactions.value.size === 0)
                        return [2 /*return*/];
                    _i = 0, _a = selectedTransactions.value;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    id = _a[_i];
                    return [4 /*yield*/, store.deleteTransaction(id)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    toast.add({
                        severity: 'success',
                        summary: 'Transações excluídas',
                        detail: "".concat(selectedTransactions.value.size, " transa\u00E7\u00F5es foram exclu\u00EDdas"),
                        life: 3000,
                    });
                    selectedTransactions.value.clear();
                    isBulkMode.value = false;
                    return [2 /*return*/];
            }
        });
    });
}
// CSV Export
function exportToCSV() {
    var allTransactions = Object.values(groupedTransactions.value).flatMap(function (group) { return group.items; });
    if (allTransactions.length === 0) {
        toast.add({
            severity: 'warn',
            summary: 'Sem dados',
            detail: 'Não há transações para exportar',
            life: 3000,
        });
        return;
    }
    var headers = ['Data', 'Título', 'Categoria', 'Carteira', 'Tipo', 'Valor'];
    var rows = allTransactions.map(function (t) {
        var _a, _b;
        return [
            new Date(t.date).toLocaleDateString('pt-BR'),
            t.title || 'Sem título',
            ((_a = store.categoryMap[t.category_id]) === null || _a === void 0 ? void 0 : _a.name) || 'Outros',
            ((_b = store.walletMap[t.wallet_id]) === null || _b === void 0 ? void 0 : _b.name) || 'Carteira',
            t.type === 'income' ? 'Entrada' : 'Saída',
            t.amount.toFixed(2),
        ];
    });
    var csvContent = __spreadArray([headers.join(',')], rows.map(function (row) { return row.join(','); }), true).join('\n');
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = "transacoes_".concat(currentDate.value.getFullYear(), "-").concat(String(currentDate.value.getMonth() + 1).padStart(2, '0'), ".csv");
    link.click();
    URL.revokeObjectURL(url);
    toast.add({
        severity: 'success',
        summary: 'Exportação concluída',
        detail: "Arquivo CSV gerado com ".concat(allTransactions.length, " transa\u00E7\u00F5es"),
        life: 3000,
    });
}
// Initialization
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(store.wallets.length === 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, store.fetchWallets()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!(store.categories.length === 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, store.fetchCategories()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, refreshTransactions()];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function refreshTransactions() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, store.fetchTransactionsByMonth(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function prevMonth() {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
}
function nextMonth() {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
}
// Watchers
(0, vue_1.watch)(currentDate, refreshTransactions);
// Actions
var handleDelete = function (id) {
    transactionToDelete.value = id;
    showConfirmDelete.value = true;
};
var confirmDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!transactionToDelete.value) return [3 /*break*/, 2];
                return [4 /*yield*/, store.deleteTransaction(transactionToDelete.value)];
            case 1:
                _a.sent();
                showConfirmDelete.value = false;
                transactionToDelete.value = null;
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
var cancelDelete = function () {
    showConfirmDelete.value = false;
    transactionToDelete.value = null;
};
var handleEdit = function (transaction) {
    editingTransaction.value = transaction;
    showForm.value = true;
};
var handleCloseForm = function () {
    showForm.value = false;
    setTimeout(function () {
        editingTransaction.value = null;
    }, 300); // Clear after animation
};
// Formatting Helper (Day Label)
function formatDateMonth(dateStr) {
    var date = new Date(dateStr + 'T12:00:00');
    return (0, formatters_1.formatMonthShort)(date);
}
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['search-autocomplete']} */ ;
/** @type {__VLS_StyleScopedClasses['p-autocomplete-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['search-autocomplete']} */ ;
/** @type {__VLS_StyleScopedClasses['p-autocomplete-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['p-autocomplete-list']} */ ;
/** @type {__VLS_StyleScopedClasses['search-autocomplete']} */ ;
/** @type {__VLS_StyleScopedClasses['p-autocomplete-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['p-autocomplete-list']} */ ;
/** @type {__VLS_StyleScopedClasses['search-autocomplete']} */ ;
/** @type {__VLS_StyleScopedClasses['p-autocomplete-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['p-autocomplete-list']} */ ;
/** @type {__VLS_StyleScopedClasses['search-autocomplete']} */ ;
/** @type {__VLS_StyleScopedClasses['p-autocomplete-input']} */ ;
/** @type {__VLS_StyleScopedClasses['search-autocomplete']} */ ;
/** @type {__VLS_StyleScopedClasses['p-autocomplete-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['search-autocomplete']} */ ;
/** @type {__VLS_StyleScopedClasses['p-autocomplete-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['p-autocomplete-list']} */ ;
var __VLS_0 = StandardPageLayout_vue_1.default || StandardPageLayout_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: "Transações",
    loading: (__VLS_ctx.store.isLoading),
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        title: "Transações",
        loading: (__VLS_ctx.store.isLoading),
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = {};
var __VLS_6 = __VLS_3.slots.default;
{
    var __VLS_7 = __VLS_3.slots.action;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-4 flex-wrap" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center bg-black/5 dark:bg-white/5 rounded-2xl p-1 border border-black/5 dark:border-white/5" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
    var __VLS_8 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.Button | typeof __VLS_components.Button} */
    button_1.default;
    // @ts-ignore
    var __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8(__assign({ 'onClick': {} }, { variant: "text", pt: ({
            root: {
                class: 'p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-text-secondary border-none',
            },
        }) })));
    var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { variant: "text", pt: ({
                root: {
                    class: 'p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-text-secondary border-none',
                },
            }) })], __VLS_functionalComponentArgsRest(__VLS_9), false));
    var __VLS_13 = void 0;
    var __VLS_14 = ({ click: {} },
        { onClick: (__VLS_ctx.prevMonth) });
    var __VLS_15 = __VLS_11.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2.5",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.polyline, __VLS_intrinsics.polyline)({
        points: "15 18 9 12 15 6",
    });
    // @ts-ignore
    [store, prevMonth,];
    var __VLS_11;
    var __VLS_12;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "px-3 text-[0.7rem] font-black uppercase tracking-widest text-text-primary min-w-[100px] text-center" }));
    /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-[0.7rem]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['min-w-[100px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    (__VLS_ctx.monthLabelOnly);
    var __VLS_16 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.Button | typeof __VLS_components.Button} */
    button_1.default;
    // @ts-ignore
    var __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16(__assign({ 'onClick': {} }, { variant: "text", pt: ({
            root: {
                class: 'p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-text-secondary border-none',
            },
        }) })));
    var __VLS_18 = __VLS_17.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { variant: "text", pt: ({
                root: {
                    class: 'p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-text-secondary border-none',
                },
            }) })], __VLS_functionalComponentArgsRest(__VLS_17), false));
    var __VLS_21 = void 0;
    var __VLS_22 = ({ click: {} },
        { onClick: (__VLS_ctx.nextMonth) });
    var __VLS_23 = __VLS_19.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2.5",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.polyline, __VLS_intrinsics.polyline)({
        points: "9 18 15 12 9 6",
    });
    // @ts-ignore
    [monthLabelOnly, nextMonth,];
    var __VLS_19;
    var __VLS_20;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-2" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    var __VLS_24 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.Button} */
    button_1.default;
    // @ts-ignore
    var __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24(__assign(__assign({ 'onClick': {} }, { label: ('Todas'), severity: (__VLS_ctx.activeFilter === 'all' ? 'primary' : 'secondary'), text: (__VLS_ctx.activeFilter !== 'all') }), { class: "text-xs" })));
    var __VLS_26 = __VLS_25.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { label: ('Todas'), severity: (__VLS_ctx.activeFilter === 'all' ? 'primary' : 'secondary'), text: (__VLS_ctx.activeFilter !== 'all') }), { class: "text-xs" })], __VLS_functionalComponentArgsRest(__VLS_25), false));
    var __VLS_29 = void 0;
    var __VLS_30 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.activeFilter = 'all';
                // @ts-ignore
                [activeFilter, activeFilter, activeFilter,];
            } });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    var __VLS_27;
    var __VLS_28;
    var __VLS_31 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.Button} */
    button_1.default;
    // @ts-ignore
    var __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31(__assign(__assign({ 'onClick': {} }, { label: ('Entradas'), severity: (__VLS_ctx.activeFilter === 'income' ? 'success' : 'secondary'), text: (__VLS_ctx.activeFilter !== 'income') }), { class: "text-xs" })));
    var __VLS_33 = __VLS_32.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { label: ('Entradas'), severity: (__VLS_ctx.activeFilter === 'income' ? 'success' : 'secondary'), text: (__VLS_ctx.activeFilter !== 'income') }), { class: "text-xs" })], __VLS_functionalComponentArgsRest(__VLS_32), false));
    var __VLS_36 = void 0;
    var __VLS_37 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.activeFilter = 'income';
                // @ts-ignore
                [activeFilter, activeFilter, activeFilter,];
            } });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    var __VLS_34;
    var __VLS_35;
    var __VLS_38 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.Button} */
    button_1.default;
    // @ts-ignore
    var __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38(__assign(__assign({ 'onClick': {} }, { label: ('Saídas'), severity: (__VLS_ctx.activeFilter === 'expense' ? 'danger' : 'secondary'), text: (__VLS_ctx.activeFilter !== 'expense') }), { class: "text-xs" })));
    var __VLS_40 = __VLS_39.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { label: ('Saídas'), severity: (__VLS_ctx.activeFilter === 'expense' ? 'danger' : 'secondary'), text: (__VLS_ctx.activeFilter !== 'expense') }), { class: "text-xs" })], __VLS_functionalComponentArgsRest(__VLS_39), false));
    var __VLS_43 = void 0;
    var __VLS_44 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.activeFilter = 'expense';
                // @ts-ignore
                [activeFilter, activeFilter, activeFilter,];
            } });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    var __VLS_41;
    var __VLS_42;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-2" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    var __VLS_45 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.Button} */
    button_1.default;
    // @ts-ignore
    var __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45(__assign(__assign({ 'onClick': {} }, { icon: (__VLS_ctx.isBulkMode ? 'pi pi-times' : 'pi pi-check-square'), label: (__VLS_ctx.isBulkMode ? 'Cancelar' : 'Selecionar'), severity: (__VLS_ctx.isBulkMode ? 'danger' : 'secondary'), text: (!__VLS_ctx.isBulkMode) }), { class: "text-xs" })));
    var __VLS_47 = __VLS_46.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { icon: (__VLS_ctx.isBulkMode ? 'pi pi-times' : 'pi pi-check-square'), label: (__VLS_ctx.isBulkMode ? 'Cancelar' : 'Selecionar'), severity: (__VLS_ctx.isBulkMode ? 'danger' : 'secondary'), text: (!__VLS_ctx.isBulkMode) }), { class: "text-xs" })], __VLS_functionalComponentArgsRest(__VLS_46), false));
    var __VLS_50 = void 0;
    var __VLS_51 = ({ click: {} },
        { onClick: (__VLS_ctx.toggleBulkMode) });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    var __VLS_48;
    var __VLS_49;
    var __VLS_52 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.Button} */
    button_1.default;
    // @ts-ignore
    var __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52(__assign(__assign({ 'onClick': {} }, { icon: "pi pi-download", label: "Exportar CSV", severity: "secondary", text: true }), { class: "text-xs" })));
    var __VLS_54 = __VLS_53.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { icon: "pi pi-download", label: "Exportar CSV", severity: "secondary", text: true }), { class: "text-xs" })], __VLS_functionalComponentArgsRest(__VLS_53), false));
    var __VLS_57 = void 0;
    var __VLS_58 = ({ click: {} },
        { onClick: (__VLS_ctx.exportToCSV) });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    var __VLS_55;
    var __VLS_56;
    if (!__VLS_ctx.isMobile) {
        var __VLS_59 = BaseButton_vue_1.default || BaseButton_vue_1.default;
        // @ts-ignore
        var __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59(__assign({ 'onClick': {} }, { variant: "primary" })));
        var __VLS_61 = __VLS_60.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { variant: "primary" })], __VLS_functionalComponentArgsRest(__VLS_60), false));
        var __VLS_64 = void 0;
        var __VLS_65 = ({ click: {} },
            { onClick: (__VLS_ctx.openNewForm) });
        var __VLS_66 = __VLS_62.slots.default;
        // @ts-ignore
        [isBulkMode, isBulkMode, isBulkMode, isBulkMode, toggleBulkMode, exportToCSV, isMobile, openNewForm,];
        var __VLS_62;
        var __VLS_63;
    }
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "grid grid-cols-1 lg:grid-cols-3 gap-8" }));
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)(__assign({ class: "lg:col-span-2 space-y-8" }));
/** @type {__VLS_StyleScopedClasses['lg:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-8']} */ ;
if (__VLS_ctx.isBulkMode) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center justify-between p-4 bg-primary-main/5 dark:bg-primary-main/10 rounded-2xl border border-primary-main/20" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-primary-main/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-primary-main/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-primary-main/20']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-3" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    var __VLS_67 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.Button} */
    button_1.default;
    // @ts-ignore
    var __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67(__assign({ 'onClick': {} }, { label: "Selecionar Todas", icon: "pi pi-check-square", text: true, size: "small" })));
    var __VLS_69 = __VLS_68.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { label: "Selecionar Todas", icon: "pi pi-check-square", text: true, size: "small" })], __VLS_functionalComponentArgsRest(__VLS_68), false));
    var __VLS_72 = void 0;
    var __VLS_73 = ({ click: {} },
        { onClick: (__VLS_ctx.selectAll) });
    var __VLS_70;
    var __VLS_71;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-sm font-bold text-text-secondary" }));
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    (__VLS_ctx.selectedTransactions.size);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-2" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    var __VLS_74 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.Button} */
    button_1.default;
    // @ts-ignore
    var __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74(__assign({ 'onClick': {} }, { label: "Excluir Selecionadas", icon: "pi pi-trash", severity: "danger", size: "small", disabled: (__VLS_ctx.selectedTransactions.size === 0) })));
    var __VLS_76 = __VLS_75.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { label: "Excluir Selecionadas", icon: "pi pi-trash", severity: "danger", size: "small", disabled: (__VLS_ctx.selectedTransactions.size === 0) })], __VLS_functionalComponentArgsRest(__VLS_75), false));
    var __VLS_79 = void 0;
    var __VLS_80 = ({ click: {} },
        { onClick: (__VLS_ctx.bulkDelete) });
    var __VLS_77;
    var __VLS_78;
    var __VLS_81 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.Button} */
    button_1.default;
    // @ts-ignore
    var __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81(__assign({ 'onClick': {} }, { icon: "pi pi-times", text: true, size: "small" })));
    var __VLS_83 = __VLS_82.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { icon: "pi pi-times", text: true, size: "small" })], __VLS_functionalComponentArgsRest(__VLS_82), false));
    var __VLS_86 = void 0;
    var __VLS_87 = ({ click: {} },
        { onClick: (__VLS_ctx.toggleBulkMode) });
    var __VLS_84;
    var __VLS_85;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "space-y-4" }));
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "relative group/search-container" }));
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['group/search-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "absolute -inset-0.5 bg-gradient-to-r from-primary-main/50 via-purple-500/30 to-primary-main/50 rounded-2xl opacity-0 group-focus-within/search-container:opacity-100 blur transition-opacity duration-500" }));
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['-inset-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-primary-main/50']} */ ;
/** @type {__VLS_StyleScopedClasses['via-purple-500/30']} */ ;
/** @type {__VLS_StyleScopedClasses['to-primary-main/50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['group-focus-within/search-container:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['blur']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 group-focus-within/search-container:shadow-xl group-focus-within/search-container:shadow-primary-main/10 transition-all duration-300" }));
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/60']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-900/60']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:shadow-black/20']} */ ;
/** @type {__VLS_StyleScopedClasses['group-focus-within/search-container:shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['group-focus-within/search-container:shadow-primary-main/10']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" }));
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-4']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "2.5", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, { class: "text-text-secondary/60 group-focus-within/search-container:text-primary-main transition-all duration-300 group-focus-within/search-container:scale-110" }));
/** @type {__VLS_StyleScopedClasses['text-text-secondary/60']} */ ;
/** @type {__VLS_StyleScopedClasses['group-focus-within/search-container:text-primary-main']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['group-focus-within/search-container:scale-110']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.circle)({
    cx: "11",
    cy: "11",
    r: "8",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "m21 21-4.3-4.3",
});
var __VLS_88;
/** @ts-ignore @type {typeof __VLS_components.AutoComplete | typeof __VLS_components.AutoComplete} */
autocomplete_1.default;
// @ts-ignore
var __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88(__assign(__assign(__assign(__assign({ 'onComplete': {} }, { 'onOptionSelect': {} }), { 'onClear': {} }), { modelValue: (__VLS_ctx.searchQuery), suggestions: (__VLS_ctx.searchSuggestions), placeholder: "Buscar transações...", optionLabel: "label", pt: ({
        root: { class: 'w-full' },
        input: {
            class: 'w-full pl-12 pr-24 py-4 bg-transparent border-0 rounded-2xl text-text-primary text-base font-medium placeholder:text-text-secondary/50 focus:outline-none focus:ring-0 transition-all duration-300',
        },
        dropdown: {
            class: 'absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border-0 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 p-2 transition-all duration-200',
        },
        panel: {
            class: 'mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/30 border border-black/5 dark:border-white/10 overflow-hidden',
        },
        list: {
            class: 'p-2',
        },
        option: {
            class: 'px-4 py-3 rounded-lg cursor-pointer hover:bg-primary-main/10 dark:hover:bg-primary-main/20 text-text-primary font-medium transition-all duration-200 flex items-center gap-3',
        },
        optionGroup: {
            class: 'px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-secondary/70 bg-black/5 dark:bg-white/5',
        },
    }), dropdown: true }), { class: "search-autocomplete" })));
var __VLS_90 = __VLS_89.apply(void 0, __spreadArray([__assign(__assign(__assign(__assign({ 'onComplete': {} }, { 'onOptionSelect': {} }), { 'onClear': {} }), { modelValue: (__VLS_ctx.searchQuery), suggestions: (__VLS_ctx.searchSuggestions), placeholder: "Buscar transações...", optionLabel: "label", pt: ({
            root: { class: 'w-full' },
            input: {
                class: 'w-full pl-12 pr-24 py-4 bg-transparent border-0 rounded-2xl text-text-primary text-base font-medium placeholder:text-text-secondary/50 focus:outline-none focus:ring-0 transition-all duration-300',
            },
            dropdown: {
                class: 'absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border-0 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 p-2 transition-all duration-200',
            },
            panel: {
                class: 'mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/30 border border-black/5 dark:border-white/10 overflow-hidden',
            },
            list: {
                class: 'p-2',
            },
            option: {
                class: 'px-4 py-3 rounded-lg cursor-pointer hover:bg-primary-main/10 dark:hover:bg-primary-main/20 text-text-primary font-medium transition-all duration-200 flex items-center gap-3',
            },
            optionGroup: {
                class: 'px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-secondary/70 bg-black/5 dark:bg-white/5',
            },
        }), dropdown: true }), { class: "search-autocomplete" })], __VLS_functionalComponentArgsRest(__VLS_89), false));
var __VLS_93;
var __VLS_94 = ({ complete: {} },
    { onComplete: (__VLS_ctx.searchSuggestionsHandler) });
var __VLS_95 = ({ optionSelect: {} },
    { onOptionSelect: (__VLS_ctx.onSearchSelect) });
var __VLS_96 = ({ clear: {} },
    { onClear: (__VLS_ctx.onSearchClear) });
/** @type {__VLS_StyleScopedClasses['search-autocomplete']} */ ;
var __VLS_97 = __VLS_91.slots.default;
{
    var __VLS_98 = __VLS_91.slots.option;
    var slotProps = __VLS_vSlot(__VLS_98)[0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-3" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    if (__VLS_ctx.searchHistory.includes(slotProps.option)) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "2" }, { class: "text-text-secondary/50 flex-shrink-0" }));
        /** @type {__VLS_StyleScopedClasses['text-text-secondary/50']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
            d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
            d: "M3 3v5h5",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
            d: "M12 7v5l4 2",
        });
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "2" }, { class: "text-primary-main/70 flex-shrink-0" }));
        /** @type {__VLS_StyleScopedClasses['text-primary-main/70']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.circle)({
            cx: "11",
            cy: "11",
            r: "8",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
            d: "m21 21-4.3-4.3",
        });
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "truncate" }));
    /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
    (slotProps.option);
    // @ts-ignore
    [isBulkMode, toggleBulkMode, selectAll, selectedTransactions, selectedTransactions, bulkDelete, searchQuery, searchSuggestions, searchSuggestionsHandler, onSearchSelect, onSearchClear, searchHistory,];
}
// @ts-ignore
[];
var __VLS_91;
var __VLS_92;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "absolute right-14 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10" }));
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-14']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
if (__VLS_ctx.searchQuery) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.searchQuery))
                return;
            __VLS_ctx.searchQuery = '';
            __VLS_ctx.onSearchClear();
            // @ts-ignore
            [searchQuery, searchQuery, onSearchClear,];
        } }, { class: "p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary/50 hover:text-text-secondary transition-all duration-200" }));
    /** @type {__VLS_StyleScopedClasses['p-1.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:hover:bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "2" }, { class: "transition-transform duration-200 hover:rotate-90" }));
    /** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:rotate-90']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M18 6 6 18",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "m6 6 12 12",
    });
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-wrap items-center gap-2" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.showAdvancedFilters = !__VLS_ctx.showAdvancedFilters;
        // @ts-ignore
        [showAdvancedFilters, showAdvancedFilters,];
    } }, { class: ([
        'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105',
        __VLS_ctx.showAdvancedFilters
            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
            : 'bg-white/50 dark:bg-white/10 text-text-secondary hover:bg-white/80 dark:hover:bg-white/20 border border-black/5 dark:border-white/10'
    ]) }));
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "flex items-center gap-1.5" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    xmlns: "http://www.w3.org/2000/svg",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M4 21v-7",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M4 10V3",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M12 21v-9",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M12 8V3",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M20 21v-5",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M20 12V3",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M1 14h6",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M9 8h6",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M17 16h6",
});
if (__VLS_ctx.searchHistory.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.handleClearSearchHistory) }, { class: "p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary/50 hover:text-text-secondary transition-all duration-200" }), { title: "Limpar histórico" }));
    /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:hover:bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M3 3v5h5",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M12 7v5l4 2",
    });
}
var __VLS_99;
/** @ts-ignore @type {typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
var __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    enterActiveClass: "transition-all duration-300 ease-out",
    enterFromClass: "opacity-0 -translate-y-3 scale-95",
    enterToClass: "opacity-100 translate-y-0 scale-100",
    leaveActiveClass: "transition-all duration-200 ease-in",
    leaveFromClass: "opacity-100 translate-y-0 scale-100",
    leaveToClass: "opacity-0 -translate-y-3 scale-95",
}));
var __VLS_101 = __VLS_100.apply(void 0, __spreadArray([{
        enterActiveClass: "transition-all duration-300 ease-out",
        enterFromClass: "opacity-0 -translate-y-3 scale-95",
        enterToClass: "opacity-100 translate-y-0 scale-100",
        leaveActiveClass: "transition-all duration-200 ease-in",
        leaveFromClass: "opacity-100 translate-y-0 scale-100",
        leaveToClass: "opacity-0 -translate-y-3 scale-95",
    }], __VLS_functionalComponentArgsRest(__VLS_100), false));
var __VLS_104 = __VLS_102.slots.default;
if (__VLS_ctx.showAdvancedFilters) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-2xl space-y-5 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20" }));
    /** @type {__VLS_StyleScopedClasses['p-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white/60']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-gray-900/60']} */ ;
    /** @type {__VLS_StyleScopedClasses['backdrop-blur-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['space-y-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:shadow-black/20']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-white/10']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "text-sm font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2" }));
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2.5",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M4 21v-7",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M4 10V3",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M12 21v-9",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M12 8V3",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M20 21v-5",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M20 12V3",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M1 14h6",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M9 8h6",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M17 16h6",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showAdvancedFilters))
                return;
            __VLS_ctx.showAdvancedFilters = false;
            // @ts-ignore
            [searchHistory, showAdvancedFilters, showAdvancedFilters, showAdvancedFilters, handleClearSearchHistory,];
        } }, { class: "p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary/70 hover:text-text-secondary transition-all duration-200" }));
    /** @type {__VLS_StyleScopedClasses['p-1.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:hover:bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary/70']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M18 6 6 18",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "m6 6 12 12",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }));
    /** @type {__VLS_StyleScopedClasses['grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "space-y-2" }));
    /** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)(__assign({ class: "text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2" }));
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "m7.5 4.27 9 16.86",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M9 10h.01",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M15 14h.01",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M9 14h.01",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M15 10h.01",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)(__assign({ value: (__VLS_ctx.filterCategory) }, { class: "w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 text-text-primary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-main/30 focus:border-primary-main/50 transition-all duration-200 hover:border-black/20 dark:hover:border-white/20 shadow-sm hover:shadow-md" }));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white/80']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:ring-primary-main/30']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:border-primary-main/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:border-black/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:hover:border-white/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:shadow-md']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        value: "",
    });
    for (var _i = 0, _j = __VLS_vFor((__VLS_ctx.store.categories)); _i < _j.length; _i++) {
        var cat = _j[_i][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
            key: (cat.id),
            value: (cat.id),
        });
        (cat.name);
        // @ts-ignore
        [store, filterCategory,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "space-y-2" }));
    /** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)(__assign({ class: "text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2" }));
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M21 12V7H5a2 2 0 0 1 0-4h14v4",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M3 5v14a2 2 0 0 0 2 2h16v-5",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M18 12a2 2 0 0 0 0 4h4v-4Z",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)(__assign({ value: (__VLS_ctx.filterWallet) }, { class: "w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 text-text-primary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-main/30 focus:border-primary-main/50 transition-all duration-200 hover:border-black/20 dark:hover:border-white/20 shadow-sm hover:shadow-md" }));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white/80']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:ring-primary-main/30']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:border-primary-main/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:border-black/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:hover:border-white/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:shadow-md']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        value: "",
    });
    for (var _k = 0, _l = __VLS_vFor((__VLS_ctx.store.wallets)); _k < _l.length; _k++) {
        var wallet = _l[_k][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
            key: (wallet.id),
            value: (wallet.id),
        });
        (wallet.name);
        // @ts-ignore
        [store, filterWallet,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }));
    /** @type {__VLS_StyleScopedClasses['grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "space-y-2" }));
    /** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)(__assign({ class: "text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2" }));
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M12 2v20",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign({ type: "number", min: "0", step: "0.01", placeholder: "0,00" }, { class: "w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 text-text-primary text-sm font-medium placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary-main/30 focus:border-primary-main/50 transition-all duration-200 hover:border-black/20 dark:hover:border-white/20 shadow-sm hover:shadow-md" }));
    (__VLS_ctx.filterAmountMin);
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white/80']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['placeholder:text-text-secondary/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:ring-primary-main/30']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:border-primary-main/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:border-black/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:hover:border-white/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:shadow-md']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "space-y-2" }));
    /** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)(__assign({ class: "text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2" }));
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M12 2v20",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign({ type: "number", min: "0", step: "0.01", placeholder: "Sem limite" }, { class: "w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 text-text-primary text-sm font-medium placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary-main/30 focus:border-primary-main/50 transition-all duration-200 hover:border-black/20 dark:hover:border-white/20 shadow-sm hover:shadow-md" }));
    (__VLS_ctx.filterAmountMax);
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white/80']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['placeholder:text-text-secondary/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:ring-primary-main/30']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:border-primary-main/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:border-black/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:hover:border-white/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:shadow-md']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex justify-end pt-2 border-t border-black/5 dark:border-white/10" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
    /** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-white/10']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.handleClearFilters) }, { class: "px-5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-rose-500/20" }));
    /** @type {__VLS_StyleScopedClasses['px-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-rose-600']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:text-rose-400']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-rose-50']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:hover:bg-rose-500/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-rose-200']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-rose-500/30']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:shadow-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:shadow-rose-500/20']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "flex items-center gap-2" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2.5",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M3 6h18",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",
    });
}
// @ts-ignore
[filterAmountMin, filterAmountMax, handleClearFilters,];
var __VLS_102;
if (Object.keys(__VLS_ctx.filteredGroupedTransactions).length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col items-center justify-center py-20 text-center opacity-40" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-20']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-40']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-6" }));
    /** @type {__VLS_StyleScopedClasses['w-20']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-20']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "40",
        height: "40",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "1.5",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
        points: "3.27 6.96 12 12.01 20.73 6.96",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "12",
        y1: "22.08",
        x2: "12",
        y2: "12",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "text-lg font-black uppercase tracking-widest mb-2" }));
    /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-xs font-bold uppercase tracking-widest" }));
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "space-y-12" }));
    /** @type {__VLS_StyleScopedClasses['space-y-12']} */ ;
    for (var _m = 0, _o = __VLS_vFor(__VLS_ctx.filteredGroupedTransactions); _m < _o.length; _m++) {
        var _p = _o[_m], group = _p[0], day = _p[1];
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (day) }, { class: "space-y-4" }));
        /** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center justify-between px-2" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-2']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-3" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-2xl font-black tracking-tighter text-text-primary" }));
        /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-tighter']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
        (String(day).split('-')[2]);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col -space-y-1" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['-space-y-1']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-[10px] font-black uppercase tracking-widest text-text-disabled" }));
        /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
        (__VLS_ctx.getRelativeDayLabel(String(day)));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-[10px] font-black uppercase tracking-[0.2em] text-primary-main" }));
        /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-[0.2em]']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-primary-main']} */ ;
        (__VLS_ctx.formatDateMonth(String(day)));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "grid grid-cols-1 gap-3" }));
        /** @type {__VLS_StyleScopedClasses['grid']} */ ;
        /** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
        var _loop_1 = function (t) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (t.id) }, { class: "relative" }));
            /** @type {__VLS_StyleScopedClasses['relative']} */ ;
            if (__VLS_ctx.isBulkMode) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "absolute left-2 top-1/2 -translate-y-1/2 z-10" }));
                /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
                /** @type {__VLS_StyleScopedClasses['left-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
                /** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
                /** @type {__VLS_StyleScopedClasses['z-10']} */ ;
                var __VLS_105 = void 0;
                /** @ts-ignore @type {typeof __VLS_components.Checkbox} */
                checkbox_1.default;
                // @ts-ignore
                var __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105(__assign({ 'onUpdate:modelValue': {} }, { modelValue: (__VLS_ctx.selectedTransactions.has(t.id)), binary: (true) })));
                var __VLS_107 = __VLS_106.apply(void 0, __spreadArray([__assign({ 'onUpdate:modelValue': {} }, { modelValue: (__VLS_ctx.selectedTransactions.has(t.id)), binary: (true) })], __VLS_functionalComponentArgsRest(__VLS_106), false));
                var __VLS_110 = void 0;
                var __VLS_111 = ({ 'update:modelValue': {} },
                    { 'onUpdate:modelValue': function () {
                            var _a = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                _a[_i] = arguments[_i];
                            }
                            var $event = _a[0];
                            if (!!(Object.keys(__VLS_ctx.filteredGroupedTransactions).length === 0))
                                return;
                            if (!(__VLS_ctx.isBulkMode))
                                return;
                            __VLS_ctx.toggleTransactionSelection(t.id);
                            // @ts-ignore
                            [isBulkMode, selectedTransactions, filteredGroupedTransactions, filteredGroupedTransactions, formatters_1.getRelativeDayLabel, formatDateMonth, toggleTransactionSelection,];
                        } });
            }
            var __VLS_112 = TransactionItem_vue_1.default;
            // @ts-ignore
            var __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112(__assign(__assign(__assign(__assign({ 'onDelete': {} }, { 'onClick': {} }), { transaction: (t), categoryName: (((_a = __VLS_ctx.store.categoryMap[t.category_id]) === null || _a === void 0 ? void 0 : _a.name) || 'Outros'), categoryColor: (t.type === 'expense'
                    ? ((_b = __VLS_ctx.store.categoryMap[t.category_id]) === null || _b === void 0 ? void 0 : _b.color) || 'var(--color-error-main)'
                    : 'var(--color-primary-main)'), categoryIcon: ((_c = __VLS_ctx.store.categoryMap[t.category_id]) === null || _c === void 0 ? void 0 : _c.icon), walletName: (((_d = __VLS_ctx.store.walletMap[t.wallet_id]) === null || _d === void 0 ? void 0 : _d.name) || 'Carteira') }), { class: ({ 'ml-10': __VLS_ctx.isBulkMode }) }), { showTime: true })));
            var __VLS_114 = __VLS_113.apply(void 0, __spreadArray([__assign(__assign(__assign(__assign({ 'onDelete': {} }, { 'onClick': {} }), { transaction: (t), categoryName: (((_e = __VLS_ctx.store.categoryMap[t.category_id]) === null || _e === void 0 ? void 0 : _e.name) || 'Outros'), categoryColor: (t.type === 'expense'
                        ? ((_f = __VLS_ctx.store.categoryMap[t.category_id]) === null || _f === void 0 ? void 0 : _f.color) || 'var(--color-error-main)'
                        : 'var(--color-primary-main)'), categoryIcon: ((_g = __VLS_ctx.store.categoryMap[t.category_id]) === null || _g === void 0 ? void 0 : _g.icon), walletName: (((_h = __VLS_ctx.store.walletMap[t.wallet_id]) === null || _h === void 0 ? void 0 : _h.name) || 'Carteira') }), { class: ({ 'ml-10': __VLS_ctx.isBulkMode }) }), { showTime: true })], __VLS_functionalComponentArgsRest(__VLS_113), false));
            var __VLS_117 = void 0;
            var __VLS_118 = ({ delete: {} },
                { onDelete: (__VLS_ctx.handleDelete) });
            var __VLS_119 = ({ click: {} },
                { onClick: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!!(Object.keys(__VLS_ctx.filteredGroupedTransactions).length === 0))
                            return;
                        __VLS_ctx.isBulkMode ? __VLS_ctx.toggleTransactionSelection(t.id) : __VLS_ctx.handleEdit(t);
                        // @ts-ignore
                        [store, store, store, store, isBulkMode, isBulkMode, toggleTransactionSelection, handleDelete, handleEdit,];
                    } });
            /** @type {__VLS_StyleScopedClasses['ml-10']} */ ;
            // @ts-ignore
            [];
        };
        var __VLS_108, __VLS_109, __VLS_115, __VLS_116;
        for (var _q = 0, _r = __VLS_vFor((group.items)); _q < _r.length; _q++) {
            var t = _r[_q][0];
            _loop_1(t);
        }
        // @ts-ignore
        [];
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)(__assign({ class: "side-column" }));
/** @type {__VLS_StyleScopedClasses['side-column']} */ ;
var __VLS_120 = BaseCard_vue_1.default || BaseCard_vue_1.default;
// @ts-ignore
var __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({}));
var __VLS_122 = __VLS_121.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_121), false));
var __VLS_125 = __VLS_123.slots.default;
{
    var __VLS_126 = __VLS_123.slots.header;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex justify-between items-center w-full" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "text-[0.7rem] uppercase font-black opacity-40 tracking-widest" }));
    /** @type {__VLS_StyleScopedClasses['text-[0.7rem]']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-40']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    (__VLS_ctx.monthLabelOnly);
    // @ts-ignore
    [monthLabelOnly,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col gap-6 pt-2" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
var __VLS_127 = BaseSummaryItem_vue_1.default || BaseSummaryItem_vue_1.default;
// @ts-ignore
var __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
    label: "Entradas",
    value: (__VLS_ctx.formatCurrency(__VLS_ctx.store.totalIncome)),
    color: "var(--color-success-main)",
    status: "success",
}));
var __VLS_129 = __VLS_128.apply(void 0, __spreadArray([{
        label: "Entradas",
        value: (__VLS_ctx.formatCurrency(__VLS_ctx.store.totalIncome)),
        color: "var(--color-success-main)",
        status: "success",
    }], __VLS_functionalComponentArgsRest(__VLS_128), false));
var __VLS_132 = __VLS_130.slots.default;
{
    var __VLS_133 = __VLS_130.slots.icon;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2.5",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M12 19V5M5 12l7-7 7 7",
    });
    // @ts-ignore
    [store, formatters_1.formatCurrency,];
}
// @ts-ignore
[];
var __VLS_130;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "h-px bg-black/5 dark:bg-white/5" }));
/** @type {__VLS_StyleScopedClasses['h-px']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
var __VLS_134 = BaseSummaryItem_vue_1.default || BaseSummaryItem_vue_1.default;
// @ts-ignore
var __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
    label: "Saídas",
    value: (__VLS_ctx.formatCurrency(__VLS_ctx.store.totalExpense)),
    color: "var(--color-error-main)",
    status: "error",
}));
var __VLS_136 = __VLS_135.apply(void 0, __spreadArray([{
        label: "Saídas",
        value: (__VLS_ctx.formatCurrency(__VLS_ctx.store.totalExpense)),
        color: "var(--color-error-main)",
        status: "error",
    }], __VLS_functionalComponentArgsRest(__VLS_135), false));
var __VLS_139 = __VLS_137.slots.default;
{
    var __VLS_140 = __VLS_137.slots.icon;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2.5",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M12 5v14M5 12l7 7 7-7",
    });
    // @ts-ignore
    [store, formatters_1.formatCurrency,];
}
// @ts-ignore
[];
var __VLS_137;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "h-px bg-black/5 dark:bg-white/5" }));
/** @type {__VLS_StyleScopedClasses['h-px']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-full p-5 rounded-3xl bg-bg-main dark:bg-black/20 flex flex-col items-center text-center shadow-inner border border-black/5 dark:border-white/5" }));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-bg-main']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-black/20']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-[10px] font-black uppercase tracking-widest text-text-disabled mb-2" }));
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "text-3xl font-black tracking-tighter" }, { class: (__VLS_ctx.store.monthlyBalance >= 0 ? 'text-primary-main' : 'text-error-main') }));
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tighter']} */ ;
(__VLS_ctx.formatCurrencySign(__VLS_ctx.store.monthlyBalance));
// @ts-ignore
[store, store, formatters_1.formatCurrencySign,];
var __VLS_123;
var __VLS_141 = BaseCard_vue_1.default || BaseCard_vue_1.default;
// @ts-ignore
var __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({}));
var __VLS_143 = __VLS_142.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_142), false));
var __VLS_146 = __VLS_144.slots.default;
{
    var __VLS_147 = __VLS_144.slots.header;
    // @ts-ignore
    [];
}
if (__VLS_ctx.store.topCategories.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col items-center justify-center py-12 opacity-40 text-center" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-40']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", width: "36", height: "36", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "1.5", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, { class: "mb-4" }));
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-[10px] font-black uppercase tracking-widest" }));
    /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col gap-6 pt-2" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
    for (var _s = 0, _t = __VLS_vFor((__VLS_ctx.store.topCategories)); _s < _t.length; _s++) {
        var cat = _t[_s][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (cat.id) }, { class: "flex flex-col gap-2.5" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center justify-between" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-2.5" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-2.5 h-2.5 rounded-full shadow-sm" }, { style: ({ backgroundColor: cat.color }) }));
        /** @type {__VLS_StyleScopedClasses['w-2.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-[11px] font-black uppercase tracking-widest text-text-primary" }));
        /** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
        (cat.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-[11px] font-black tracking-tight text-text-disabled" }));
        /** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
        (__VLS_ctx.formatCurrency(cat.total));
        var __VLS_148 = BaseProgressBar_vue_1.default;
        // @ts-ignore
        var __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
            percentage: (cat.percent),
            color: (cat.color),
        }));
        var __VLS_150 = __VLS_149.apply(void 0, __spreadArray([{
                percentage: (cat.percent),
                color: (cat.color),
            }], __VLS_functionalComponentArgsRest(__VLS_149), false));
        // @ts-ignore
        [store, store, formatters_1.formatCurrency,];
    }
    var __VLS_153 = BaseButton_vue_1.default || BaseButton_vue_1.default;
    // @ts-ignore
    var __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153(__assign(__assign({ 'onClick': {} }, { variant: "ghost" }), { class: "w-full text-[10px] uppercase font-black tracking-widest mt-4" })));
    var __VLS_155 = __VLS_154.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { variant: "ghost" }), { class: "w-full text-[10px] uppercase font-black tracking-widest mt-4" })], __VLS_functionalComponentArgsRest(__VLS_154), false));
    var __VLS_158 = void 0;
    var __VLS_159 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.store.topCategories.length === 0))
                    return;
                __VLS_ctx.$router.push('/reports');
                // @ts-ignore
                [$router,];
            } });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    var __VLS_160 = __VLS_156.slots.default;
    // @ts-ignore
    [];
    var __VLS_156;
    var __VLS_157;
}
// @ts-ignore
[];
var __VLS_144;
var __VLS_161;
/** @ts-ignore @type {typeof __VLS_components.Teleport | typeof __VLS_components.Teleport} */
Teleport;
// @ts-ignore
var __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
    to: "body",
}));
var __VLS_163 = __VLS_162.apply(void 0, __spreadArray([{
        to: "body",
    }], __VLS_functionalComponentArgsRest(__VLS_162), false));
var __VLS_166 = __VLS_164.slots.default;
var __VLS_167 = TransactionDialog_vue_1.default;
// @ts-ignore
var __VLS_168 = __VLS_asFunctionalComponent1(__VLS_167, new __VLS_167(__assign(__assign({ 'onClose': {} }, { 'onSaved': {} }), { transaction: (__VLS_ctx.editingTransaction), show: (__VLS_ctx.showForm) })));
var __VLS_169 = __VLS_168.apply(void 0, __spreadArray([__assign(__assign({ 'onClose': {} }, { 'onSaved': {} }), { transaction: (__VLS_ctx.editingTransaction), show: (__VLS_ctx.showForm) })], __VLS_functionalComponentArgsRest(__VLS_168), false));
var __VLS_172;
var __VLS_173 = ({ close: {} },
    { onClose: (__VLS_ctx.handleCloseForm) });
var __VLS_174 = ({ saved: {} },
    { onSaved: (__VLS_ctx.refreshTransactions) });
var __VLS_170;
var __VLS_171;
var __VLS_175 = BaseConfirmDialog_vue_1.default;
// @ts-ignore
var __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175(__assign(__assign({ 'onConfirm': {} }, { 'onCancel': {} }), { show: (__VLS_ctx.showConfirmDelete), title: "Excluir Transação", message: "Tem certeza que deseja excluir esta transação? Esta ação não poderá ser desfeita.", confirmText: "Excluir", cancelText: "Cancelar" })));
var __VLS_177 = __VLS_176.apply(void 0, __spreadArray([__assign(__assign({ 'onConfirm': {} }, { 'onCancel': {} }), { show: (__VLS_ctx.showConfirmDelete), title: "Excluir Transação", message: "Tem certeza que deseja excluir esta transação? Esta ação não poderá ser desfeita.", confirmText: "Excluir", cancelText: "Cancelar" })], __VLS_functionalComponentArgsRest(__VLS_176), false));
var __VLS_180;
var __VLS_181 = ({ confirm: {} },
    { onConfirm: (__VLS_ctx.confirmDelete) });
var __VLS_182 = ({ cancel: {} },
    { onCancel: (__VLS_ctx.cancelDelete) });
var __VLS_178;
var __VLS_179;
var __VLS_183;
/** @ts-ignore @type {typeof __VLS_components.Toast} */
toast_1.default;
// @ts-ignore
var __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({}));
var __VLS_185 = __VLS_184.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_184), false));
if (__VLS_ctx.isMobile) {
    var __VLS_188 = BaseButton_vue_1.default || BaseButton_vue_1.default;
    // @ts-ignore
    var __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188(__assign({ 'onClick': {} }, { variant: "primary", pt: ({
            root: {
                class: 'fixed bottom-24 right-6 md:bottom-10 md:right-10 !w-14 !h-14 !rounded-full !p-0 flex items-center justify-center shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:-translate-y-1 transition-all z-50',
            },
        }), 'aria-label': "Nova Transação" })));
    var __VLS_190 = __VLS_189.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { variant: "primary", pt: ({
                root: {
                    class: 'fixed bottom-24 right-6 md:bottom-10 md:right-10 !w-14 !h-14 !rounded-full !p-0 flex items-center justify-center shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:-translate-y-1 transition-all z-50',
                },
            }), 'aria-label': "Nova Transação" })], __VLS_functionalComponentArgsRest(__VLS_189), false));
    var __VLS_193 = void 0;
    var __VLS_194 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.isMobile))
                    return;
                __VLS_ctx.openNewForm();
                // @ts-ignore
                [isMobile, openNewForm, editingTransaction, showForm, handleCloseForm, refreshTransactions, showConfirmDelete, confirmDelete, cancelDelete,];
            } });
    var __VLS_195 = __VLS_191.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2.5",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line, __VLS_intrinsics.line)({
        x1: "12",
        y1: "5",
        x2: "12",
        y2: "19",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line, __VLS_intrinsics.line)({
        x1: "5",
        y1: "12",
        x2: "19",
        y2: "12",
    });
    // @ts-ignore
    [];
    var __VLS_191;
    var __VLS_192;
}
// @ts-ignore
[];
var __VLS_164;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
