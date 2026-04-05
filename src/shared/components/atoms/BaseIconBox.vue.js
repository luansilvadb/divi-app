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
var vue_1 = require("vue");
var props = withDefaults(defineProps(), {
    size: 'md',
});
var sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
};
var isCssVar = (0, vue_1.computed)(function () { var _a; return (_a = props.color) === null || _a === void 0 ? void 0 : _a.startsWith('var('); });
var customStyle = (0, vue_1.computed)(function () {
    if (!props.color)
        return {};
    return {
        backgroundColor: isCssVar.value ? "rgba(".concat(props.color, ", 0.1)") : "".concat(props.color, "15"),
        color: props.color,
    };
});
var customClasses = (0, vue_1.computed)(function () {
    if (props.color)
        return '';
    return 'bg-primary-main/10 text-primary-main';
});
var __VLS_defaults = {
    size: 'md',
};
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ class: "rounded-xl flex items-center justify-center transition-all duration-300" }, { class: ([__VLS_ctx.sizeClasses[__VLS_ctx.size], __VLS_ctx.customClasses]) }), { style: (__VLS_ctx.customStyle) }));
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
var __VLS_0 = {};
// @ts-ignore
var __VLS_1 = __VLS_0;
// @ts-ignore
[sizeClasses, size, customClasses, customStyle,];
var __VLS_base = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
var __VLS_export = {};
exports.default = {};
