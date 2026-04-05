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
var di_1 = require("@/core/di");
var di_tokens_1 = require("@/core/di-tokens");
var BaseButton_vue_1 = require("@/shared/components/atoms/BaseButton.vue");
var BaseCard_vue_1 = require("@/shared/components/atoms/BaseCard.vue");
var StandardPageLayout_vue_1 = require("@/shared/components/templates/StandardPageLayout.vue");
// Component State
var activityService = di_1.container.resolve(di_tokens_1.DI_TOKENS.ActivityLogService);
var activities = (0, vue_1.ref)([]);
var isLoading = (0, vue_1.ref)(true);
var isRefreshing = (0, vue_1.ref)(false);
var fetchActivities = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = activities;
                return [4 /*yield*/, activityService.getRecentActivities()];
            case 1:
                _a.value = _b.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Failed to fetch activities:', error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var handleRefresh = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (isRefreshing.value)
                    return [2 /*return*/];
                isRefreshing.value = true;
                return [4 /*yield*/, fetchActivities()];
            case 1:
                _a.sent();
                setTimeout(function () {
                    isRefreshing.value = false;
                }, 600);
                return [2 /*return*/];
        }
    });
}); };
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                isLoading.value = true;
                return [4 /*yield*/, fetchActivities()];
            case 1:
                _a.sent();
                isLoading.value = false;
                return [2 /*return*/];
        }
    });
}); });
var statusBg = function (type) {
    switch (type) {
        case 'success':
            return 'bg-success-main';
        case 'error':
            return 'bg-error-main';
        case 'warning':
            return 'bg-warning-main';
        case 'info':
            return 'bg-primary-main';
        default:
            return 'bg-primary-main';
    }
};
var formatDateTime = function (timestamp) {
    var date = new Date(timestamp);
    var isToday = new Date().toDateString() === date.toDateString();
    var timeString = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (isToday)
        return "Hoje, ".concat(timeString);
    var dateString = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    return "".concat(dateString.toUpperCase(), ", ").concat(timeString);
};
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
var __VLS_0 = StandardPageLayout_vue_1.default || StandardPageLayout_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: "Log de Atividades",
    highlight: "Atividades",
    subtitle: "Histórico de operações e auditoria do sistema em tempo real.",
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        title: "Log de Atividades",
        highlight: "Atividades",
        subtitle: "Histórico de operações e auditoria do sistema em tempo real.",
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = {};
var __VLS_6 = __VLS_3.slots.default;
{
    var __VLS_7 = __VLS_3.slots.action;
    var __VLS_8 = BaseButton_vue_1.default || BaseButton_vue_1.default;
    // @ts-ignore
    var __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8(__assign(__assign({ 'onClick': {} }, { variant: "primary" }), { class: ({ 'opacity-80': __VLS_ctx.isRefreshing }) })));
    var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { variant: "primary" }), { class: ({ 'opacity-80': __VLS_ctx.isRefreshing }) })], __VLS_functionalComponentArgsRest(__VLS_9), false));
    var __VLS_13 = void 0;
    var __VLS_14 = ({ click: {} },
        { onClick: (__VLS_ctx.handleRefresh) });
    /** @type {__VLS_StyleScopedClasses['opacity-80']} */ ;
    var __VLS_15 = __VLS_11.slots.default;
    (__VLS_ctx.isRefreshing ? 'Sincronizando...' : 'Atualizar');
    // @ts-ignore
    [isRefreshing, isRefreshing, handleRefresh,];
    var __VLS_11;
    var __VLS_12;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "view-content-grid" }));
/** @type {__VLS_StyleScopedClasses['view-content-grid']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)(__assign({ class: "main-column" }));
/** @type {__VLS_StyleScopedClasses['main-column']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "glass-card p-10 min-h-[500px] overflow-hidden" }));
/** @type {__VLS_StyleScopedClasses['glass-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-10']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[500px]']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col items-center justify-center h-[400px] text-center" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-[400px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-12 h-12 border-4 border-primary-main/10 border-t-primary-main rounded-full animate-spin" }));
    /** @type {__VLS_StyleScopedClasses['w-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-primary-main/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t-primary-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "mt-8 text-[10px] font-black tracking-widest text-text-disabled uppercase animate-pulse" }));
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['animate-pulse']} */ ;
}
else if (__VLS_ctx.activities.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col items-center justify-center h-[400px] text-center px-6" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-[400px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-6']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-8 border border-black/5 dark:border-white/5 opacity-50" }));
    /** @type {__VLS_StyleScopedClasses['w-20']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-20']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-50']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "1.5", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, { class: "w-10 h-10" }));
    /** @type {__VLS_StyleScopedClasses['w-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-10']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.circle)({
        cx: "12",
        cy: "12",
        r: "10",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "12",
        y1: "8",
        x2: "12",
        y2: "12",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "12",
        y1: "16",
        x2: "12.01",
        y2: "16",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "text-2xl font-black text-text-primary tracking-tight mb-2" }));
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-sm text-text-secondary font-medium leading-relaxed max-w-xs" }));
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
    /** @type {__VLS_StyleScopedClasses['max-w-xs']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "activity-list flex flex-col gap-10 relative" }));
    /** @type {__VLS_StyleScopedClasses['activity-list']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    for (var _i = 0, _a = __VLS_vFor((__VLS_ctx.activities)); _i < _a.length; _i++) {
        var activity = _a[_i][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (activity.id) }, { class: "activity-item flex gap-10 relative group" }));
        /** @type {__VLS_StyleScopedClasses['activity-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-10']} */ ;
        /** @type {__VLS_StyleScopedClasses['relative']} */ ;
        /** @type {__VLS_StyleScopedClasses['group']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "absolute top-11 bottom-[-40px] left-5 w-0.5 bg-black/5 dark:bg-white/5 rounded-full z-0 group-last:hidden" }));
        /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
        /** @type {__VLS_StyleScopedClasses['top-11']} */ ;
        /** @type {__VLS_StyleScopedClasses['bottom-[-40px]']} */ ;
        /** @type {__VLS_StyleScopedClasses['left-5']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-0.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['z-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['group-last:hidden']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "activity-icon-wrapper relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm border border-black/5 dark:border-white/5" }));
        /** @type {__VLS_StyleScopedClasses['activity-icon-wrapper']} */ ;
        /** @type {__VLS_StyleScopedClasses['relative']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-10']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-10']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['z-10']} */ ;
        /** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "absolute inset-0 rounded-full opacity-10" }, { class: (__VLS_ctx.statusBg(activity.type)) }));
        /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
        /** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['opacity-10']} */ ;
        if (activity.type === 'success') {
            __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "3", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, { class: "w-4 h-4 text-success-main" }));
            /** @type {__VLS_StyleScopedClasses['w-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['h-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-success-main']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
                d: "M20 6L9 17l-5-5",
            });
        }
        else if (activity.type === 'error') {
            __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "3", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, { class: "w-4 h-4 text-error-main" }));
            /** @type {__VLS_StyleScopedClasses['w-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['h-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-error-main']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
                x1: "18",
                y1: "6",
                x2: "6",
                y2: "18",
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
                x1: "6",
                y1: "6",
                x2: "18",
                y2: "18",
            });
        }
        else if (activity.type === 'warning') {
            __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "3", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, { class: "w-4 h-4 text-warning-main" }));
            /** @type {__VLS_StyleScopedClasses['w-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['h-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-warning-main']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
                d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
                x1: "12",
                y1: "9",
                x2: "12",
                y2: "13",
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
                x1: "12",
                y1: "17",
                x2: "12.01",
                y2: "17",
            });
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "3", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, { class: "w-4 h-4 text-primary-main" }));
            /** @type {__VLS_StyleScopedClasses['w-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['h-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-primary-main']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.circle)({
                cx: "12",
                cy: "12",
                r: "10",
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
                x1: "12",
                y1: "16",
                x2: "12",
                y2: "12",
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
                x1: "12",
                y1: "8",
                x2: "12.01",
                y2: "8",
            });
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "activity-content-box flex-1 flex flex-col gap-2 p-5 rounded-2xl border border-black/5 dark:border-white/5 hover:bg-white/40 dark:hover:bg-black/20 transition-all duration-300" }));
        /** @type {__VLS_StyleScopedClasses['activity-content-box']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-5']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:bg-white/40']} */ ;
        /** @type {__VLS_StyleScopedClasses['dark:hover:bg-black/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
        /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "activity-header flex justify-between items-start gap-4" }));
        /** @type {__VLS_StyleScopedClasses['activity-header']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-start']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "action-title text-base font-black text-text-primary tracking-tight" }));
        /** @type {__VLS_StyleScopedClasses['action-title']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
        (activity.action);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "timestamp-badge text-[10px] font-black uppercase tracking-widest text-text-disabled flex items-center gap-2 px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-full" }));
        /** @type {__VLS_StyleScopedClasses['timestamp-badge']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "2.5", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, { class: "w-3 h-3" }));
        /** @type {__VLS_StyleScopedClasses['w-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-3']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.circle)({
            cx: "12",
            cy: "12",
            r: "10",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
            points: "12 6 12 12 16 14",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.formatDateTime(activity.timestamp));
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "activity-description text-sm text-text-secondary leading-relaxed font-medium opacity-80" }));
        /** @type {__VLS_StyleScopedClasses['activity-description']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
        /** @type {__VLS_StyleScopedClasses['opacity-80']} */ ;
        (activity.description);
        // @ts-ignore
        [isLoading, activities, activities, statusBg, formatDateTime,];
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)(__assign({ class: "side-column" }));
/** @type {__VLS_StyleScopedClasses['side-column']} */ ;
var __VLS_16 = BaseCard_vue_1.default || BaseCard_vue_1.default;
// @ts-ignore
var __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({}));
var __VLS_18 = __VLS_17.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_17), false));
var __VLS_21 = __VLS_19.slots.default;
{
    var __VLS_22 = __VLS_19.slots.header;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col gap-6 pt-2" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-xs text-text-secondary font-medium leading-relaxed" }));
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "bg-primary-main/5 p-4 rounded-2xl border border-primary-main/10 flex gap-4 items-start" }));
/** @type {__VLS_StyleScopedClasses['bg-primary-main/5']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-primary-main/10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "mt-0.5" }));
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "2.5", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, { class: "text-primary-main" }));
/** @type {__VLS_StyleScopedClasses['text-primary-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.circle, __VLS_intrinsics.circle)({
    cx: "12",
    cy: "12",
    r: "10",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.line, __VLS_intrinsics.line)({
    x1: "12",
    y1: "16",
    x2: "12",
    y2: "12",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.line)({
    x1: "12",
    y1: "8",
    x2: "12.01",
    y2: "8",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-[0.8rem] text-text-secondary leading-relaxed" }));
/** @type {__VLS_StyleScopedClasses['text-[0.8rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)(__assign({ class: "text-text-primary" }));
/** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)(__assign({ class: "text-text-primary" }));
/** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
// @ts-ignore
[];
var __VLS_19;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
