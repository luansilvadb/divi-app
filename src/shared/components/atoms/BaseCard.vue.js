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
var card_1 = require("primevue/card");
var BaseIconBox_vue_1 = require("./BaseIconBox.vue");
var BaseSkeleton_vue_1 = require("./BaseSkeleton.vue");
var __VLS_props = defineProps();
var __VLS_emit = defineEmits(['click', 'retry']);
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Card | typeof __VLS_components.Card} */
card_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign(__assign(__assign(__assign({ 'onKeydown': {} }, { 'onKeydown': {} }), { class: "glass-card overflow-hidden transition-all duration-300" }), { class: ({
        'cursor-pointer hover-glow active:scale-[0.98]': __VLS_ctx.clickable,
        'border-error-main/50 animate-pulse-error': __VLS_ctx.error,
        'h-full flex flex-col': __VLS_ctx.hFull,
    }) }), { role: (__VLS_ctx.clickable ? 'button' : undefined), tabindex: (__VLS_ctx.clickable ? 0 : undefined) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign(__assign(__assign({ 'onKeydown': {} }, { 'onKeydown': {} }), { class: "glass-card overflow-hidden transition-all duration-300" }), { class: ({
            'cursor-pointer hover-glow active:scale-[0.98]': __VLS_ctx.clickable,
            'border-error-main/50 animate-pulse-error': __VLS_ctx.error,
            'h-full flex flex-col': __VLS_ctx.hFull,
        }) }), { role: (__VLS_ctx.clickable ? 'button' : undefined), tabindex: (__VLS_ctx.clickable ? 0 : undefined) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
(__VLS_ctx.$attrs);
var __VLS_5;
var __VLS_6 = ({ keydown: {} },
    { onKeydown: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.clickable && __VLS_ctx.$emit('click');
            // @ts-ignore
            [clickable, clickable, clickable, clickable, error, hFull, $attrs, $emit,];
        } });
var __VLS_7 = ({ keydown: {} },
    { onKeydown: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.clickable && __VLS_ctx.$emit('click');
            // @ts-ignore
            [clickable, $emit,];
        } });
var __VLS_8 = {};
/** @type {__VLS_StyleScopedClasses['glass-card']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover-glow']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-[0.98]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-error-main/50']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-pulse-error']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
var __VLS_9 = __VLS_3.slots.default;
if (__VLS_ctx.$slots.header) {
    {
        var __VLS_10 = __VLS_3.slots.header;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "px-6 py-4 border-b border-black/5 dark:border-white/5 font-bold text-text-primary text-lg tracking-tight flex items-center justify-between" }));
        /** @type {__VLS_StyleScopedClasses['px-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
        var __VLS_11 = {};
        // @ts-ignore
        [$slots,];
    }
}
{
    var __VLS_13 = __VLS_3.slots.content;
    if (__VLS_ctx.error) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "p-8 flex flex-col items-center justify-center text-center gap-4 animate-fade-in" }));
        /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-12 h-12 rounded-full bg-error-main/10 flex items-center justify-center text-error-main" }));
        /** @type {__VLS_StyleScopedClasses['w-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-error-main/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-error-main']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: "pi pi-exclamation-circle text-2xl" }));
        /** @type {__VLS_StyleScopedClasses['pi']} */ ;
        /** @type {__VLS_StyleScopedClasses['pi-exclamation-circle']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col gap-1" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "text-error-main font-bold" }));
        /** @type {__VLS_StyleScopedClasses['text-error-main']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-text-secondary text-sm max-w-[200px]" }));
        /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['max-w-[200px]']} */ ;
        (__VLS_ctx.errorMsg || 'Não foi possível carregar as informações agora.');
        if (__VLS_ctx.retryable) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.error))
                        return;
                    if (!(__VLS_ctx.retryable))
                        return;
                    __VLS_ctx.$emit('retry');
                    // @ts-ignore
                    [error, $emit, errorMsg, retryable,];
                } }, { class: "mt-2 px-4 py-2 bg-error-main text-white rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all" }));
            /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
            /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
            /** @type {__VLS_StyleScopedClasses['bg-error-main']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
            /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
            /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
            /** @type {__VLS_StyleScopedClasses['hover:opacity-90']} */ ;
            /** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
        }
    }
    else if (__VLS_ctx.isLoading) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "p-6 flex flex-col gap-4 animate-fade-in" }));
        /** @type {__VLS_StyleScopedClasses['p-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-4" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
        var __VLS_14 = BaseSkeleton_vue_1.default;
        // @ts-ignore
        var __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
            width: "40px",
            height: "40px",
            rounded: true,
        }));
        var __VLS_16 = __VLS_15.apply(void 0, __spreadArray([{
                width: "40px",
                height: "40px",
                rounded: true,
            }], __VLS_functionalComponentArgsRest(__VLS_15), false));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col gap-2 flex-1" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
        var __VLS_19 = BaseSkeleton_vue_1.default;
        // @ts-ignore
        var __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
            width: "40%",
            height: "12px",
        }));
        var __VLS_21 = __VLS_20.apply(void 0, __spreadArray([{
                width: "40%",
                height: "12px",
            }], __VLS_functionalComponentArgsRest(__VLS_20), false));
        var __VLS_24 = BaseSkeleton_vue_1.default;
        // @ts-ignore
        var __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
            width: "70%",
            height: "20px",
        }));
        var __VLS_26 = __VLS_25.apply(void 0, __spreadArray([{
                width: "70%",
                height: "20px",
            }], __VLS_functionalComponentArgsRest(__VLS_25), false));
    }
    else if (__VLS_ctx.isEmpty) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "p-12 flex flex-col items-center justify-center text-center gap-4 animate-fade-in" }));
        /** @type {__VLS_StyleScopedClasses['p-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
        var __VLS_29 = BaseIconBox_vue_1.default || BaseIconBox_vue_1.default;
        // @ts-ignore
        var __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29(__assign({ color: (__VLS_ctx.emptyColor), size: "lg" }, { class: "opacity-50 mb-2" })));
        var __VLS_31 = __VLS_30.apply(void 0, __spreadArray([__assign({ color: (__VLS_ctx.emptyColor), size: "lg" }, { class: "opacity-50 mb-2" })], __VLS_functionalComponentArgsRest(__VLS_30), false));
        /** @type {__VLS_StyleScopedClasses['opacity-50']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
        var __VLS_34 = __VLS_32.slots.default;
        var __VLS_35 = {};
        __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
            xmlns: "http://www.w3.org/2000/svg",
            width: "32",
            height: "32",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            'stroke-width': "1.5",
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
            d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
            d: "M21 3v5h-5",
        });
        // @ts-ignore
        [isLoading, isEmpty, emptyColor,];
        var __VLS_32;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col gap-1" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "text-text-primary font-bold text-lg" }));
        /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
        (__VLS_ctx.emptyTitle || 'Sem dados');
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-text-secondary text-sm max-w-[250px] leading-relaxed" }));
        /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['max-w-[250px]']} */ ;
        /** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
        (__VLS_ctx.emptySubtitle || 'Não há informações disponíveis para exibir neste momento.');
        var __VLS_37 = {};
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "p-6 text-text-primary" }, { class: ({ 'h-full flex flex-col': __VLS_ctx.hFull, '!p-0': __VLS_ctx.padding === 'none' }) }));
        /** @type {__VLS_StyleScopedClasses['p-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['!p-0']} */ ;
        var __VLS_39 = {};
    }
    // @ts-ignore
    [hFull, emptyTitle, emptySubtitle, padding,];
}
if (__VLS_ctx.$slots.footer) {
    {
        var __VLS_41 = __VLS_3.slots.footer;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "px-6 py-4 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/5 text-text-secondary text-sm font-medium" }));
        /** @type {__VLS_StyleScopedClasses['px-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
        var __VLS_42 = {};
        // @ts-ignore
        [$slots,];
    }
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_12 = __VLS_11, __VLS_36 = __VLS_35, __VLS_38 = __VLS_37, __VLS_40 = __VLS_39, __VLS_43 = __VLS_42;
// @ts-ignore
[];
var __VLS_base = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    emits: {},
    __typeProps: {},
});
var __VLS_export = {};
exports.default = {};
