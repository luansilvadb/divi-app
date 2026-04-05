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
var theme_1 = require("@/core/theme");
var _a = (0, theme_1.useTheme)(), isDark = _a.isDark, toggleTheme = _a.toggle;
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.toggleTheme) }, { class: "theme-toggle flex items-center justify-center p-2 rounded-full transition-colors cursor-pointer text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5" }), { 'aria-label': (__VLS_ctx.isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'), title: (__VLS_ctx.isDark ? 'Tema Claro' : 'Tema Escuro') }));
/** @type {__VLS_StyleScopedClasses['theme-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-white/5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: (__VLS_ctx.isDark ? 'pi pi-sun' : 'pi pi-moon') }, { class: "w-5 h-5 flex items-center justify-center text-lg transition-transform duration-300" }));
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
// @ts-ignore
[toggleTheme, isDark, isDark, isDark,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
