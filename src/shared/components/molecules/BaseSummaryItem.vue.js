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
/**
 * BaseSummaryItem Molecule
 * Displays a value with a label and an optional icon.
 */
var vue_1 = require("vue");
var BaseIconBox_vue_1 = require("@/shared/components/atoms/BaseIconBox.vue");
var props = withDefaults(defineProps(), {
    status: 'normal',
});
var statusClass = (0, vue_1.computed)(function () {
    switch (props.status) {
        case 'success':
            return 'text-success-main';
        case 'error':
            return 'text-error-main';
        case 'warning':
            return 'text-warning-main';
        case 'info':
            return 'text-primary-main';
        default:
            return 'text-text-primary';
    }
});
var __VLS_defaults = {
    status: 'normal',
};
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "summary-item flex items-center gap-5 transition-all duration-300" }, { class: ({ 'opacity-50 grayscale cursor-not-allowed': __VLS_ctx.error }) }));
/** @type {__VLS_StyleScopedClasses['summary-item']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-5']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['grayscale']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-not-allowed']} */ ;
var __VLS_0 = BaseIconBox_vue_1.default || BaseIconBox_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ color: (__VLS_ctx.error ? 'error' : __VLS_ctx.color), size: "md" }, { class: "transition-transform duration-300" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ color: (__VLS_ctx.error ? 'error' : __VLS_ctx.color), size: "md" }, { class: "transition-transform duration-300" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
var __VLS_5 = __VLS_3.slots.default;
var __VLS_6 = {};
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: "pi pi-exclamation-circle text-xl" }));
    /** @type {__VLS_StyleScopedClasses['pi']} */ ;
    /** @type {__VLS_StyleScopedClasses['pi-exclamation-circle']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
}
// @ts-ignore
[error, error, error, color,];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "summary-text flex flex-col gap-0.5 min-w-0" }));
/** @type {__VLS_StyleScopedClasses['summary-text']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "label text-[0.65rem] font-black text-text-secondary uppercase tracking-[0.15em] leading-none truncate opacity-80" }));
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.65rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-[0.15em]']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-80']} */ ;
(__VLS_ctx.error ? 'Erro de carga' : __VLS_ctx.label);
if (!__VLS_ctx.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)(__assign({ class: "value text-2xl font-black text-text-primary leading-tight tracking-tighter transition-all duration-300 truncate" }, { class: (__VLS_ctx.statusClass) }));
    /** @type {__VLS_StyleScopedClasses['value']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['leading-tight']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-tighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
    /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
    (__VLS_ctx.value);
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-error-main text-xs font-black animate-pulse-error uppercase tracking-widest" }));
    /** @type {__VLS_StyleScopedClasses['text-error-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['animate-pulse-error']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
}
// @ts-ignore
var __VLS_7 = __VLS_6;
// @ts-ignore
[error, error, label, statusClass, value,];
var __VLS_base = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
var __VLS_export = {};
exports.default = {};
