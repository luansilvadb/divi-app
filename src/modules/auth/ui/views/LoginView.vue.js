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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var BaseButton_vue_1 = require("@/shared/components/atoms/BaseButton.vue");
var di_1 = require("@/core/di");
var di_tokens_1 = require("@/core/di-tokens");
var isLoading = (0, vue_1.ref)(false);
var authService = di_1.container.resolve(di_tokens_1.DI_TOKENS.AuthService);
var currentYear = new Date().getFullYear();
function handleLogin() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isLoading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, authService.signInWithGoogle()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Login error:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    isLoading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-main" }));
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-bg-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[url('/assets/noise-overlay.svg')] bg-repeat" }, { 'aria-hidden': "true" }));
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-[0.03]']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[url(\'/assets/noise-overlay.svg\')]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-repeat']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "relative z-20 flex flex-col items-center gap-8 p-6 w-full max-w-[480px] animate-fade-in" }));
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[480px]']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "glass-card flex flex-col items-center gap-6 w-full p-10 sm:p-12 hover-glow" }));
/** @type {__VLS_StyleScopedClasses['glass-card']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['p-10']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:p-12']} */ ;
/** @type {__VLS_StyleScopedClasses['hover-glow']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-3 animate-fade-in [animation-delay:150ms]" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['[animation-delay:150ms]']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "shrink-0 drop-shadow-md" }));
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['drop-shadow-md']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    width: "44",
    height: "44",
    viewBox: "0 0 44 44",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    'aria-hidden': "true",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.rect)({
    width: "44",
    height: "44",
    rx: "12",
    fill: "url(#logoGradient)",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M14 16C14 14.8954 14.8954 14 16 14H22C25.866 14 29 17.134 29 21C29 24.866 25.866 28 22 28H18V30C18 31.1046 17.1046 32 16 32C14.8954 32 14 31.1046 14 30V16Z",
    fill: "white",
    'fill-opacity': "0.95",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.circle)({
    cx: "30",
    cy: "28",
    r: "4",
    fill: "white",
    'fill-opacity': "0.6",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.defs, __VLS_intrinsics.defs)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.linearGradient, __VLS_intrinsics.linearGradient)({
    id: "logoGradient",
    x1: "0",
    y1: "0",
    x2: "44",
    y2: "44",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.stop)({
    'stop-color': "var(--color-primary-main)",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.stop)({
    offset: "0.5",
    'stop-color': "var(--color-secondary-main)",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.stop)({
    offset: "1",
    'stop-color': "var(--color-accent-main)",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "text-[2.25rem] sm:text-[2.5rem] font-extrabold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary-main via-secondary-main to-accent-main" }));
/** @type {__VLS_StyleScopedClasses['text-[2.25rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-[2.5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
/** @type {__VLS_StyleScopedClasses['from-primary-main']} */ ;
/** @type {__VLS_StyleScopedClasses['via-secondary-main']} */ ;
/** @type {__VLS_StyleScopedClasses['to-accent-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-center text-[1.1rem] leading-relaxed text-text-secondary m-0 animate-fade-in [animation-delay:250ms]" }));
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[1.1rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['[animation-delay:250ms]']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "font-bold text-text-primary" }));
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-wrap justify-center gap-2 animate-fade-in [animation-delay:350ms]" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['[animation-delay:350ms]']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-text-secondary bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 transition-transform duration-200 hover:-translate-y-[1px] hover:bg-black/10 dark:hover:bg-white/15" }));
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:-translate-y-[1px]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-white/15']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ class: "w-3.5 h-3.5 text-secondary-main shrink-0" }, { viewBox: "0 0 20 20", fill: "currentColor" }));
/** @type {__VLS_StyleScopedClasses['w-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-secondary-main']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    'fill-rule': "evenodd",
    d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
    'clip-rule': "evenodd",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-text-secondary bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 transition-transform duration-200 hover:-translate-y-[1px] hover:bg-black/10 dark:hover:bg-white/15" }));
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:-translate-y-[1px]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-white/15']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ class: "w-3.5 h-3.5 text-secondary-main shrink-0" }, { viewBox: "0 0 20 20", fill: "currentColor" }));
/** @type {__VLS_StyleScopedClasses['w-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-secondary-main']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    'fill-rule': "evenodd",
    d: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z",
    'clip-rule': "evenodd",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-text-secondary bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 transition-transform duration-200 hover:-translate-y-[1px] hover:bg-black/10 dark:hover:bg-white/15" }));
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:-translate-y-[1px]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-white/15']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ class: "w-3.5 h-3.5 text-secondary-main shrink-0" }, { viewBox: "0 0 20 20", fill: "currentColor" }));
/** @type {__VLS_StyleScopedClasses['w-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-secondary-main']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-4 w-full animate-fade-in [animation-delay:450ms]" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['[animation-delay:450ms]']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex-1 h-px bg-gradient-to-r from-transparent via-border-main to-transparent" }));
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-px']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['via-border-main']} */ ;
/** @type {__VLS_StyleScopedClasses['to-transparent']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-xs font-semibold uppercase tracking-widest text-text-disabled whitespace-nowrap" }));
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex-1 h-px bg-gradient-to-r from-transparent via-border-main to-transparent" }));
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-px']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['via-border-main']} */ ;
/** @type {__VLS_StyleScopedClasses['to-transparent']} */ ;
var __VLS_0 = BaseButton_vue_1.default || BaseButton_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ 'onClick': {} }, { variant: "outline", id: "login-google-btn", 'aria-busy': (__VLS_ctx.isLoading), pt: ({ root: { class: 'w-full relative overflow-hidden px-6 py-3.5 rounded-[0.875rem] border border-border-main bg-surface-main cursor-pointer transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] hover:border-primary-main active:translate-y-0 active:shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main disabled:opacity-60 disabled:cursor-not-allowed animate-fade-in [animation-delay:550ms] border-none' } }), disabled: (__VLS_ctx.isLoading), loading: (__VLS_ctx.isLoading) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { variant: "outline", id: "login-google-btn", 'aria-busy': (__VLS_ctx.isLoading), pt: ({ root: { class: 'w-full relative overflow-hidden px-6 py-3.5 rounded-[0.875rem] border border-border-main bg-surface-main cursor-pointer transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] hover:border-primary-main active:translate-y-0 active:shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main disabled:opacity-60 disabled:cursor-not-allowed animate-fade-in [animation-delay:550ms] border-none' } }), disabled: (__VLS_ctx.isLoading), loading: (__VLS_ctx.isLoading) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5;
var __VLS_6 = ({ click: {} },
    { onClick: (__VLS_ctx.handleLogin) });
var __VLS_7 = __VLS_3.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "relative z-10 flex items-center justify-center gap-3 text-[0.95rem] font-semibold text-text-primary" }));
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.95rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
if (!__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ class: "w-5 h-5 shrink-0" }, { viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", 'aria-hidden': "true" }));
    /** @type {__VLS_StyleScopedClasses['w-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z",
        fill: "#4285F4",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
        fill: "#34A853",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
        fill: "#FBBC05",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
        fill: "#EA4335",
    });
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ 'aria-hidden': "true" }, { class: "w-5 h-5 border-[2.5px] border-border-main border-t-primary-main rounded-full animate-spin shrink-0" }));
    /** @type {__VLS_StyleScopedClasses['w-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-[2.5px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-border-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t-primary-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
    /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.isLoading ? 'Conectando...' : 'Continuar com Google');
// @ts-ignore
[isLoading, isLoading, isLoading, isLoading, isLoading, handleLogin,];
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-center text-[0.72rem] leading-relaxed text-text-disabled m-0 animate-fade-in [animation-delay:650ms]" }));
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.72rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['[animation-delay:650ms]']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)(__assign({ href: "#", 'aria-label': "Termos de Uso" }, { class: "text-text-secondary underline decoration-black/15 dark:decoration-white/15 underline-offset-2 transition-colors duration-200 hover:text-primary-main hover:decoration-primary-main" }));
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['underline']} */ ;
/** @type {__VLS_StyleScopedClasses['decoration-black/15']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:decoration-white/15']} */ ;
/** @type {__VLS_StyleScopedClasses['underline-offset-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary-main']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:decoration-primary-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)(__assign({ href: "#", 'aria-label': "Política de Privacidade" }, { class: "text-text-secondary underline decoration-black/15 dark:decoration-white/15 underline-offset-2 transition-colors duration-200 hover:text-primary-main hover:decoration-primary-main" }));
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['underline']} */ ;
/** @type {__VLS_StyleScopedClasses['decoration-black/15']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:decoration-white/15']} */ ;
/** @type {__VLS_StyleScopedClasses['underline-offset-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary-main']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:decoration-primary-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "animate-fade-in [animation-delay:750ms]" }));
/** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['[animation-delay:750ms]']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-xs text-text-disabled tracking-[0.02em]" }));
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-[0.02em]']} */ ;
(__VLS_ctx.currentYear);
// @ts-ignore
[currentYear,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
