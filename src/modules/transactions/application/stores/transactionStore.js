"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTransactionStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var di_1 = require("@/core/di");
var di_tokens_1 = require("@/core/di-tokens");
exports.useTransactionStore = (0, pinia_1.defineStore)('transactions', function () {
    // Repositories
    var transactionRepo = di_1.container.resolve(di_tokens_1.DI_TOKENS.TransactionRepository);
    var walletRepo = di_1.container.resolve(di_tokens_1.DI_TOKENS.WalletRepository);
    var categoryRepo = di_1.container.resolve(di_tokens_1.DI_TOKENS.CategoryRepository);
    // State
    var transactions = (0, vue_1.shallowRef)([]);
    var wallets = (0, vue_1.shallowRef)([]);
    var categories = (0, vue_1.shallowRef)([]);
    var isLoading = (0, vue_1.ref)(false);
    // UI State
    var searchQuery = (0, vue_1.ref)('');
    // Maps for O(1) Lookups
    var categoryMap = (0, vue_1.shallowRef)({});
    var walletMap = (0, vue_1.shallowRef)({});
    var totalIncome = (0, vue_1.ref)(0);
    var totalExpense = (0, vue_1.ref)(0);
    var monthlyBalance = (0, vue_1.computed)(function () { return totalIncome.value - totalExpense.value; });
    // Top Categories Single Pass
    var topCategories = (0, vue_1.computed)(function () {
        var catMap = {};
        var trans = transactions.value;
        for (var i = 0, len = trans.length; i < len; i++) {
            var t = trans[i];
            if (t.type === 'expense') {
                catMap[t.category_id] = (catMap[t.category_id] || 0) + t.amount;
            }
        }
        var expenseTotal = totalExpense.value;
        if (expenseTotal === 0)
            return [];
        return Object.entries(catMap)
            .map(function (_a) {
            var id = _a[0], total = _a[1];
            var cat = categoryMap.value[id];
            return {
                id: id,
                name: (cat === null || cat === void 0 ? void 0 : cat.name) || 'Outros',
                color: (cat === null || cat === void 0 ? void 0 : cat.color) || '#9ca3af',
                total: total,
                percent: (total / expenseTotal) * 100,
            };
        })
            .sort(function (a, b) { return b.total - a.total; })
            .slice(0, 5);
    });
    // Sort happens on fetch/update now, preventing O(N log N) on every UI computation.
    (0, vue_1.watch)(transactions, function (newTransactions) {
        var inc = 0;
        var exp = 0;
        for (var i = 0, len = newTransactions.length; i < len; i++) {
            var t = newTransactions[i];
            if (t.type === 'income')
                inc += t.amount;
            else if (t.type === 'expense')
                exp += t.amount;
        }
        totalIncome.value = inc;
        totalExpense.value = exp;
    }, { immediate: true });
    // UI Getters
    var uiTransactions = (0, vue_1.computed)(function () {
        return transactions.value;
    });
    var filteredTransactionsArray = (0, vue_1.computed)(function () {
        if (!searchQuery.value.trim())
            return uiTransactions.value;
        var query = searchQuery.value.toLowerCase().trim();
        var result = [];
        var trans = uiTransactions.value;
        var catMap = categoryMap.value;
        for (var i = 0, len = trans.length; i < len; i++) {
            var t = trans[i];
            if (t._titleLower.includes(query)) {
                result.push(t);
                continue;
            }
            var cat = catMap[t.category_id];
            if (cat && cat.name.toLowerCase().includes(query)) {
                result.push(t);
            }
        }
        return result;
    });
    var groupedTransactions = (0, vue_1.computed)(function () {
        var groups = {};
        var source = filteredTransactionsArray.value;
        for (var i = 0, len = source.length; i < len; i++) {
            var t = source[i];
            var dateKey = t._dateKey;
            if (dateKey) {
                var group = groups[dateKey];
                if (!group) {
                    group = { total: 0, items: [] };
                    groups[dateKey] = group;
                }
                group.items.push(t);
                group.total += t.type === 'income' ? t.amount : -t.amount;
            }
        }
        return groups;
    });
    // Actions
    function fetchWallets() {
        return __awaiter(this, void 0, void 0, function () {
            var w, map, i, len, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, walletRepo.getAll()];
                    case 1:
                        w = _a.sent();
                        wallets.value = w;
                        map = {};
                        for (i = 0, len = w.length; i < len; i++) {
                            item = w[i];
                            map[item.id] = item;
                        }
                        walletMap.value = map;
                        return [2 /*return*/];
                }
            });
        });
    }
    function fetchCategories() {
        return __awaiter(this, void 0, void 0, function () {
            var c, map, i, len, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, categoryRepo.getAll()];
                    case 1:
                        c = _a.sent();
                        categories.value = c;
                        map = {};
                        for (i = 0, len = c.length; i < len; i++) {
                            item = c[i];
                            map[item.id] = item;
                        }
                        categoryMap.value = map;
                        return [2 /*return*/];
                }
            });
        });
    }
    function fetchTransactionsByMonth(year, month) {
        return __awaiter(this, void 0, void 0, function () {
            var raw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isLoading.value = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, transactionRepo.getByMonth(year, month)
                            // Sort by timestamp descending once, preventing sorted re-computations in groupedTransactions
                        ];
                    case 2:
                        raw = _a.sent();
                        // Sort by timestamp descending once, preventing sorted re-computations in groupedTransactions
                        raw.sort(function (a, b) {
                            var timeA = a._timestamp;
                            var timeB = b._timestamp;
                            return timeB - timeA;
                        });
                        transactions.value = raw;
                        return [3 /*break*/, 4];
                    case 3:
                        isLoading.value = false;
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function saveTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var date;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, transactionRepo.save(transaction)];
                    case 1:
                        _a.sent();
                        date = new Date(transaction.date);
                        return [4 /*yield*/, fetchTransactionsByMonth(date.getFullYear(), date.getMonth() + 1)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function deleteTransaction(id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, transactionRepo.delete(id)];
                    case 1:
                        _a.sent();
                        transactions.value = transactions.value.filter(function (t) { return t.id !== id; });
                        return [2 /*return*/];
                }
            });
        });
    }
    return {
        transactions: transactions,
        wallets: wallets,
        categories: categories,
        isLoading: isLoading,
        searchQuery: searchQuery,
        categoryMap: categoryMap,
        walletMap: walletMap,
        totalIncome: totalIncome,
        totalExpense: totalExpense,
        monthlyBalance: monthlyBalance,
        topCategories: topCategories,
        groupedTransactions: groupedTransactions,
        fetchWallets: fetchWallets,
        fetchCategories: fetchCategories,
        fetchTransactionsByMonth: fetchTransactionsByMonth,
        saveTransaction: saveTransaction,
        deleteTransaction: deleteTransaction,
    };
});
