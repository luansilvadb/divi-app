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
var BaseCard_vue_1 = require("@/shared/components/atoms/BaseCard.vue");
var BaseBadge_vue_1 = require("@/shared/components/atoms/BaseBadge.vue");
var BaseProgressBar_vue_1 = require("@/shared/components/atoms/BaseProgressBar.vue");
var BaseIconBox_vue_1 = require("@/shared/components/atoms/BaseIconBox.vue");
var props = defineProps();
var percentage = (0, vue_1.computed)(function () {
    if (props.budget.limit_value <= 0)
        return 0;
    return (props.consumed / props.budget.limit_value) * 100;
});
var isOverBudget = (0, vue_1.computed)(function () { return props.consumed > props.budget.limit_value; });
var daysRemaining = (0, vue_1.computed)(function () {
    var now = new Date();
    var end = new Date(props.budget.period_end);
    var diffTime = end.getTime() - now.getTime();
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
});
var dailyCadence = (0, vue_1.computed)(function () {
    if (daysRemaining.value <= 0)
        return 0;
    var remaining = props.budget.limit_value - props.consumed;
    return Math.max(remaining / daysRemaining.value, 0);
});
var formatCurrency = function (value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
var __VLS_0 = BaseCard_vue_1.default || BaseCard_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ class: "budget-card" }, { clickable: true })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "budget-card" }, { clickable: true })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = {};
/** @type {__VLS_StyleScopedClasses['budget-card']} */ ;
var __VLS_6 = __VLS_3.slots.default;
{
    var __VLS_7 = __VLS_3.slots.header;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "header-content flex justify-between items-center w-full" }));
    /** @type {__VLS_StyleScopedClasses['header-content']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "budget-title-area flex items-center gap-4" }));
    /** @type {__VLS_StyleScopedClasses['budget-title-area']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    var __VLS_8 = BaseIconBox_vue_1.default || BaseIconBox_vue_1.default;
    // @ts-ignore
    var __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        color: (__VLS_ctx.budget.color || 'var(--color-primary-main)'),
    }));
    var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([{
            color: (__VLS_ctx.budget.color || 'var(--color-primary-main)'),
        }], __VLS_functionalComponentArgsRest(__VLS_9), false));
    var __VLS_13 = __VLS_11.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: "pi pi-dollar text-xl" }));
    /** @type {__VLS_StyleScopedClasses['pi']} */ ;
    /** @type {__VLS_StyleScopedClasses['pi-dollar']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: "pi pi-chart-line text-xl" }));
    /** @type {__VLS_StyleScopedClasses['pi']} */ ;
    /** @type {__VLS_StyleScopedClasses['pi-chart-line']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    // @ts-ignore
    [budget,];
    var __VLS_11;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "budget-name text-lg font-bold text-text-primary tracking-tight" }));
    /** @type {__VLS_StyleScopedClasses['budget-name']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
    (__VLS_ctx.budget.name);
    var __VLS_14 = BaseBadge_vue_1.default || BaseBadge_vue_1.default;
    // @ts-ignore
    var __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        color: (__VLS_ctx.budget.color || 'var(--color-primary-main)'),
        variant: "subtle",
    }));
    var __VLS_16 = __VLS_15.apply(void 0, __spreadArray([{
            color: (__VLS_ctx.budget.color || 'var(--color-primary-main)'),
            variant: "subtle",
        }], __VLS_functionalComponentArgsRest(__VLS_15), false));
    var __VLS_19 = __VLS_17.slots.default;
    (__VLS_ctx.budget.type === 'spending' ? 'Gasto' : 'Reserva');
    // @ts-ignore
    [budget, budget, budget,];
    var __VLS_17;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "budget-info flex flex-col gap-5 pt-2" }));
/** @type {__VLS_StyleScopedClasses['budget-info']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "values-row flex justify-between items-end" }));
/** @type {__VLS_StyleScopedClasses['values-row']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-end']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "values-main flex items-baseline gap-1.5" }));
/** @type {__VLS_StyleScopedClasses['values-main']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-baseline']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "consumed text-3xl font-extrabold text-text-primary tracking-tighter" }, { class: ({ 'text-error-main': __VLS_ctx.isOverBudget }) }));
/** @type {__VLS_StyleScopedClasses['consumed']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tighter']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error-main']} */ ;
(__VLS_ctx.formatCurrency(__VLS_ctx.consumed));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "limit text-base font-medium text-text-secondary" }));
/** @type {__VLS_StyleScopedClasses['limit']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
(__VLS_ctx.formatCurrency(__VLS_ctx.budget.limit_value));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "percentage-pill text-sm font-bold bg-black/5 dark:bg-white/10 text-text-secondary px-2.5 py-1 rounded-lg" }, { class: ({ 'over-budget !bg-error-main/10 !text-error-main': __VLS_ctx.isOverBudget }) }));
/** @type {__VLS_StyleScopedClasses['percentage-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['over-budget']} */ ;
/** @type {__VLS_StyleScopedClasses['!bg-error-main/10']} */ ;
/** @type {__VLS_StyleScopedClasses['!text-error-main']} */ ;
(Math.round(__VLS_ctx.percentage));
var __VLS_20 = BaseProgressBar_vue_1.default;
// @ts-ignore
var __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    percentage: (__VLS_ctx.percentage),
    color: (__VLS_ctx.budget.color),
    isOverBudget: (__VLS_ctx.isOverBudget),
}));
var __VLS_22 = __VLS_21.apply(void 0, __spreadArray([{
        percentage: (__VLS_ctx.percentage),
        color: (__VLS_ctx.budget.color),
        isOverBudget: (__VLS_ctx.isOverBudget),
    }], __VLS_functionalComponentArgsRest(__VLS_21), false));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "budget-footer-details flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/5" }));
/** @type {__VLS_StyleScopedClasses['budget-footer-details']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
if (__VLS_ctx.daysRemaining > 0 && !__VLS_ctx.isOverBudget) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "cadence flex items-center gap-2 text-sm" }));
    /** @type {__VLS_StyleScopedClasses['cadence']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "cadence-label text-text-secondary" }));
    /** @type {__VLS_StyleScopedClasses['cadence-label']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "cadence-value font-bold text-text-primary bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-md" }));
    /** @type {__VLS_StyleScopedClasses['cadence-value']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
    (__VLS_ctx.formatCurrency(__VLS_ctx.dailyCadence));
}
else if (__VLS_ctx.isOverBudget) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "cadence over-alert flex items-center gap-2 text-sm text-error-main font-semibold" }));
    /** @type {__VLS_StyleScopedClasses['cadence']} */ ;
    /** @type {__VLS_StyleScopedClasses['over-alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-error-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "cadence-label" }));
    /** @type {__VLS_StyleScopedClasses['cadence-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: "pi pi-exclamation-circle text-sm" }));
    /** @type {__VLS_StyleScopedClasses['pi']} */ ;
    /** @type {__VLS_StyleScopedClasses['pi-exclamation-circle']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "days-remaining flex items-center gap-1.5 text-[0.8rem] font-semibold text-text-secondary bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg" }));
/** @type {__VLS_StyleScopedClasses['days-remaining']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.8rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: "pi pi-clock text-sm" }));
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-clock']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
(__VLS_ctx.daysRemaining);
// @ts-ignore
[budget, budget, isOverBudget, isOverBudget, isOverBudget, isOverBudget, isOverBudget, formatCurrency, formatCurrency, formatCurrency, consumed, percentage, percentage, daysRemaining, daysRemaining, dailyCadence,];
var __VLS_3;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
