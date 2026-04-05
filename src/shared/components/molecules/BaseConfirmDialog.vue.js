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
var useIsMobile_1 = require("@/shared/composables/useIsMobile");
var dialog_1 = require("primevue/dialog");
var drawer_1 = require("primevue/drawer");
var BaseCard_vue_1 = require("../atoms/BaseCard.vue");
var BaseButton_vue_1 = require("../atoms/BaseButton.vue");
var usePrimeOverlay_1 = require("@/shared/composables/usePrimeOverlay");
var __VLS_props = defineProps();
var __VLS_emit = defineEmits(['confirm', 'cancel']);
var isMobile = (0, useIsMobile_1.useIsMobile)();
var _a = (0, usePrimeOverlay_1.useOverlayPt)(), modalPt = _a.modalPt, bottomSheetPt = _a.bottomSheetPt;
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
var __VLS_0 = (__VLS_ctx.isMobile ? __VLS_ctx.Drawer : __VLS_ctx.Dialog);
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign(__assign(__assign({ 'onUpdate:visible': {} }, { visible: (__VLS_ctx.show), position: (__VLS_ctx.isMobile ? 'bottom' : undefined), modal: (true), dismissableMask: (true), closable: (false), showHeader: (false) }), { class: ([
        '!bg-transparent !border-none !shadow-none',
        __VLS_ctx.isMobile ? '!h-auto' : 'w-[95%] max-w-[400px]'
    ]) }), { pt: (__VLS_ctx.isMobile ? __VLS_ctx.bottomSheetPt : __VLS_ctx.modalPt) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onUpdate:visible': {} }, { visible: (__VLS_ctx.show), position: (__VLS_ctx.isMobile ? 'bottom' : undefined), modal: (true), dismissableMask: (true), closable: (false), showHeader: (false) }), { class: ([
            '!bg-transparent !border-none !shadow-none',
            __VLS_ctx.isMobile ? '!h-auto' : 'w-[95%] max-w-[400px]'
        ]) }), { pt: (__VLS_ctx.isMobile ? __VLS_ctx.bottomSheetPt : __VLS_ctx.modalPt) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5;
var __VLS_6 = ({ 'update:visible': {} },
    { 'onUpdate:visible': function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.$emit('cancel');
            // @ts-ignore
            [isMobile, isMobile, isMobile, isMobile, drawer_1.default, dialog_1.default, show, bottomSheetPt, modalPt, $emit,];
        } });
var __VLS_7 = {};
/** @type {__VLS_StyleScopedClasses['!bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['!border-none']} */ ;
/** @type {__VLS_StyleScopedClasses['!shadow-none']} */ ;
var __VLS_8 = __VLS_3.slots.default;
if (!__VLS_ctx.isMobile) {
    var __VLS_9 = BaseCard_vue_1.default || BaseCard_vue_1.default;
    // @ts-ignore
    var __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9(__assign({ class: "w-full shadow-[0_30px_70px_rgba(0,0,0,0.6)] border border-white/5 !bg-surface-main overflow-hidden flex flex-col relative" }, { padding: "none" })));
    var __VLS_11 = __VLS_10.apply(void 0, __spreadArray([__assign({ class: "w-full shadow-[0_30px_70px_rgba(0,0,0,0.6)] border border-white/5 !bg-surface-main overflow-hidden flex flex-col relative" }, { padding: "none" })], __VLS_functionalComponentArgsRest(__VLS_10), false));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-[0_30px_70px_rgba(0,0,0,0.6)]']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['!bg-surface-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    var __VLS_14 = __VLS_12.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "p-8 text-center flex flex-col items-center" }));
    /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-16 h-16 rounded-full bg-error-main/10 flex items-center justify-center text-error-main mb-6 border border-error-main/20 shadow-inner" }));
    /** @type {__VLS_StyleScopedClasses['w-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-error-main/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-error-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-error-main/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-inner']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "32",
        height: "32",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2.5",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path, __VLS_intrinsics.path)({
        d: "M3 6h18",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path, __VLS_intrinsics.path)({
        d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path, __VLS_intrinsics.path)({
        d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line, __VLS_intrinsics.line)({
        x1: "10",
        y1: "11",
        x2: "10",
        y2: "17",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line, __VLS_intrinsics.line)({
        x1: "14",
        y1: "11",
        x2: "14",
        y2: "17",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "text-xl font-black text-text-primary tracking-tight mb-2" }));
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
    (__VLS_ctx.title || 'Tem certeza?');
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-sm font-medium text-text-secondary leading-relaxed opacity-70" }));
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-70']} */ ;
    (__VLS_ctx.message ||
        'Esta ação não poderá ser desfeita e os dados serão removidos permanentemente.');
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex border-t border-white/5" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/5']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(!__VLS_ctx.isMobile))
                return;
            __VLS_ctx.$emit('cancel');
            // @ts-ignore
            [isMobile, $emit, title, message,];
        } }, { type: "button" }), { class: "flex-1 py-5 font-black uppercase text-[0.7rem] tracking-widest text-text-secondary hover:bg-white/5 transition-all border-r border-white/5" }));
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-[0.7rem]']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/5']} */ ;
    (__VLS_ctx.cancelText || 'Cancelar');
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(!__VLS_ctx.isMobile))
                return;
            __VLS_ctx.$emit('confirm');
            // @ts-ignore
            [$emit, cancelText,];
        } }, { type: "button" }), { class: "flex-1 py-5 font-black uppercase text-[0.7rem] tracking-[0.15em] text-error-main hover:bg-error-main/10 transition-all flex items-center justify-center gap-2 group" }));
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-[0.7rem]']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-[0.15em]']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-error-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-error-main/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['group']} */ ;
    (__VLS_ctx.confirmText || 'Excluir');
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "3", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, { class: "group-hover:translate-x-0.5 transition-transform" }));
    /** @type {__VLS_StyleScopedClasses['group-hover:translate-x-0.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.polyline, __VLS_intrinsics.polyline)({
        points: "9 18 15 12 9 6",
    });
    // @ts-ignore
    [confirmText,];
    var __VLS_12;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "bg-surface-main dark:bg-surface-main rounded-t-[2rem] p-8 text-center flex flex-col items-center shadow-[0_-10px_40px_rgba(0,0,0,0.4)]" }));
    /** @type {__VLS_StyleScopedClasses['bg-surface-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-surface-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-t-[2rem]']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-[0_-10px_40px_rgba(0,0,0,0.4)]']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-12 h-1.5 bg-white/10 rounded-full mb-8 shrink-0" }));
    /** @type {__VLS_StyleScopedClasses['w-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-1.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-16 h-16 rounded-full bg-error-main/10 flex items-center justify-center text-error-main mb-6 border border-error-main/20 shadow-inner" }));
    /** @type {__VLS_StyleScopedClasses['w-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-error-main/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-error-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-error-main/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-inner']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "32",
        height: "32",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2.5",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path, __VLS_intrinsics.path)({
        d: "M3 6h18",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path, __VLS_intrinsics.path)({
        d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path, __VLS_intrinsics.path)({
        d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line, __VLS_intrinsics.line)({
        x1: "10",
        y1: "11",
        x2: "10",
        y2: "17",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line, __VLS_intrinsics.line)({
        x1: "14",
        y1: "11",
        x2: "14",
        y2: "17",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "text-xl font-black text-text-primary tracking-tight mb-2" }));
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
    (__VLS_ctx.title || 'Tem certeza?');
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-sm font-medium text-text-secondary leading-relaxed opacity-70 mb-8" }));
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-70']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    (__VLS_ctx.message ||
        'Esta ação não poderá ser desfeita e os dados serão removidos permanentemente.');
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-full space-y-3 pb-safe" }));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['pb-safe']} */ ;
    var __VLS_15 = BaseButton_vue_1.default || BaseButton_vue_1.default;
    // @ts-ignore
    var __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15(__assign(__assign({ 'onClick': {} }, { variant: "danger" }), { class: "w-full !py-4 font-black uppercase text-[0.7rem] tracking-[0.15em]" })));
    var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { variant: "danger" }), { class: "w-full !py-4 font-black uppercase text-[0.7rem] tracking-[0.15em]" })], __VLS_functionalComponentArgsRest(__VLS_16), false));
    var __VLS_20 = void 0;
    var __VLS_21 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(!__VLS_ctx.isMobile))
                    return;
                __VLS_ctx.$emit('confirm');
                // @ts-ignore
                [$emit, title, message,];
            } });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['!py-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-[0.7rem]']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-[0.15em]']} */ ;
    var __VLS_22 = __VLS_18.slots.default;
    (__VLS_ctx.confirmText || 'Excluir');
    // @ts-ignore
    [confirmText,];
    var __VLS_18;
    var __VLS_19;
    var __VLS_23 = BaseButton_vue_1.default || BaseButton_vue_1.default;
    // @ts-ignore
    var __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23(__assign(__assign({ 'onClick': {} }, { variant: "ghost" }), { class: "w-full !py-4 font-black uppercase text-[0.7rem] tracking-widest opacity-40 hover:opacity-100" })));
    var __VLS_25 = __VLS_24.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { variant: "ghost" }), { class: "w-full !py-4 font-black uppercase text-[0.7rem] tracking-widest opacity-40 hover:opacity-100" })], __VLS_functionalComponentArgsRest(__VLS_24), false));
    var __VLS_28 = void 0;
    var __VLS_29 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(!__VLS_ctx.isMobile))
                    return;
                __VLS_ctx.$emit('cancel');
                // @ts-ignore
                [$emit,];
            } });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['!py-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-[0.7rem]']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-40']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:opacity-100']} */ ;
    var __VLS_30 = __VLS_26.slots.default;
    (__VLS_ctx.cancelText || 'Cancelar');
    // @ts-ignore
    [cancelText,];
    var __VLS_26;
    var __VLS_27;
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    emits: {},
    __typeProps: {},
});
exports.default = {};
