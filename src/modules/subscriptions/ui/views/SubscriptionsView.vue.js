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
var subscriptionStore_1 = require("../../application/stores/subscriptionStore");
var formatters_1 = require("@/shared/utils/formatters");
var BaseButton_vue_1 = require("@/shared/components/atoms/BaseButton.vue");
var BaseCard_vue_1 = require("@/shared/components/atoms/BaseCard.vue");
var BaseIconBox_vue_1 = require("@/shared/components/atoms/BaseIconBox.vue");
var BaseProgressBar_vue_1 = require("@/shared/components/atoms/BaseProgressBar.vue");
var BaseSummaryItem_vue_1 = require("@/shared/components/molecules/BaseSummaryItem.vue");
var StandardPageLayout_vue_1 = require("@/shared/components/templates/StandardPageLayout.vue");
var store = (0, subscriptionStore_1.useSubscriptionStore)();
var showAddSubscriptionModal = (0, vue_1.ref)(false);
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, store.fetchSubscriptions()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
var __VLS_0 = StandardPageLayout_vue_1.default || StandardPageLayout_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: "Minhas Assinaturas",
    highlight: "Assinaturas",
    subtitle: "Gerencie seus serviços recorrentes e evite gastos desnecessários.",
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        title: "Minhas Assinaturas",
        highlight: "Assinaturas",
        subtitle: "Gerencie seus serviços recorrentes e evite gastos desnecessários.",
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = {};
var __VLS_6 = __VLS_3.slots.default;
{
    var __VLS_7 = __VLS_3.slots.action;
    var __VLS_8 = BaseButton_vue_1.default || BaseButton_vue_1.default;
    // @ts-ignore
    var __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8(__assign({ 'onClick': {} }, { variant: "primary" })));
    var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { variant: "primary" })], __VLS_functionalComponentArgsRest(__VLS_9), false));
    var __VLS_13 = void 0;
    var __VLS_14 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.showAddSubscriptionModal = true;
                // @ts-ignore
                [showAddSubscriptionModal,];
            } });
    var __VLS_15 = __VLS_11.slots.default;
    // @ts-ignore
    [];
    var __VLS_11;
    var __VLS_12;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "view-content-grid" }));
/** @type {__VLS_StyleScopedClasses['view-content-grid']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)(__assign({ class: "main-column" }));
/** @type {__VLS_StyleScopedClasses['main-column']} */ ;
if (__VLS_ctx.store.subscriptions.length === 0 && !__VLS_ctx.store.isLoading) {
    var __VLS_16 = BaseCard_vue_1.default || BaseCard_vue_1.default;
    // @ts-ignore
    var __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
        isEmpty: true,
        emptyTitle: "Sem assinaturas ativas",
        emptySubtitle: "Registre seus serviços de streaming, software ou clubes para ter uma visão clara dos seus custos fixos mensais.",
        emptyColor: "var(--color-primary-main)",
    }));
    var __VLS_18 = __VLS_17.apply(void 0, __spreadArray([{
            isEmpty: true,
            emptyTitle: "Sem assinaturas ativas",
            emptySubtitle: "Registre seus serviços de streaming, software ou clubes para ter uma visão clara dos seus custos fixos mensais.",
            emptyColor: "var(--color-primary-main)",
        }], __VLS_functionalComponentArgsRest(__VLS_17), false));
    var __VLS_21 = __VLS_19.slots.default;
    {
        var __VLS_22 = __VLS_19.slots["empty-icon"];
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
            d: "M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
            d: "M3 10h18",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
            d: "M7 15h.01",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
            d: "M11 15h.01",
        });
        // @ts-ignore
        [store, store,];
    }
    {
        var __VLS_23 = __VLS_19.slots["empty-action"];
        var __VLS_24 = BaseButton_vue_1.default || BaseButton_vue_1.default;
        // @ts-ignore
        var __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24(__assign(__assign({ 'onClick': {} }, { variant: "primary" }), { class: "px-8" })));
        var __VLS_26 = __VLS_25.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { variant: "primary" }), { class: "px-8" })], __VLS_functionalComponentArgsRest(__VLS_25), false));
        var __VLS_29 = void 0;
        var __VLS_30 = ({ click: {} },
            { onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.store.subscriptions.length === 0 && !__VLS_ctx.store.isLoading))
                        return;
                    __VLS_ctx.showAddSubscriptionModal = true;
                    // @ts-ignore
                    [showAddSubscriptionModal,];
                } });
        /** @type {__VLS_StyleScopedClasses['px-8']} */ ;
        var __VLS_31 = __VLS_27.slots.default;
        // @ts-ignore
        [];
        var __VLS_27;
        var __VLS_28;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_19;
}
else if (__VLS_ctx.store.isLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex justify-center py-20" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-20']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-8 h-8 border-4 border-primary-main/20 border-t-primary-main rounded-full animate-spin" }));
    /** @type {__VLS_StyleScopedClasses['w-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-primary-main/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t-primary-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-6" }));
    /** @type {__VLS_StyleScopedClasses['grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
    for (var _i = 0, _a = __VLS_vFor((__VLS_ctx.store.subscriptions)); _i < _a.length; _i++) {
        var sub = _a[_i][0];
        var __VLS_32 = BaseCard_vue_1.default || BaseCard_vue_1.default;
        // @ts-ignore
        var __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
            key: (sub.id),
            clickable: true,
        }));
        var __VLS_34 = __VLS_33.apply(void 0, __spreadArray([{
                key: (sub.id),
                clickable: true,
            }], __VLS_functionalComponentArgsRest(__VLS_33), false));
        var __VLS_37 = __VLS_35.slots.default;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center justify-between" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-4" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
        var __VLS_38 = BaseIconBox_vue_1.default || BaseIconBox_vue_1.default;
        // @ts-ignore
        var __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
            color: "var(--color-primary-main)",
            size: "md",
        }));
        var __VLS_40 = __VLS_39.apply(void 0, __spreadArray([{
                color: "var(--color-primary-main)",
                size: "md",
            }], __VLS_functionalComponentArgsRest(__VLS_39), false));
        var __VLS_43 = __VLS_41.slots.default;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-xl" }));
        /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
        // @ts-ignore
        [store, store,];
        var __VLS_41;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "font-black text-text-primary tracking-tight" }));
        /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
        (sub.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-[10px] font-black uppercase tracking-widest text-text-disabled" }));
        /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
        (sub.frequency === 'monthly' ? 'Mensal' : 'Anual');
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "text-right" }));
        /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "font-black text-lg text-text-primary tracking-tighter" }));
        /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-tighter']} */ ;
        (__VLS_ctx.formatCurrency(sub.amount));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "text-[10px] font-black uppercase tracking-widest text-text-disabled" }));
        /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
        (sub.billing_day);
        // @ts-ignore
        [formatters_1.formatCurrency,];
        var __VLS_35;
        // @ts-ignore
        [];
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)(__assign({ class: "side-column" }));
/** @type {__VLS_StyleScopedClasses['side-column']} */ ;
var __VLS_44 = BaseCard_vue_1.default || BaseCard_vue_1.default;
// @ts-ignore
var __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({}));
var __VLS_46 = __VLS_45.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_45), false));
var __VLS_49 = __VLS_47.slots.default;
{
    var __VLS_50 = __VLS_47.slots.header;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col gap-8 pt-2" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
var __VLS_51 = BaseSummaryItem_vue_1.default || BaseSummaryItem_vue_1.default;
// @ts-ignore
var __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    label: "Custo Fixo Total",
    value: (__VLS_ctx.formatCurrency(__VLS_ctx.store.totalMonthlyCost)),
    color: "var(--color-primary-main)",
    status: "info",
}));
var __VLS_53 = __VLS_52.apply(void 0, __spreadArray([{
        label: "Custo Fixo Total",
        value: (__VLS_ctx.formatCurrency(__VLS_ctx.store.totalMonthlyCost)),
        color: "var(--color-primary-main)",
        status: "info",
    }], __VLS_functionalComponentArgsRest(__VLS_52), false));
var __VLS_56 = __VLS_54.slots.default;
{
    var __VLS_57 = __VLS_54.slots.icon;
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.path, __VLS_intrinsics.path)({
        d: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    });
    // @ts-ignore
    [store, formatters_1.formatCurrency,];
}
// @ts-ignore
[];
var __VLS_54;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "h-px bg-black/5 dark:bg-white/5" }));
/** @type {__VLS_StyleScopedClasses['h-px']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col gap-4" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex justify-between items-end" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-end']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-[10px] font-black uppercase tracking-widest text-text-disabled" }));
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-xl font-black text-primary-main tracking-tighter" }));
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-main']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tighter']} */ ;
var __VLS_58 = BaseProgressBar_vue_1.default;
// @ts-ignore
var __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    percentage: (8),
    color: "var(--color-primary-main)",
}));
var __VLS_60 = __VLS_59.apply(void 0, __spreadArray([{
        percentage: (8),
        color: "var(--color-primary-main)",
    }], __VLS_functionalComponentArgsRest(__VLS_59), false));
// @ts-ignore
[];
var __VLS_47;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
