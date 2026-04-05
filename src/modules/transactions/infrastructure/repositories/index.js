"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexieCategoryRepository = exports.DexieWalletRepository = exports.DexieSupabaseTransactionRepository = void 0;
var db_1 = require("@/core/db");
var supabase_1 = require("@/core/supabase");
var errors_1 = require("../../domain/errors");
var DexieSupabaseTransactionRepository = /** @class */ (function () {
    function DexieSupabaseTransactionRepository() {
    }
    DexieSupabaseTransactionRepository.prototype.getAll = function () {
        return __awaiter(this, void 0, Promise, function () {
            var list, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.transactions.toArray()];
                    case 1:
                        list = _a.sent();
                        return [2 /*return*/, list.map(function (item) { return _this.mapToEntity(item); })];
                    case 2:
                        err_1 = _a.sent();
                        throw new errors_1.InfrastructureError('Failed to get all transactions from local DB', err_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DexieSupabaseTransactionRepository.prototype.getByMonth = function (year, month) {
        return __awaiter(this, void 0, Promise, function () {
            var start, end, list, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        start = new Date(year, month - 1, 1).toISOString();
                        end = new Date(year, month, 0, 23, 59, 59).toISOString();
                        return [4 /*yield*/, db_1.db.transactions
                                .where('date')
                                .between(start, end)
                                .and(function (t) { return !t.deleted; })
                                .toArray()];
                    case 1:
                        list = _a.sent();
                        return [2 /*return*/, list.map(function (item) { return _this.mapToEntity(item); })];
                    case 2:
                        err_2 = _a.sent();
                        throw new errors_1.InfrastructureError('Failed to get transactions by month from local DB', err_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DexieSupabaseTransactionRepository.prototype.save = function (transaction) {
        return __awaiter(this, void 0, Promise, function () {
            var now, localData, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        now = new Date().toISOString();
                        localData = __assign(__assign({}, transaction), { synced: false, updated_at: now });
                        if (!transaction.localId) return [3 /*break*/, 2];
                        return [4 /*yield*/, db_1.db.transactions.put(localData)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, db_1.db.transactions.add(localData)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        // Attempt background sync
                        this.sync().catch(function (err) { return console.error('[TransactionSync] Background sync error', err); });
                        return [3 /*break*/, 6];
                    case 5:
                        err_3 = _a.sent();
                        throw new errors_1.InfrastructureError('Failed to save transaction to local DB', err_3);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DexieSupabaseTransactionRepository.prototype.delete = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Soft delete locally
                        return [4 /*yield*/, db_1.db.transactions.where('id').equals(id).modify({ deleted: true, synced: false })];
                    case 1:
                        // Soft delete locally
                        _a.sent();
                        this.sync().catch(function (err) { return console.error('[TransactionSync] Background sync error', err); });
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        throw new errors_1.InfrastructureError('Failed to delete transaction', err_4);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DexieSupabaseTransactionRepository.prototype.sync = function () {
        return __awaiter(this, void 0, Promise, function () {
            var unsynced, toDelete, toUpsert, i, len, item, deleteIds, error, localDeleteIds, upsertPayload, _a, data, error, remoteIds, recordsToUpdate, i, len, item, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, db_1.db.transactions.where('synced').equals(0).toArray()];
                    case 1:
                        unsynced = _b.sent();
                        if (unsynced.length === 0)
                            return [2 /*return*/];
                        toDelete = [];
                        toUpsert = [];
                        for (i = 0, len = unsynced.length; i < len; i++) {
                            item = unsynced[i];
                            if (item.deleted && item.id) {
                                toDelete.push(item);
                            }
                            else if (!item.deleted) {
                                toUpsert.push(item);
                            }
                        }
                        if (!(toDelete.length > 0)) return [3 /*break*/, 5];
                        deleteIds = toDelete.map(function (i) { return i.id; });
                        return [4 /*yield*/, supabase_1.supabase.from('transactions').delete().in('id', deleteIds)];
                    case 2:
                        error = (_b.sent()).error;
                        if (!!error) return [3 /*break*/, 4];
                        localDeleteIds = toDelete.map(function (i) { return i.localId; });
                        return [4 /*yield*/, db_1.db.transactions.bulkDelete(localDeleteIds)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4: throw new errors_1.InfrastructureError('[Sync] Bulk delete failed', error);
                    case 5:
                        if (!(toUpsert.length > 0)) return [3 /*break*/, 8];
                        upsertPayload = toUpsert.map(function (item) { return ({
                            id: item.id,
                            title: item.title,
                            amount: item.amount,
                            type: item.type,
                            date: item.date,
                            category_id: item.category_id,
                            wallet_id: item.wallet_id,
                            payee_id: item.payee_id,
                            user_id: item.user_id,
                            notes: item.notes,
                            updated_at: item.updated_at,
                        }); });
                        return [4 /*yield*/, supabase_1.supabase
                                .from('transactions')
                                .upsert(upsertPayload)
                                .select('id')];
                    case 6:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            throw new errors_1.InfrastructureError('[Sync] Bulk upsert failed', error);
                        }
                        if (!data) return [3 /*break*/, 8];
                        remoteIds = new Set(data.map(function (d) { return d.id; }));
                        recordsToUpdate = [];
                        for (i = 0, len = toUpsert.length; i < len; i++) {
                            item = toUpsert[i];
                            if (remoteIds.has(item.id)) {
                                item.synced = true;
                                recordsToUpdate.push(item);
                            }
                        }
                        if (!(recordsToUpdate.length > 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, db_1.db.transactions.bulkPut(recordsToUpdate)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        err_5 = _b.sent();
                        if (err_5 instanceof errors_1.InfrastructureError)
                            throw err_5;
                        throw new errors_1.InfrastructureError('Sync process failed', err_5);
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    DexieSupabaseTransactionRepository.prototype.mapToEntity = function (item) {
        var t = __assign(__assign({}, item), { synced: !!item.synced, deleted: !!item.deleted });
        // Pre-calculate derivations to optimize UI rendering
        return __assign(__assign({}, t), { _titleLower: t.title.toLowerCase(), _timestamp: new Date(t.date).getTime(), _dateKey: t.date.substring(0, 10) });
    };
    return DexieSupabaseTransactionRepository;
}());
exports.DexieSupabaseTransactionRepository = DexieSupabaseTransactionRepository;
var DexieWalletRepository = /** @class */ (function () {
    function DexieWalletRepository() {
    }
    DexieWalletRepository.prototype.getAll = function () {
        return __awaiter(this, void 0, Promise, function () {
            var list, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.wallets.toArray()];
                    case 1:
                        list = _a.sent();
                        return [2 /*return*/, list];
                    case 2:
                        err_6 = _a.sent();
                        throw new errors_1.InfrastructureError('Failed to get wallets from local DB', err_6);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DexieWalletRepository.prototype.save = function (wallet) {
        return __awaiter(this, void 0, Promise, function () {
            var err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.wallets.put(__assign(__assign({}, wallet), { synced: false }))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_7 = _a.sent();
                        throw new errors_1.InfrastructureError('Failed to save wallet to local DB', err_7);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DexieWalletRepository.prototype.getById = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var w, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.wallets.get(id)];
                    case 1:
                        w = _a.sent();
                        return [2 /*return*/, w ? w : null];
                    case 2:
                        err_8 = _a.sent();
                        throw new errors_1.InfrastructureError('Failed to get wallet by ID from local DB', err_8);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return DexieWalletRepository;
}());
exports.DexieWalletRepository = DexieWalletRepository;
var DexieCategoryRepository = /** @class */ (function () {
    function DexieCategoryRepository() {
    }
    DexieCategoryRepository.prototype.getAll = function () {
        return __awaiter(this, void 0, Promise, function () {
            var list, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.categories.toArray()];
                    case 1:
                        list = _a.sent();
                        return [2 /*return*/, list];
                    case 2:
                        err_9 = _a.sent();
                        throw new errors_1.InfrastructureError('Failed to get categories from local DB', err_9);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DexieCategoryRepository.prototype.save = function (category) {
        return __awaiter(this, void 0, Promise, function () {
            var err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.categories.put(__assign(__assign({}, category), { synced: false }))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_10 = _a.sent();
                        throw new errors_1.InfrastructureError('Failed to save category to local DB', err_10);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return DexieCategoryRepository;
}());
exports.DexieCategoryRepository = DexieCategoryRepository;
