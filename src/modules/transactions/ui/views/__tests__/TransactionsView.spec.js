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
var pinia_1 = require("pinia");
var TransactionsView_vue_1 = require("../TransactionsView.vue");
var vue_1 = require("vue");
var config_1 = require("primevue/config");
// Mock shared components
vitest_1.vi.mock('@/shared/components/organisms/BaseViewHeader.vue', function () { return ({
    default: { template: '<div><slot name="action" /></div>' },
}); });
// Mock StandardPageLayout
vitest_1.vi.mock('@/shared/components/templates/StandardPageLayout.vue', function () { return ({
    default: { template: '<div><slot name="action" /><slot /></div>' },
}); });
// Mock useIsMobile
var isMobileMock = (0, vue_1.ref)(false);
vitest_1.vi.mock('@/shared/composables/useIsMobile', function () { return ({
    useIsMobile: function () { return isMobileMock; },
}); });
// Mock the db file specifically before it gets imported by anything else
vitest_1.vi.mock('@/core/db', function () { return ({
    db: {
        wallets: { toArray: vitest_1.vi.fn().mockResolvedValue([]) },
        categories: { toArray: vitest_1.vi.fn().mockResolvedValue([]) },
        transactions: {
            toArray: vitest_1.vi.fn().mockResolvedValue([]),
            where: vitest_1.vi.fn().mockReturnValue({
                between: vitest_1.vi.fn().mockReturnValue({
                    and: vitest_1.vi.fn().mockReturnValue({
                        toArray: vitest_1.vi.fn().mockResolvedValue([]),
                    }),
                }),
            }),
        },
    },
}); });
// Mock transaction store to avoid IndexedDB calls
vitest_1.vi.mock('../../application/stores/transactionStore', function () { return ({
    useTransactionStore: function () { return ({
        transactions: [],
        wallets: [],
        categories: [],
        isLoading: false,
        searchQuery: '',
        categoryMap: {},
        walletMap: {},
        totalIncome: 0,
        totalExpense: 0,
        monthlyBalance: 0,
        topCategories: [],
        groupedTransactions: {},
        fetchWallets: vitest_1.vi.fn().mockResolvedValue(undefined),
        fetchCategories: vitest_1.vi.fn().mockResolvedValue(undefined),
        fetchTransactionsByMonth: vitest_1.vi.fn().mockResolvedValue(undefined),
    }); },
}); });
(0, vitest_1.describe)('TransactionsView', function () {
    (0, vitest_1.beforeEach)(function () {
        (0, pinia_1.setActivePinia)((0, pinia_1.createPinia)());
        isMobileMock.value = false;
    });
    (0, vitest_1.it)('renders correctly on desktop', function () {
        isMobileMock.value = false;
        var wrapper = (0, test_utils_1.mount)(TransactionsView_vue_1.default, {
            global: {
                plugins: [config_1.default],
                stubs: {
                    BaseButton: {
                        template: '<button><slot /></button>'
                    },
                    TransactionItem: true,
                    BaseCard: true,
                    BaseSummaryItem: true,
                    BaseProgressBar: true,
                    StandardPageLayout: false,
                    BaseConfirmDialog: true,
                    TransactionModal: true,
                    TransactionBottomSheet: true,
                    Teleport: true
                },
            },
        });
        (0, vitest_1.expect)(wrapper.exists()).toBe(true);
        // Desktop: Should have 'Adicionar' button and NO FAB
        (0, vitest_1.expect)(wrapper.text()).toContain('Adicionar');
        (0, vitest_1.expect)(wrapper.html()).not.toContain('aria-label="Nova Transação"');
    });
    (0, vitest_1.it)('renders correctly on mobile', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isMobileMock.value = true;
                    wrapper = (0, test_utils_1.mount)(TransactionsView_vue_1.default, {
                        global: {
                            plugins: [config_1.default],
                            stubs: {
                                BaseButton: true,
                                TransactionItem: true,
                                BaseCard: true,
                                BaseSummaryItem: true,
                                BaseProgressBar: true,
                                StandardPageLayout: false,
                                BaseConfirmDialog: true,
                                TransactionModal: true,
                                TransactionBottomSheet: true,
                                Teleport: true
                            },
                        },
                    });
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(wrapper.exists()).toBe(true);
                    // Mobile: Should have FAB and NO 'Adicionar' button
                    (0, vitest_1.expect)(wrapper.html()).toContain('aria-label="Nova Transação"');
                    (0, vitest_1.expect)(wrapper.html()).not.toContain('Adicionar');
                    return [2 /*return*/];
            }
        });
    }); });
});
