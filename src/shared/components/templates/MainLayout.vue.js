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
var AppSidebar_vue_1 = require("@/shared/components/organisms/AppSidebar.vue");
var AppBottomBar_vue_1 = require("@/shared/components/organisms/AppBottomBar.vue");
var AppMobileDrawer_vue_1 = require("@/shared/components/organisms/AppMobileDrawer.vue");
var vue_1 = require("vue");
var isMobileDrawerOpen = (0, vue_1.ref)(false);
var emit = defineEmits();
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex h-screen w-screen overflow-hidden bg-bg-main text-text-primary" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['w-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-bg-main']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
var __VLS_0 = AppSidebar_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ 'onLogout': {} }, { class: "!hidden md:!flex" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ 'onLogout': {} }, { class: "!hidden md:!flex" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5;
var __VLS_6 = ({ logout: {} },
    { onLogout: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.emit('logout');
            // @ts-ignore
            [emit,];
        } });
/** @type {__VLS_StyleScopedClasses['!hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:!flex']} */ ;
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)(__assign({ class: "flex-1 h-full overflow-y-auto overflow-x-hidden relative pb-[4.5rem] md:pb-0" }));
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-[4.5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['md:pb-0']} */ ;
var __VLS_7 = {};
var __VLS_9 = AppBottomBar_vue_1.default;
// @ts-ignore
var __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9(__assign({ 'onOpenDrawer': {} })));
var __VLS_11 = __VLS_10.apply(void 0, __spreadArray([__assign({ 'onOpenDrawer': {} })], __VLS_functionalComponentArgsRest(__VLS_10), false));
var __VLS_14;
var __VLS_15 = ({ openDrawer: {} },
    { onOpenDrawer: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.isMobileDrawerOpen = true;
            // @ts-ignore
            [isMobileDrawerOpen,];
        } });
var __VLS_12;
var __VLS_13;
var __VLS_16 = AppMobileDrawer_vue_1.default;
// @ts-ignore
var __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16(__assign(__assign({ 'onClose': {} }, { 'onLogout': {} }), { isOpen: (__VLS_ctx.isMobileDrawerOpen) })));
var __VLS_18 = __VLS_17.apply(void 0, __spreadArray([__assign(__assign({ 'onClose': {} }, { 'onLogout': {} }), { isOpen: (__VLS_ctx.isMobileDrawerOpen) })], __VLS_functionalComponentArgsRest(__VLS_17), false));
var __VLS_21;
var __VLS_22 = ({ close: {} },
    { onClose: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.isMobileDrawerOpen = false;
            // @ts-ignore
            [isMobileDrawerOpen, isMobileDrawerOpen,];
        } });
var __VLS_23 = ({ logout: {} },
    { onLogout: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.emit('logout');
            // @ts-ignore
            [emit,];
        } });
var __VLS_19;
var __VLS_20;
// @ts-ignore
var __VLS_8 = __VLS_7;
// @ts-ignore
[];
var __VLS_base = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeEmits: {},
});
var __VLS_export = {};
exports.default = {};
