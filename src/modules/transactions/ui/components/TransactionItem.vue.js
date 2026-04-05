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
var di_1 = require("@/core/di");
var di_tokens_1 = require("@/core/di-tokens");
var formatters_1 = require("@/shared/utils/formatters");
var assetLoader = di_1.container.resolve(di_tokens_1.DI_TOKENS.AssetLoader);
var props = defineProps();
var __VLS_emit = defineEmits(['click', 'delete']);
var sanitizedCategoryIcon = (0, vue_1.computed)(function () {
    return assetLoader.sanitize(props.categoryIcon);
});
function handleImageError(e) {
    var target = e.target;
    target.src = assetLoader.getFallback('category');
}
var iconComponent = (0, vue_1.computed)(function () {
    return props.transaction.type === 'income'
        ? (0, vue_1.defineAsyncComponent)(function () {
            return Promise.resolve({
                render: function () {
                    return (0, vue_1.h)('svg', {
                        xmlns: 'http://www.w3.org/2000/svg',
                        width: '20',
                        height: '20',
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: 'currentColor',
                        'stroke-width': '2.5',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                    }, [(0, vue_1.h)('path', { d: 'M12 19V5M5 12l7-7 7 7' })]);
                },
            });
        })
        : (0, vue_1.defineAsyncComponent)(function () {
            return Promise.resolve({
                render: function () {
                    return (0, vue_1.h)('svg', {
                        xmlns: 'http://www.w3.org/2000/svg',
                        width: '20',
                        height: '20',
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: 'currentColor',
                        'stroke-width': '2.5',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                    }, [(0, vue_1.h)('path', { d: 'M12 5v14M5 12l7 7 7-7' })]);
                },
            });
        });
});
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$emit('click');
        // @ts-ignore
        [$emit,];
    } }, { onKeydown: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$emit('click');
        // @ts-ignore
        [$emit,];
    } }), { onKeydown: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$emit('click');
        // @ts-ignore
        [$emit,];
    } }), { role: "button", tabindex: "0" }), { class: "transaction-item flex items-center p-3 sm:p-4 gap-3 sm:gap-4 cursor-pointer relative transition-all duration-300 rounded-[1.5rem] sm:rounded-[2rem] border border-black/5 dark:border-white/5 bg-white/50 dark:bg-surface-main hover:bg-white/80 dark:hover:bg-[#1b2234] hover:shadow-xl hover:shadow-black/5 group mb-2 last:mb-0 outline-hidden focus-visible:ring-2 focus-visible:ring-primary-main focus-visible:ring-offset-2 focus-visible:ring-offset-surface-main" }));
/** @type {__VLS_StyleScopedClasses['transaction-item']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-[1.5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:rounded-[2rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-surface-main']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/80']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-[#1b2234]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['last:mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-primary-main']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-surface-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex-shrink-0 relative" }));
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-105" }, { style: ({
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05), transparent), var(--color-bg-main)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.3)',
    }) }));
/** @type {__VLS_StyleScopedClasses['w-11']} */ ;
/** @type {__VLS_StyleScopedClasses['h-11']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-14']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-14']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:scale-105']} */ ;
if (__VLS_ctx.categoryIcon) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)(__assign(__assign({ onError: (__VLS_ctx.handleImageError) }, { src: (__VLS_ctx.sanitizedCategoryIcon) }), { class: "w-5 h-5 sm:w-7 sm:h-7 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" }));
    /** @type {__VLS_StyleScopedClasses['w-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:w-7']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:h-7']} */ ;
    /** @type {__VLS_StyleScopedClasses['object-contain']} */ ;
    /** @type {__VLS_StyleScopedClasses['drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]']} */ ;
}
else {
    var __VLS_0 = (__VLS_ctx.iconComponent);
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ class: "w-5 h-5 sm:w-7 sm:h-7 text-accent-main" })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "w-5 h-5 sm:w-7 sm:h-7 text-accent-main" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    /** @type {__VLS_StyleScopedClasses['w-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:w-7']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:h-7']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-accent-main']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-surface-main z-20 flex items-center justify-center shadow-lg" }, { class: (__VLS_ctx.transaction.type === 'income' ? 'bg-success-main' : 'bg-error-main') }));
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['-bottom-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['-right-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-surface-main']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
if (__VLS_ctx.transaction.type === 'income') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign(__assign({ xmlns: "http://www.w3.org/2000/svg" }, { class: "w-2.5 h-2.5 sm:w-3 sm:h-3" }), { viewBox: "0 0 24 24", fill: "none", stroke: "white", 'stroke-width': "4", 'stroke-linecap': "round", 'stroke-linejoin': "round" }));
    /** @type {__VLS_StyleScopedClasses['w-2.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:w-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:h-3']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M12 19V5M5 12l7-7 7 7",
    });
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign(__assign({ xmlns: "http://www.w3.org/2000/svg" }, { class: "w-2.5 h-2.5 sm:w-3 sm:h-3" }), { viewBox: "0 0 24 24", fill: "none", stroke: "white", 'stroke-width': "4", 'stroke-linecap': "round", 'stroke-linejoin': "round" }));
    /** @type {__VLS_StyleScopedClasses['w-2.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:w-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:h-3']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M12 5v14M5 12l7 7 7-7",
    });
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex-1 min-w-0 flex flex-col justify-center gap-1.5" }));
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-2" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "font-extrabold text-text-primary text-[0.95rem] sm:text-[1.1rem] leading-tight truncate tracking-tight" }));
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.95rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-[1.1rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
(__VLS_ctx.transaction.title || 'Sem título');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex sm:hidden items-center gap-1.5 text-[0.6rem] font-black uppercase tracking-widest text-text-disabled truncate" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.6rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
if (__VLS_ctx.walletName) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "truncate max-w-[65px]" }));
    /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
    /** @type {__VLS_StyleScopedClasses['max-w-[65px]']} */ ;
    (__VLS_ctx.walletName);
}
if (__VLS_ctx.walletName) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-black/20 dark:text-white/20" }));
    /** @type {__VLS_StyleScopedClasses['text-black/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:text-white/20']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "truncate max-w-[80px] text-text-secondary" }));
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[80px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
(__VLS_ctx.categoryName);
if (__VLS_ctx.showTime) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-black/20 dark:text-white/20" }));
    /** @type {__VLS_StyleScopedClasses['text-black/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:text-white/20']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "flex-shrink-0" }));
    /** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
    (__VLS_ctx.formatTime(__VLS_ctx.transaction.date));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "hidden sm:flex flex-wrap items-center gap-2" }));
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
if (__VLS_ctx.walletName) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "px-3 py-1 rounded-lg bg-black/20 dark:bg-white/5 text-[0.65rem] font-black uppercase tracking-widest text-text-secondary border border-white/5" }));
    /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-black/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-[0.65rem]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/5']} */ ;
    (__VLS_ctx.walletName);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "px-3 py-1 rounded-lg bg-black/20 dark:bg-white/5 text-[0.65rem] font-black uppercase tracking-widest text-text-secondary border border-white/5" }));
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/20']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.65rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/5']} */ ;
(__VLS_ctx.categoryName);
if (__VLS_ctx.showTime) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "px-3 py-1 rounded-lg bg-black/20 dark:bg-white/5 text-[0.65rem] font-black uppercase tracking-widest text-text-secondary border border-white/5" }));
    /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-black/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-[0.65rem]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/5']} */ ;
    (__VLS_ctx.formatTime(__VLS_ctx.transaction.date));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-2 sm:gap-4 flex-shrink-0" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "text-right" }));
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "font-black text-[1rem] sm:text-xl tracking-tighter transition-all duration-300" }, { class: (__VLS_ctx.transaction.type === 'expense' ? 'text-error-main' : 'text-success-main') }));
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[1rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tighter']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
(__VLS_ctx.transaction.type === 'expense' ? '-' : '+');
(__VLS_ctx.formatCurrency(__VLS_ctx.transaction.amount));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0 group-focus-within:translate-x-0 hidden md:block" }));
/** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['group-focus-within:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['translate-x-1']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:translate-x-0']} */ ;
/** @type {__VLS_StyleScopedClasses['group-focus-within:translate-x-0']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:block']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$emit('delete', __VLS_ctx.transaction.id);
        // @ts-ignore
        [$emit, categoryIcon, handleImageError, sanitizedCategoryIcon, iconComponent, transaction, transaction, transaction, transaction, transaction, transaction, transaction, transaction, transaction, walletName, walletName, walletName, walletName, walletName, categoryName, categoryName, showTime, showTime, formatters_1.formatTime, formatters_1.formatTime, formatters_1.formatCurrency,];
    } }, { 'aria-label': "Excluir transação" }), { class: "w-10 h-10 rounded-full flex items-center justify-center text-text-disabled hover:bg-error-main/10 hover:text-error-main transition-all active:scale-90 outline-hidden focus-visible:ring-2 focus-visible:ring-error-main" }));
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-error-main/10']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-error-main']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-90']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-error-main']} */ ;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.polyline, __VLS_intrinsics.polyline)({
    points: "3 6 5 6 21 6",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path, __VLS_intrinsics.path)({
    d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
});
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    emits: {},
    __typeProps: {},
});
exports.default = {};
