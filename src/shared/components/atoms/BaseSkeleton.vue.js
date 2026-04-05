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
var skeleton_1 = require("primevue/skeleton");
var __VLS_props = withDefaults(defineProps(), {
    width: '100%',
    height: '20px',
    rounded: false,
});
var __VLS_defaults = {
    width: '100%',
    height: '20px',
    rounded: false,
};
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Skeleton | typeof __VLS_components.Skeleton} */
skeleton_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign(__assign({ width: (__VLS_ctx.width), height: (__VLS_ctx.height), borderRadius: (__VLS_ctx.rounded ? '50%' : '8px') }, { class: "relative overflow-hidden bg-black/5 dark:bg-white/5" }), { class: (__VLS_ctx.customClass) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign({ width: (__VLS_ctx.width), height: (__VLS_ctx.height), borderRadius: (__VLS_ctx.rounded ? '50%' : '8px') }, { class: "relative overflow-hidden bg-black/5 dark:bg-white/5" }), { class: (__VLS_ctx.customClass) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = {};
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
var __VLS_3;
// @ts-ignore
[width, height, rounded, customClass,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
exports.default = {};
