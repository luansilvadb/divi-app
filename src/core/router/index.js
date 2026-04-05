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
var vue_router_1 = require("vue-router");
var di_1 = require("../di");
var router = (0, vue_router_1.createRouter)({
    history: (0, vue_router_1.createWebHistory)(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: function () { return Promise.resolve().then(function () { return require('../../modules/dashboard/ui/views/DashboardView.vue'); }); },
            meta: { requiresAuth: true },
        },
        {
            path: '/transactions',
            name: 'transactions',
            component: function () { return Promise.resolve().then(function () { return require('../../modules/transactions/ui/views/TransactionsView.vue'); }); },
            meta: { requiresAuth: true },
        },
        {
            path: '/budgets',
            name: 'budgets',
            component: function () { return Promise.resolve().then(function () { return require('../../modules/budgets/ui/views/BudgetsView.vue'); }); },
            meta: { requiresAuth: true },
        },
        {
            path: '/goals',
            name: 'goals',
            component: function () { return Promise.resolve().then(function () { return require('../../modules/goals/ui/views/GoalsView.vue'); }); },
            meta: { requiresAuth: true },
        },
        {
            path: '/loans',
            name: 'loans',
            component: function () { return Promise.resolve().then(function () { return require('../../modules/loans/ui/views/LoansView.vue'); }); },
            meta: { requiresAuth: true },
        },
        {
            path: '/subscriptions',
            name: 'subscriptions',
            component: function () { return Promise.resolve().then(function () { return require('../../modules/subscriptions/ui/views/SubscriptionsView.vue'); }); },
            meta: { requiresAuth: true },
        },
        {
            path: '/calendar',
            name: 'calendar',
            component: function () { return Promise.resolve().then(function () { return require('../../modules/calendar/ui/views/CalendarView.vue'); }); },
            meta: { requiresAuth: true },
        },
        {
            path: '/reports',
            name: 'reports',
            component: function () { return Promise.resolve().then(function () { return require('../../modules/reports/ui/views/ReportsView.vue'); }); },
            meta: { requiresAuth: true },
        },
        {
            path: '/activity-log',
            name: 'activity-log',
            component: function () { return Promise.resolve().then(function () { return require('../../modules/activity-log/ui/views/ActivityLogView.vue'); }); },
            meta: { requiresAuth: true },
        },
        {
            path: '/login',
            name: 'login',
            component: function () { return Promise.resolve().then(function () { return require('../../modules/auth/ui/views/LoginView.vue'); }); },
            meta: { guestOnly: true },
        },
    ],
});
// Auth Guard logic
router.beforeEach(function (to, _from) { return __awaiter(void 0, void 0, void 0, function () {
    var authService, user, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                authService = di_1.container.resolve('IAuthService');
                return [4 /*yield*/, authService.getCurrentUser()];
            case 1:
                user = _a.sent();
                if (to.meta.requiresAuth && !user) {
                    return [2 /*return*/, { name: 'login' }];
                }
                else if (to.meta.guestOnly && user) {
                    return [2 /*return*/, { name: 'dashboard' }];
                }
                else {
                    return [2 /*return*/, true];
                }
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.error('Router Auth Guard Error:', e_1);
                return [2 /*return*/, true];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
