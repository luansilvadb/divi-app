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
var progressbar_1 = require("primevue/progressbar");
var __VLS_props = withDefaults(defineProps(), {
    percentage: 0,
    isOverBudget: false,
    status: 'normal',
});
var __VLS_defaults = {
    percentage: 0,
    isOverBudget: false,
    status: 'normal',
};
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-full" }));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.ProgressBar | typeof __VLS_components.ProgressBar} */
progressbar_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ value: (__VLS_ctx.percentage), showValue: (false) }, { class: "h-2.5 rounded-full overflow-hidden bg-black/5 dark:bg-white/5 shadow-inner" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ value: (__VLS_ctx.percentage), showValue: (false) }, { class: "h-2.5 rounded-full overflow-hidden bg-black/5 dark:bg-white/5 shadow-inner" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
/** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-inner']} */ ;
var __VLS_5 = __VLS_3.slots.default;
{
    var __VLS_6 = __VLS_3.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-30" }));
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
    /** @type {__VLS_StyleScopedClasses['from-transparent']} */ ;
    /** @type {__VLS_StyleScopedClasses['via-white/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['to-transparent']} */ ;
    /** @type {__VLS_StyleScopedClasses['animate-shimmer']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
    // @ts-ignore
    [percentage,];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
exports.default = {};
