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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var di_1 = require("./core/di");
var theme_1 = require("./core/theme");
var sidebarStore_1 = require("./shared/stores/sidebarStore");
var MainLayout_vue_1 = require("./shared/components/templates/MainLayout.vue");
var router = (0, vue_router_1.useRouter)();
var route = (0, vue_router_1.useRoute)();
var sidebarStore = (0, sidebarStore_1.useSidebarStore)();
(0, theme_1.useTheme)();
var authService = di_1.container.resolve('IAuthService');
var isLoggedIn = (0, vue_1.ref)(false);
var user = (0, vue_1.ref)(null);
var isLoginRoute = (0, vue_1.computed)(function () { return route.name === 'login'; });
// Watch for performance mode changes to apply global CSS class
(0, vue_1.watch)(function () { return sidebarStore.isLowPowerMode; }, function (isLow) {
    if (isLow) {
        document.documentElement.classList.add('low-power-mode');
    }
    else {
        document.documentElement.classList.remove('low-power-mode');
    }
}, { immediate: true });
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                // Set initial user
                _a = user;
                return [4 /*yield*/, authService.getCurrentUser()];
            case 1:
                // Set initial user
                _a.value = _b.sent();
                isLoggedIn.value = !!user.value;
                // Listen for auth changes
                authService.onAuthStateChange(function (newUser) {
                    user.value = newUser;
                    isLoggedIn.value = !!newUser;
                    if (!newUser) {
                        router.push({ name: 'login' });
                    }
                    else if (router.currentRoute.value.name === 'login') {
                        router.push({ name: 'dashboard' });
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
function handleLogout() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, authService.signOut()];
                case 1:
                    _a.sent();
                    router.push({ name: 'login' });
                    return [2 /*return*/];
            }
        });
    });
}
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
if (__VLS_ctx.isLoggedIn && !__VLS_ctx.isLoginRoute) {
    var __VLS_0 = MainLayout_vue_1.default || MainLayout_vue_1.default;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ 'onLogout': {} }, { user: (__VLS_ctx.user) })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ 'onLogout': {} }, { user: (__VLS_ctx.user) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    var __VLS_5 = void 0;
    var __VLS_6 = ({ logout: {} },
        { onLogout: (__VLS_ctx.handleLogout) });
    var __VLS_7 = {};
    var __VLS_8 = __VLS_3.slots.default;
    var __VLS_9 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.RouterView} */
    RouterView;
    // @ts-ignore
    var __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({}));
    var __VLS_11 = __VLS_10.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_10), false));
    // @ts-ignore
    [isLoggedIn, isLoginRoute, user, handleLogout,];
    var __VLS_3;
    var __VLS_4;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex h-screen w-screen overflow-hidden bg-bg-main text-text-primary" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-screen']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-screen']} */ ;
    /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-bg-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)(__assign({ class: "flex-1 h-full overflow-y-auto overflow-x-hidden relative bg-bg-main" }));
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
    /** @type {__VLS_StyleScopedClasses['overflow-x-hidden']} */ ;
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-bg-main']} */ ;
    var __VLS_14 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.RouterView} */
    RouterView;
    // @ts-ignore
    var __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({}));
    var __VLS_16 = __VLS_15.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_15), false));
}
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
