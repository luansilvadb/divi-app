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
var button_1 = require("primevue/button");
var props = withDefaults(defineProps(), {
    variant: 'primary',
    disabled: false,
    loading: false
});
var primeSeverity = (0, vue_1.computed)(function () {
    if (props.variant === 'danger')
        return 'danger';
    if (props.variant === 'secondary')
        return 'secondary';
    if (props.variant === 'ghost' || props.variant === 'outline')
        return 'secondary';
    return undefined; // Primary is default
});
var __VLS_defaults = {
    variant: 'primary',
    disabled: false,
    loading: false
};
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Button | typeof __VLS_components.Button} */
button_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ severity: (__VLS_ctx.primeSeverity), outlined: (__VLS_ctx.variant === 'outline'), text: (__VLS_ctx.variant === 'ghost'), disabled: (__VLS_ctx.disabled || __VLS_ctx.loading), loading: (__VLS_ctx.loading) }, { class: ([
        'font-bold transition-all duration-300 outline-hidden focus-visible:ring-2 focus-visible:ring-primary-main focus-visible:ring-offset-2 focus-visible:ring-offset-surface-main active:scale-95 px-6 py-2.5',
        { 'shadow-lg': !['outline', 'ghost'].includes(__VLS_ctx.variant) },
    ]) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ severity: (__VLS_ctx.primeSeverity), outlined: (__VLS_ctx.variant === 'outline'), text: (__VLS_ctx.variant === 'ghost'), disabled: (__VLS_ctx.disabled || __VLS_ctx.loading), loading: (__VLS_ctx.loading) }, { class: ([
            'font-bold transition-all duration-300 outline-hidden focus-visible:ring-2 focus-visible:ring-primary-main focus-visible:ring-offset-2 focus-visible:ring-offset-surface-main active:scale-95 px-6 py-2.5',
            { 'shadow-lg': !['outline', 'ghost'].includes(__VLS_ctx.variant) },
        ]) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
(__VLS_ctx.$attrs);
__VLS_asFunctionalDirective(__VLS_directives.vRipple, {})(null, __assign({}, __VLS_directiveBindingRestFields), null, null);
var __VLS_5 = {};
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-primary-main']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-surface-main']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
var __VLS_6 = __VLS_3.slots.default;
var __VLS_7 = {};
// @ts-ignore
[primeSeverity, variant, variant, variant, disabled, loading, loading, $attrs, vRipple,];
var __VLS_3;
// @ts-ignore
var __VLS_8 = __VLS_7;
// @ts-ignore
[];
var __VLS_base = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
var __VLS_export = {};
exports.default = {};
