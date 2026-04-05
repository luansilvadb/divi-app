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
exports.DexieLoanRepository = void 0;
var db_1 = require("@/core/db");
var supabase_1 = require("@/core/supabase");
var errors_1 = require("../../domain/errors");
var DexieLoanRepository = /** @class */ (function () {
    function DexieLoanRepository() {
    }
    DexieLoanRepository.prototype.getAll = function () {
        return __awaiter(this, void 0, Promise, function () {
            var list, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.loans.toArray()];
                    case 1:
                        list = _a.sent();
                        return [2 /*return*/, list.map(this.mapToEntity)];
                    case 2:
                        err_1 = _a.sent();
                        throw new errors_1.InfrastructureError('Failed to fetch loans from local DB', err_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DexieLoanRepository.prototype.save = function (loan) {
        return __awaiter(this, void 0, Promise, function () {
            var data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = __assign(__assign({}, loan), { synced: false });
                        return [4 /*yield*/, db_1.db.loans.put(data)
                            // Attempt background sync
                        ];
                    case 1:
                        _a.sent();
                        // Attempt background sync
                        this.sync().catch(function (err) { return console.error('[LoanSync] Background sync error', err); });
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        throw new errors_1.InfrastructureError('Failed to save loan to local DB', err_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DexieLoanRepository.prototype.delete = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var error, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, db_1.db.loans.delete(id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supabase_1.supabase.from('loans').delete().eq('id', id)];
                    case 2:
                        error = (_a.sent()).error;
                        if (error) {
                            throw new errors_1.InfrastructureError('Error syncing loan deletion with Supabase', error);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        if (err_3 instanceof errors_1.InfrastructureError)
                            throw err_3;
                        throw new errors_1.InfrastructureError('Failed to delete loan', err_3);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DexieLoanRepository.prototype.sync = function () {
        return __awaiter(this, void 0, Promise, function () {
            var unsynced, upsertPayload, _a, data, error, idsToUpdate_1, err_4;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, db_1.db.loans.where('synced').equals(0).toArray()];
                    case 1:
                        unsynced = _b.sent();
                        if (unsynced.length === 0)
                            return [2 /*return*/];
                        upsertPayload = unsynced.map(function (item) { return ({
                            id: item.id,
                            user_id: item.user_id,
                            name: item.name,
                            total_value: item.total_value,
                            remaining_value: item.remaining_value,
                            interest_rate: item.interest_rate,
                            due_date: item.due_date,
                            created_at: item.created_at,
                        }); });
                        return [4 /*yield*/, supabase_1.supabase.from('loans').upsert(upsertPayload).select('id')];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            throw new errors_1.InfrastructureError('[Sync] Bulk upsert failed', error);
                        }
                        if (!data) return [3 /*break*/, 4];
                        idsToUpdate_1 = data.map(function (d) { return d.id; });
                        return [4 /*yield*/, db_1.db.transaction('rw', db_1.db.loans, function () { return __awaiter(_this, void 0, void 0, function () {
                                var records, validRecords;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, db_1.db.loans.bulkGet(idsToUpdate_1)];
                                        case 1:
                                            records = _a.sent();
                                            validRecords = records.reduce(function (acc, record) {
                                                if (record) {
                                                    acc.push(__assign(__assign({}, record), { synced: true }));
                                                }
                                                return acc;
                                            }, []);
                                            if (!(validRecords.length > 0)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, db_1.db.loans.bulkPut(validRecords)];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_4 = _b.sent();
                        if (err_4 instanceof errors_1.InfrastructureError)
                            throw err_4;
                        throw new errors_1.InfrastructureError('Sync process failed', err_4);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DexieLoanRepository.prototype.mapToEntity = function (item) {
        return {
            id: item.id,
            user_id: item.user_id,
            name: item.name,
            total_value: item.total_value,
            remaining_value: item.remaining_value,
            interest_rate: item.interest_rate,
            due_date: item.due_date,
            created_at: item.created_at,
        };
    };
    return DexieLoanRepository;
}());
exports.DexieLoanRepository = DexieLoanRepository;
