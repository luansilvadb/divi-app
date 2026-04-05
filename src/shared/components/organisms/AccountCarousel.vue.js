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
var carousel_1 = require("primevue/carousel");
var BaseCard_vue_1 = require("@/shared/components/atoms/BaseCard.vue");
var di_1 = require("@/core/di");
var di_tokens_1 = require("@/core/di-tokens");
var formatters_1 = require("@/shared/utils/formatters");
var assetLoader = di_1.container.resolve(di_tokens_1.DI_TOKENS.AssetLoader);
var __VLS_props = defineProps();
var responsiveOptions = (0, vue_1.ref)([
    {
        breakpoint: '1400px',
        numVisible: 1,
        numScroll: 1
    }
]);
function getWalletIcon(wallet) {
    return assetLoader.sanitize(wallet.icon);
}
function handleImageError(e) {
    var target = e.target;
    target.src = assetLoader.getFallback('wallet');
}
function getWalletColor(wallet) {
    var colors = [
        'var(--color-primary-main)',
        'var(--color-secondary-main)',
        'var(--color-accent-main)',
        'var(--color-info-main)',
    ];
    var hash = 0;
    for (var i = 0; i < wallet.name.length; i++) {
        hash = wallet.name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "account-carousel" }));
/** @type {__VLS_StyleScopedClasses['account-carousel']} */ ;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Carousel | typeof __VLS_components.Carousel} */
carousel_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ value: (__VLS_ctx.wallets), numVisible: (1), numScroll: (1), responsiveOptions: (__VLS_ctx.responsiveOptions) }, { class: "rounded-[1.25rem] overflow-hidden" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ value: (__VLS_ctx.wallets), numVisible: (1), numScroll: (1), responsiveOptions: (__VLS_ctx.responsiveOptions) }, { class: "rounded-[1.25rem] overflow-hidden" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
/** @type {__VLS_StyleScopedClasses['rounded-[1.25rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
var __VLS_5 = __VLS_3.slots.default;
{
    var __VLS_6 = __VLS_3.slots.item;
    var slotProps = __VLS_vSlot(__VLS_6)[0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "wallet-slide min-w-full p-1" }));
    /** @type {__VLS_StyleScopedClasses['wallet-slide']} */ ;
    /** @type {__VLS_StyleScopedClasses['min-w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-1']} */ ;
    var __VLS_7 = BaseCard_vue_1.default || BaseCard_vue_1.default;
    // @ts-ignore
    var __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7(__assign({ class: "wallet-card-premium !p-0 h-[140px] flex overflow-hidden bg-surface-main border border-black/5 dark:border-white/5 shadow-2xl transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]" }, { clickable: true })));
    var __VLS_9 = __VLS_8.apply(void 0, __spreadArray([__assign({ class: "wallet-card-premium !p-0 h-[140px] flex overflow-hidden bg-surface-main border border-black/5 dark:border-white/5 shadow-2xl transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]" }, { clickable: true })], __VLS_functionalComponentArgsRest(__VLS_8), false));
    /** @type {__VLS_StyleScopedClasses['wallet-card-premium']} */ ;
    /** @type {__VLS_StyleScopedClasses['!p-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-[140px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-surface-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-black/[0.02]']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:hover:bg-white/[0.02]']} */ ;
    var __VLS_12 = __VLS_10.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "wallet-accent w-1.5 h-full" }, { style: ({ background: __VLS_ctx.getWalletColor(slotProps.data) }) }));
    /** @type {__VLS_StyleScopedClasses['wallet-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-1.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "wallet-body flex-1 p-6 flex flex-col justify-center" }));
    /** @type {__VLS_StyleScopedClasses['wallet-body']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "wallet-meta flex justify-between items-center mb-2" }));
    /** @type {__VLS_StyleScopedClasses['wallet-meta']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-2" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    if (slotProps.data.icon) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-5 h-5 flex items-center justify-center opacity-80" }));
        /** @type {__VLS_StyleScopedClasses['w-5']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-5']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['opacity-80']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)(__assign(__assign({ onError: (__VLS_ctx.handleImageError) }, { src: (__VLS_ctx.getWalletIcon(slotProps.data)) }), { class: "w-full h-full object-contain" }));
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['object-contain']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "wallet-name text-xs font-bold text-text-secondary uppercase tracking-widest" }));
    /** @type {__VLS_StyleScopedClasses['wallet-name']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    (slotProps.data.name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "wallet-label text-[0.7rem] font-bold text-text-disabled uppercase opacity-80" }));
    /** @type {__VLS_StyleScopedClasses['wallet-label']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-[0.7rem]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-80']} */ ;
    (slotProps.data.currency);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "wallet-main" }));
    /** @type {__VLS_StyleScopedClasses['wallet-main']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "wallet-balance text-4xl font-extrabold text-text-primary tracking-tighter" }));
    /** @type {__VLS_StyleScopedClasses['wallet-balance']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-tighter']} */ ;
    (__VLS_ctx.formatCurrency(slotProps.data.balance));
    // @ts-ignore
    [wallets, responsiveOptions, getWalletColor, handleImageError, getWalletIcon, formatters_1.formatCurrency,];
    var __VLS_10;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
