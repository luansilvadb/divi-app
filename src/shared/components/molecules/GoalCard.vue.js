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
var BaseIconBox_vue_1 = require("@/shared/components/atoms/BaseIconBox.vue");
var BaseProgressBar_vue_1 = require("@/shared/components/atoms/BaseProgressBar.vue");
var props = defineProps();
var percentage = (0, vue_1.computed)(function () {
    if (props.goal.target_value <= 0)
        return 0;
    return (props.goal.current_value / props.goal.target_value) * 100;
});
var formatCurrency = function (value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};
var formatDate = function (dateString) {
    if (!dateString)
        return 'Data não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
};
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
var __VLS_0 = BaseCard_vue_1.default || BaseCard_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ class: "goal-card" }, { clickable: true })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "goal-card" }, { clickable: true })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = {};
/** @type {__VLS_StyleScopedClasses['goal-card']} */ ;
var __VLS_6 = __VLS_3.slots.default;
{
    var __VLS_7 = __VLS_3.slots.header;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "header-content flex justify-between items-center w-full" }));
    /** @type {__VLS_StyleScopedClasses['header-content']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "goal-title-area flex items-center gap-4" }));
    /** @type {__VLS_StyleScopedClasses['goal-title-area']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    var __VLS_8 = BaseIconBox_vue_1.default || BaseIconBox_vue_1.default;
    // @ts-ignore
    var __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        color: (__VLS_ctx.goal.color || 'var(--color-primary-main)'),
    }));
    var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([{
            color: (__VLS_ctx.goal.color || 'var(--color-primary-main)'),
        }], __VLS_functionalComponentArgsRest(__VLS_9), false));
    var __VLS_13 = __VLS_11.slots.default;
    if (__VLS_ctx.goal.icon) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "emoji-icon text-xl leading-none" }));
        /** @type {__VLS_StyleScopedClasses['emoji-icon']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
        (__VLS_ctx.goal.icon);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: "pi pi-bullseye text-xl" }));
    /** @type {__VLS_StyleScopedClasses['pi']} */ ;
    /** @type {__VLS_StyleScopedClasses['pi-bullseye']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    // @ts-ignore
    [goal, goal, goal,];
    var __VLS_11;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "goal-name text-lg font-bold text-text-primary tracking-tight" }));
    /** @type {__VLS_StyleScopedClasses['goal-name']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
    (__VLS_ctx.goal.name);
    var __VLS_14 = BaseBadge_vue_1.default || BaseBadge_vue_1.default;
    // @ts-ignore
    var __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        color: (__VLS_ctx.goal.color || 'var(--color-primary-main)'),
        variant: "subtle",
    }));
    var __VLS_16 = __VLS_15.apply(void 0, __spreadArray([{
            color: (__VLS_ctx.goal.color || 'var(--color-primary-main)'),
            variant: "subtle",
        }], __VLS_functionalComponentArgsRest(__VLS_15), false));
    var __VLS_19 = __VLS_17.slots.default;
    (__VLS_ctx.goal.type === 'saving' ? 'Acumular' : 'Quitação');
    // @ts-ignore
    [goal, goal, goal,];
    var __VLS_17;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "goal-info flex flex-col gap-5 pt-2" }));
/** @type {__VLS_StyleScopedClasses['goal-info']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "values-row flex justify-between items-end" }));
/** @type {__VLS_StyleScopedClasses['values-row']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-end']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "values-main flex items-baseline gap-2" }));
/** @type {__VLS_StyleScopedClasses['values-main']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-baseline']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "consumed text-2xl font-black text-text-primary tracking-tighter" }));
/** @type {__VLS_StyleScopedClasses['consumed']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tighter']} */ ;
(__VLS_ctx.formatCurrency(__VLS_ctx.goal.current_value));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "limit text-sm font-semibold text-text-secondary opacity-70" }));
/** @type {__VLS_StyleScopedClasses['limit']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-70']} */ ;
(__VLS_ctx.formatCurrency(__VLS_ctx.goal.target_value));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "percentage-pill text-xs font-black bg-bg-main dark:bg-white/5 px-3 py-1.5 rounded-lg shadow-xs border border-white/10" }, { style: ({ color: __VLS_ctx.goal.color || 'var(--color-primary-main)' }) }));
/** @type {__VLS_StyleScopedClasses['percentage-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-bg-main']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
(Math.round(__VLS_ctx.percentage));
var __VLS_20 = BaseProgressBar_vue_1.default;
// @ts-ignore
var __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    percentage: (__VLS_ctx.percentage),
    color: (__VLS_ctx.goal.color),
}));
var __VLS_22 = __VLS_21.apply(void 0, __spreadArray([{
        percentage: (__VLS_ctx.percentage),
        color: (__VLS_ctx.goal.color),
    }], __VLS_functionalComponentArgsRest(__VLS_21), false));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "goal-footer-details flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/5" }));
/** @type {__VLS_StyleScopedClasses['goal-footer-details']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "insight-group flex flex-col gap-0.5" }));
/** @type {__VLS_StyleScopedClasses['insight-group']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-0.5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "insight-label text-[0.7rem] font-bold text-text-secondary uppercase tracking-widest" }));
/** @type {__VLS_StyleScopedClasses['insight-label']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.7rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
(__VLS_ctx.percentage < 100 ? 'Faltam' : 'Objetivo');
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "insight-value text-base font-black text-text-primary tracking-tight" }, { class: ({ 'text-success-main': __VLS_ctx.percentage >= 100 }) }));
/** @type {__VLS_StyleScopedClasses['insight-value']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['text-success-main']} */ ;
(__VLS_ctx.percentage < 100
    ? __VLS_ctx.formatCurrency(__VLS_ctx.goal.target_value - __VLS_ctx.goal.current_value)
    : 'Conquistado!');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "date-badge flex items-center gap-2 text-[0.75rem] font-bold text-text-secondary bg-black/3 dark:bg-white/5 px-3 py-2 rounded-xl border border-black/2 dark:border-white/2" }));
/** @type {__VLS_StyleScopedClasses['date-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.75rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/3']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-black/2']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-white/2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: "pi pi-calendar text-xs" }));
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
(__VLS_ctx.formatDate(__VLS_ctx.goal.created_at));
// @ts-ignore
[goal, goal, goal, goal, goal, goal, goal, formatCurrency, formatCurrency, formatCurrency, percentage, percentage, percentage, percentage, percentage, formatDate,];
var __VLS_3;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
