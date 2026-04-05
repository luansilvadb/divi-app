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
var select_1 = require("primevue/select");
var __VLS_props = defineProps();
var __VLS_emit = defineEmits(['update:modelValue']);
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "mb-2 relative" }));
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
if (__VLS_ctx.label) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)(__assign({ for: (__VLS_ctx.id) }, { class: "block text-sm font-medium mb-1 text-text-primary" }));
    /** @type {__VLS_StyleScopedClasses['block']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    (__VLS_ctx.label);
}
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Select | typeof __VLS_components.Select} */
select_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ 'onUpdate:modelValue': {} }, { id: (__VLS_ctx.id), modelValue: (__VLS_ctx.modelValue), options: (__VLS_ctx.options), optionLabel: "label", optionValue: "value", placeholder: (__VLS_ctx.placeholder), invalid: (!!__VLS_ctx.error), 'aria-describedby': (__VLS_ctx.error ? "".concat(__VLS_ctx.id, "-error") : undefined), fluid: true })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ 'onUpdate:modelValue': {} }, { id: (__VLS_ctx.id), modelValue: (__VLS_ctx.modelValue), options: (__VLS_ctx.options), optionLabel: "label", optionValue: "value", placeholder: (__VLS_ctx.placeholder), invalid: (!!__VLS_ctx.error), 'aria-describedby': (__VLS_ctx.error ? "".concat(__VLS_ctx.id, "-error") : undefined), fluid: true })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5;
var __VLS_6 = ({ 'update:modelValue': {} },
    { 'onUpdate:modelValue': (function (val) { return __VLS_ctx.$emit('update:modelValue', val); }) });
var __VLS_7 = __VLS_3.slots.default;
{
    var __VLS_8 = __VLS_3.slots.empty;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "py-2 px-4 text-sm text-text-disabled italic" }));
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
    /** @type {__VLS_StyleScopedClasses['italic']} */ ;
    // @ts-ignore
    [label, label, id, id, id, modelValue, options, placeholder, error, error, $emit,];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ id: ("".concat(__VLS_ctx.id, "-error")), 'aria-live': "polite" }, { class: "mt-1 text-xs text-error-main" }));
    /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-error-main']} */ ;
    (__VLS_ctx.error);
}
// @ts-ignore
[id, error, error,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    emits: {},
    __typeProps: {},
});
exports.default = {};
