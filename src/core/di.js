"use strict";
/**
 * Simple Dependency Injection (DI) Container
 * Facilitates strict layer isolation according to Clean Architecture
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useService = exports.container = void 0;
var SupabaseAuthService_1 = require("../modules/auth/infrastructure/services/SupabaseAuthService");
var index_1 = require("../modules/transactions/infrastructure/repositories/index");
var PayeeRepository_1 = require("../modules/transactions/infrastructure/repositories/PayeeRepository");
var DexieLoanRepository_1 = require("../modules/loans/infrastructure/repositories/DexieLoanRepository");
var DexieBudgetRepository_1 = require("../modules/budgets/infrastructure/repositories/DexieBudgetRepository");
var DexieGoalRepository_1 = require("../modules/goals/infrastructure/repositories/DexieGoalRepository");
var DexieSubscriptionRepository_1 = require("../modules/subscriptions/infrastructure/repositories/DexieSubscriptionRepository");
var ActivityLogService_1 = require("../modules/activity-log/application/services/ActivityLogService");
var ExportService_1 = require("../modules/transactions/application/services/ExportService");
var asset_loader_1 = require("../shared/utils/asset-loader");
var BudgetLogicService_1 = require("../modules/budgets/application/services/BudgetLogicService");
var GoalLogicService_1 = require("../modules/goals/application/services/GoalLogicService");
var Container = /** @class */ (function () {
    function Container() {
        this.services = new Map();
    }
    /**
     * Register a service by token or class reference
     */
    Container.prototype.register = function (token, instance) {
        var key = typeof token === 'string' ? token : token.name;
        this.services.set(key, instance);
        console.debug("[DI] Registered: ".concat(key));
    };
    /**
     */
    Container.prototype.resolve = function (token) {
        var key = typeof token === 'string' ? token : token.name;
        var service = this.services.get(key);
        if (!service) {
            throw new Error("[DI] Service not found: ".concat(key));
        }
        return service;
    };
    return Container;
}());
exports.container = new Container();
var di_tokens_1 = require("./di-tokens");
// To maintain compatibility with existing code during migration,
// we register both with the string from DI_TOKENS and the explicit string.
exports.container.register(di_tokens_1.DI_TOKENS.AuthService, new SupabaseAuthService_1.SupabaseAuthService());
exports.container.register(di_tokens_1.DI_TOKENS.TransactionRepository, new index_1.DexieSupabaseTransactionRepository());
exports.container.register(di_tokens_1.DI_TOKENS.WalletRepository, new index_1.DexieWalletRepository());
exports.container.register(di_tokens_1.DI_TOKENS.CategoryRepository, new index_1.DexieCategoryRepository());
exports.container.register(di_tokens_1.DI_TOKENS.PayeeRepository, new PayeeRepository_1.DexiePayeeRepository());
exports.container.register(di_tokens_1.DI_TOKENS.LoanRepository, new DexieLoanRepository_1.DexieLoanRepository());
exports.container.register(di_tokens_1.DI_TOKENS.BudgetRepository, new DexieBudgetRepository_1.DexieBudgetRepository());
exports.container.register(di_tokens_1.DI_TOKENS.GoalRepository, new DexieGoalRepository_1.DexieGoalRepository());
exports.container.register(di_tokens_1.DI_TOKENS.BudgetLogicService, new BudgetLogicService_1.BudgetLogicService());
exports.container.register(di_tokens_1.DI_TOKENS.GoalLogicService, new GoalLogicService_1.GoalLogicService());
exports.container.register(di_tokens_1.DI_TOKENS.SubscriptionRepository, new DexieSubscriptionRepository_1.DexieSubscriptionRepository());
var activityLogService = new ActivityLogService_1.ActivityLogService();
exports.container.register(di_tokens_1.DI_TOKENS.ActivityLogService, activityLogService);
exports.container.register(di_tokens_1.DI_TOKENS.AssetLoader, new asset_loader_1.AssetLoader(activityLogService));
exports.container.register(di_tokens_1.DI_TOKENS.ExportService, new ExportService_1.ExportService());
// Helper to provide/inject services in Vue components if needed
var useService = function (token) { return exports.container.resolve(token); };
exports.useService = useService;
