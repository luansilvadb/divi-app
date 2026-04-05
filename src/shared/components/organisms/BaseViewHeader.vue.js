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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * BaseViewHeader Organism
 * Standard header for feature pages.
 */
var vue_1 = require("vue");
var props = defineProps();
var titleBefore = (0, vue_1.computed)(function () {
    if (!props.highlight)
        return props.title;
    var index = props.title.indexOf(props.highlight);
    if (index === -1)
        return props.title;
    return props.title.substring(0, index).trim();
});
var titleAfter = (0, vue_1.computed)(function () {
    if (!props.highlight)
        return '';
    var index = props.title.indexOf(props.highlight);
    if (index === -1)
        return '';
    return props.title.substring(index + props.highlight.length).trim();
});
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)(__assign({ class: "view-header flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6" }));
/** @type {__VLS_StyleScopedClasses['view-header']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['md:items-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-10']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "title-section flex flex-col gap-2" }));
/** @type {__VLS_StyleScopedClasses['title-section']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "page-title text-4xl font-black tracking-tight text-text-primary m-0 leading-none" }));
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
var __VLS_0 = {};
if (__VLS_ctx.highlight) {
    if (__VLS_ctx.titleBefore) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "opacity-80" }));
        /** @type {__VLS_StyleScopedClasses['opacity-80']} */ ;
        (__VLS_ctx.titleBefore);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-primary-main ml-1" }));
    /** @type {__VLS_StyleScopedClasses['text-primary-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
    (__VLS_ctx.highlight);
    if (__VLS_ctx.titleAfter) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "opacity-80 ml-1" }));
        /** @type {__VLS_StyleScopedClasses['opacity-80']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
        (__VLS_ctx.titleAfter);
    }
}
else {
    (__VLS_ctx.title);
}
if (__VLS_ctx.subtitle) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "page-subtitle text-base font-medium text-text-secondary m-0 max-w-2xl" }));
    /** @type {__VLS_StyleScopedClasses['page-subtitle']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['m-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['max-w-2xl']} */ ;
    (__VLS_ctx.subtitle);
}
if (__VLS_ctx.$slots.action) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "header-actions flex gap-3 transition-transform duration-300" }));
    /** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
    var __VLS_2 = {};
}
// @ts-ignore
var __VLS_1 = __VLS_0, __VLS_3 = __VLS_2;
// @ts-ignore
[highlight, highlight, titleBefore, titleBefore, titleAfter, titleAfter, title, subtitle, subtitle, $slots,];
var __VLS_base = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
var __VLS_export = {};
exports.default = {};
