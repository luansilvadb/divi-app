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
 * StandardPageLayout Template
 * Provides a consistent structure for all feature pages.
 */
var BaseViewHeader_vue_1 = require("../organisms/BaseViewHeader.vue");
var __VLS_props = defineProps();
var __VLS_ctx = __assign(__assign(__assign({}, {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "standard-page-layout min-h-screen bg-bg-main p-6 md:p-10 lg:p-14" }));
/** @type {__VLS_StyleScopedClasses['standard-page-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-bg-main']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-10']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:p-14']} */ ;
var __VLS_0 = BaseViewHeader_vue_1.default || BaseViewHeader_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: (__VLS_ctx.title),
    subtitle: (__VLS_ctx.subtitle),
    highlight: (__VLS_ctx.highlight),
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        title: (__VLS_ctx.title),
        subtitle: (__VLS_ctx.subtitle),
        highlight: (__VLS_ctx.highlight),
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = __VLS_3.slots.default;
if (__VLS_ctx.$slots.title) {
    {
        var __VLS_6 = __VLS_3.slots.title;
        var __VLS_7 = {};
        // @ts-ignore
        [title, subtitle, highlight, $slots,];
    }
}
if (__VLS_ctx.$slots.action) {
    {
        var __VLS_9 = __VLS_3.slots.action;
        var __VLS_10 = {};
        // @ts-ignore
        [$slots,];
    }
}
// @ts-ignore
[];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)(__assign({ class: "page-content animate-in fade-in slide-in-from-bottom-4 duration-700" }));
/** @type {__VLS_StyleScopedClasses['page-content']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-in']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['slide-in-from-bottom-4']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
var __VLS_12 = {};
// @ts-ignore
var __VLS_8 = __VLS_7, __VLS_11 = __VLS_10, __VLS_13 = __VLS_12;
// @ts-ignore
[];
var __VLS_base = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
var __VLS_export = {};
exports.default = {};
