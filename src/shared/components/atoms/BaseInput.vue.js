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
var inputtext_1 = require("primevue/inputtext");
var inputnumber_1 = require("primevue/inputnumber");
var iconfield_1 = require("primevue/iconfield");
var inputicon_1 = require("primevue/inputicon");
var props = defineProps();
var emit = defineEmits(['update:modelValue']);
var numericValue = (0, vue_1.computed)(function () {
    if (props.modelValue === null || props.modelValue === undefined || props.modelValue === '')
        return null;
    return Number(props.modelValue);
});
var textValue = (0, vue_1.computed)(function () {
    if (props.modelValue === null || props.modelValue === undefined)
        return undefined;
    return String(props.modelValue);
});
function handleUpdate(val) {
    emit('update:modelValue', val);
}
function handleUpdateText(val) {
    emit('update:modelValue', val);
}
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "mb-2" }));
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
if (__VLS_ctx.label) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)(__assign({ for: (__VLS_ctx.id) }, { class: "block text-sm font-medium mb-1 text-text-primary" }));
    /** @type {__VLS_StyleScopedClasses['block']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    (__VLS_ctx.label);
}
if (__VLS_ctx.icon) {
    var __VLS_0 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.IconField | typeof __VLS_components.IconField} */
    iconfield_1.default;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ class: "w-full" })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "w-full" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_5 = __VLS_3.slots.default;
    var __VLS_6 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.InputIcon} */
    inputicon_1.default;
    // @ts-ignore
    var __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6(__assign({ class: (__VLS_ctx.icon) }, { class: "text-text-disabled" })));
    var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ class: (__VLS_ctx.icon) }, { class: "text-text-disabled" })], __VLS_functionalComponentArgsRest(__VLS_7), false));
    /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
    if (__VLS_ctx.type === 'number') {
        var __VLS_11 = void 0;
        /** @ts-ignore @type {typeof __VLS_components.InputNumber} */
        inputnumber_1.default;
        // @ts-ignore
        var __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11(__assign({ 'onUpdate:modelValue': {} }, { id: (__VLS_ctx.id), modelValue: (__VLS_ctx.numericValue), placeholder: (__VLS_ctx.placeholder), invalid: (!!__VLS_ctx.error), 'aria-describedby': (__VLS_ctx.error ? "".concat(__VLS_ctx.id, "-error") : undefined), fluid: true })));
        var __VLS_13 = __VLS_12.apply(void 0, __spreadArray([__assign({ 'onUpdate:modelValue': {} }, { id: (__VLS_ctx.id), modelValue: (__VLS_ctx.numericValue), placeholder: (__VLS_ctx.placeholder), invalid: (!!__VLS_ctx.error), 'aria-describedby': (__VLS_ctx.error ? "".concat(__VLS_ctx.id, "-error") : undefined), fluid: true })], __VLS_functionalComponentArgsRest(__VLS_12), false));
        (__VLS_ctx.$attrs);
        var __VLS_16 = void 0;
        var __VLS_17 = ({ 'update:modelValue': {} },
            { 'onUpdate:modelValue': (__VLS_ctx.handleUpdate) });
        var __VLS_14;
        var __VLS_15;
    }
    else {
        var __VLS_18 = void 0;
        /** @ts-ignore @type {typeof __VLS_components.InputText} */
        inputtext_1.default;
        // @ts-ignore
        var __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18(__assign({ 'onUpdate:modelValue': {} }, { id: (__VLS_ctx.id), type: (__VLS_ctx.type), modelValue: (__VLS_ctx.textValue), placeholder: (__VLS_ctx.placeholder), invalid: (!!__VLS_ctx.error), 'aria-describedby': (__VLS_ctx.error ? "".concat(__VLS_ctx.id, "-error") : undefined), fluid: true })));
        var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([__assign({ 'onUpdate:modelValue': {} }, { id: (__VLS_ctx.id), type: (__VLS_ctx.type), modelValue: (__VLS_ctx.textValue), placeholder: (__VLS_ctx.placeholder), invalid: (!!__VLS_ctx.error), 'aria-describedby': (__VLS_ctx.error ? "".concat(__VLS_ctx.id, "-error") : undefined), fluid: true })], __VLS_functionalComponentArgsRest(__VLS_19), false));
        (__VLS_ctx.$attrs);
        var __VLS_23 = void 0;
        var __VLS_24 = ({ 'update:modelValue': {} },
            { 'onUpdate:modelValue': (__VLS_ctx.handleUpdateText) });
        var __VLS_21;
        var __VLS_22;
    }
    // @ts-ignore
    [label, label, id, id, id, id, id, icon, icon, type, type, numericValue, placeholder, placeholder, error, error, error, error, $attrs, $attrs, handleUpdate, textValue, handleUpdateText,];
    var __VLS_3;
}
else {
    if (__VLS_ctx.type === 'number') {
        var __VLS_25 = void 0;
        /** @ts-ignore @type {typeof __VLS_components.InputNumber} */
        inputnumber_1.default;
        // @ts-ignore
        var __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25(__assign({ 'onUpdate:modelValue': {} }, { id: (__VLS_ctx.id), modelValue: (__VLS_ctx.numericValue), placeholder: (__VLS_ctx.placeholder), invalid: (!!__VLS_ctx.error), 'aria-describedby': (__VLS_ctx.error ? "".concat(__VLS_ctx.id, "-error") : undefined), fluid: true })));
        var __VLS_27 = __VLS_26.apply(void 0, __spreadArray([__assign({ 'onUpdate:modelValue': {} }, { id: (__VLS_ctx.id), modelValue: (__VLS_ctx.numericValue), placeholder: (__VLS_ctx.placeholder), invalid: (!!__VLS_ctx.error), 'aria-describedby': (__VLS_ctx.error ? "".concat(__VLS_ctx.id, "-error") : undefined), fluid: true })], __VLS_functionalComponentArgsRest(__VLS_26), false));
        (__VLS_ctx.$attrs);
        var __VLS_30 = void 0;
        var __VLS_31 = ({ 'update:modelValue': {} },
            { 'onUpdate:modelValue': (__VLS_ctx.handleUpdate) });
        var __VLS_28;
        var __VLS_29;
    }
    else {
        var __VLS_32 = void 0;
        /** @ts-ignore @type {typeof __VLS_components.InputText} */
        inputtext_1.default;
        // @ts-ignore
        var __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32(__assign({ 'onUpdate:modelValue': {} }, { id: (__VLS_ctx.id), type: (__VLS_ctx.type), modelValue: (__VLS_ctx.textValue), placeholder: (__VLS_ctx.placeholder), invalid: (!!__VLS_ctx.error), 'aria-describedby': (__VLS_ctx.error ? "".concat(__VLS_ctx.id, "-error") : undefined), fluid: true })));
        var __VLS_34 = __VLS_33.apply(void 0, __spreadArray([__assign({ 'onUpdate:modelValue': {} }, { id: (__VLS_ctx.id), type: (__VLS_ctx.type), modelValue: (__VLS_ctx.textValue), placeholder: (__VLS_ctx.placeholder), invalid: (!!__VLS_ctx.error), 'aria-describedby': (__VLS_ctx.error ? "".concat(__VLS_ctx.id, "-error") : undefined), fluid: true })], __VLS_functionalComponentArgsRest(__VLS_33), false));
        (__VLS_ctx.$attrs);
        var __VLS_37 = void 0;
        var __VLS_38 = ({ 'update:modelValue': {} },
            { 'onUpdate:modelValue': (__VLS_ctx.handleUpdateText) });
        var __VLS_35;
        var __VLS_36;
    }
}
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ id: ("".concat(__VLS_ctx.id, "-error")), 'aria-live': "polite" }, { class: "mt-1 text-xs text-error-main" }));
    /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-error-main']} */ ;
    (__VLS_ctx.error);
}
// @ts-ignore
[id, id, id, id, id, type, type, numericValue, placeholder, placeholder, error, error, error, error, error, error, $attrs, $attrs, handleUpdate, textValue, handleUpdateText,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    emits: {},
    __typeProps: {},
});
exports.default = {};
