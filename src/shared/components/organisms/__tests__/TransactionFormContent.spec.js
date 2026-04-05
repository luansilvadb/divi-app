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
var vitest_1 = require("vitest");
var test_utils_1 = require("@vue/test-utils");
var TransactionFormContent_vue_1 = require("../TransactionFormContent.vue");
var testing_1 = require("@pinia/testing");
var transactionStore_1 = require("@/modules/transactions/application/stores/transactionStore");
(0, vitest_1.describe)('TransactionFormContent.vue', function () {
    var global = {
        plugins: [(0, testing_1.createTestingPinia)({ createSpy: vitest_1.vi.fn })],
        stubs: {
            BaseInput: true,
            BaseSelect: true,
            BaseButton: true,
            SelectButton: true,
        },
    };
    var store;
    (0, vitest_1.beforeEach)(function () {
        store = (0, transactionStore_1.useTransactionStore)();
        store.categories = [
            { id: '1', name: 'Alimentação', icon: 'food', color: '#ff0000' },
            { id: '2', name: 'Transporte', icon: 'car', color: '#00ff00' },
        ];
        store.wallets = [
            { id: 'w1', name: 'Nubank', balance: 1000, currency: 'BRL' },
        ];
    });
    (0, vitest_1.it)('suggests a category based on title input', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper;
        return __generator(this, function (_a) {
            wrapper = (0, test_utils_1.mount)(TransactionFormContent_vue_1.default, { global: global });
            return [2 /*return*/];
        });
    }); });
    (0, vitest_1.it)('prevents submission if required fields are missing (Expected to FAIL)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper, form;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = (0, test_utils_1.mount)(TransactionFormContent_vue_1.default, { global: global });
                    form = wrapper.find('form');
                    return [4 /*yield*/, form.trigger('submit.prevent')
                        // Since there is no validation, it will call store.saveTransaction immediately
                        // A proper implementation should show errors and NOT call the store
                    ];
                case 1:
                    _a.sent();
                    // Since there is no validation, it will call store.saveTransaction immediately
                    // A proper implementation should show errors and NOT call the store
                    (0, vitest_1.expect)(store.saveTransaction).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
