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
var BaseCard_vue_1 = require("@/shared/components/atoms/BaseCard.vue");
var BaseButton_vue_1 = require("@/shared/components/atoms/BaseButton.vue");
var BaseIconBox_vue_1 = require("@/shared/components/atoms/BaseIconBox.vue");
var BaseProgressBar_vue_1 = require("@/shared/components/atoms/BaseProgressBar.vue");
var BaseBadge_vue_1 = require("@/shared/components/atoms/BaseBadge.vue");
var __VLS_props = defineProps();
var __VLS_emit = defineEmits();
var getProgress = function (loan) {
    if (loan.total_value === 0)
        return 0;
    var paid = loan.total_value - loan.remaining_value;
    return (paid / loan.total_value) * 100;
};
var formatCurrency = function (value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};
var formatDate = function (dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
};
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
var __VLS_0 = BaseCard_vue_1.default || BaseCard_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ class: "loan-card" }, { clickable: true })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "loan-card" }, { clickable: true })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = {};
/** @type {__VLS_StyleScopedClasses['loan-card']} */ ;
var __VLS_6 = __VLS_3.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "card-top flex justify-between items-start" }));
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "loan-identity flex gap-4 items-center" }));
/** @type {__VLS_StyleScopedClasses['loan-identity']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
var __VLS_7 = BaseIconBox_vue_1.default || BaseIconBox_vue_1.default;
// @ts-ignore
var __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    color: "var(--color-secondary-main)",
    size: "lg",
}));
var __VLS_9 = __VLS_8.apply(void 0, __spreadArray([{
        color: "var(--color-secondary-main)",
        size: "lg",
    }], __VLS_functionalComponentArgsRest(__VLS_8), false));
var __VLS_12 = __VLS_10.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: "pi pi-briefcase text-2xl" }));
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-briefcase']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
var __VLS_10;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col gap-0.5" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-0.5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "loan-name text-lg font-bold text-text-primary tracking-tight leading-tight" }));
/** @type {__VLS_StyleScopedClasses['loan-name']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-tight']} */ ;
(__VLS_ctx.loan.name);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "loan-due text-xs font-semibold text-text-disabled" }));
/** @type {__VLS_StyleScopedClasses['loan-due']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
(__VLS_ctx.formatDate(__VLS_ctx.loan.due_date));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "loan-metrics grid grid-cols-2 gap-4 bg-black/3 dark:bg-white/3 p-4 rounded-xl mt-4" }));
/** @type {__VLS_StyleScopedClasses['loan-metrics']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/3']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-white/3']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "metric flex flex-col gap-1" }));
/** @type {__VLS_StyleScopedClasses['metric']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "label text-[0.7rem] font-bold text-text-disabled uppercase tracking-widest" }));
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.7rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "value text-lg font-black text-error-main leading-none" }));
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error-main']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
(__VLS_ctx.formatCurrency(__VLS_ctx.loan.remaining_value));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "metric flex flex-col gap-1" }));
/** @type {__VLS_StyleScopedClasses['metric']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "label text-[0.7rem] font-bold text-text-disabled uppercase tracking-widest" }));
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.7rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
var __VLS_13 = BaseBadge_vue_1.default || BaseBadge_vue_1.default;
// @ts-ignore
var __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    variant: "subtle",
    color: "var(--color-primary-main)",
}));
var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([{
        variant: "subtle",
        color: "var(--color-primary-main)",
    }], __VLS_functionalComponentArgsRest(__VLS_14), false));
var __VLS_18 = __VLS_16.slots.default;
(__VLS_ctx.loan.interest_rate || '0');
// @ts-ignore
[loan, loan, loan, loan, formatDate, formatCurrency,];
var __VLS_16;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "loan-progress-section flex flex-col gap-2 mt-4" }));
/** @type {__VLS_StyleScopedClasses['loan-progress-section']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "progress-info flex justify-between text-xs font-bold text-text-secondary" }));
/** @type {__VLS_StyleScopedClasses['progress-info']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.getProgress(__VLS_ctx.loan).toFixed(1));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "opacity-60" }));
/** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
(__VLS_ctx.formatCurrency(__VLS_ctx.loan.total_value));
var __VLS_19 = BaseProgressBar_vue_1.default;
// @ts-ignore
var __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    percentage: (__VLS_ctx.getProgress(__VLS_ctx.loan)),
    color: "var(--color-primary-main)",
}));
var __VLS_21 = __VLS_20.apply(void 0, __spreadArray([{
        percentage: (__VLS_ctx.getProgress(__VLS_ctx.loan)),
        color: "var(--color-primary-main)",
    }], __VLS_functionalComponentArgsRest(__VLS_20), false));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "card-footer pt-4 border-t border-black/5 dark:border-white/5 mt-2" }));
/** @type {__VLS_StyleScopedClasses['card-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "card-actions flex justify-end gap-2" }));
/** @type {__VLS_StyleScopedClasses['card-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
var __VLS_24 = BaseButton_vue_1.default || BaseButton_vue_1.default;
// @ts-ignore
var __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24(__assign(__assign({ 'onClick': {} }, { variant: "ghost" }), { class: "!px-4 !py-1.5 text-xs text-error-main" })));
var __VLS_26 = __VLS_25.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { variant: "ghost" }), { class: "!px-4 !py-1.5 text-xs text-error-main" })], __VLS_functionalComponentArgsRest(__VLS_25), false));
var __VLS_29;
var __VLS_30 = ({ click: {} },
    { onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.$emit('delete', __VLS_ctx.loan.id);
            // @ts-ignore
            [loan, loan, loan, loan, formatCurrency, getProgress, getProgress, $emit,];
        } });
/** @type {__VLS_StyleScopedClasses['!px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['!py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error-main']} */ ;
var __VLS_31 = __VLS_27.slots.default;
// @ts-ignore
[];
var __VLS_27;
var __VLS_28;
var __VLS_32 = BaseButton_vue_1.default || BaseButton_vue_1.default;
// @ts-ignore
var __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32(__assign({ variant: "outline" }, { class: "!px-4 !py-1.5 text-xs" })));
var __VLS_34 = __VLS_33.apply(void 0, __spreadArray([__assign({ variant: "outline" }, { class: "!px-4 !py-1.5 text-xs" })], __VLS_functionalComponentArgsRest(__VLS_33), false));
/** @type {__VLS_StyleScopedClasses['!px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['!py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
var __VLS_37 = __VLS_35.slots.default;
// @ts-ignore
[];
var __VLS_35;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
exports.default = {};
