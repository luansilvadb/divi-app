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
var TransactionFormContent_vue_1 = require("./TransactionFormContent.vue");
var usePrimeOverlay_1 = require("@/shared/composables/usePrimeOverlay");
var __VLS_props = defineProps();
var emit = defineEmits(['close', 'saved']);
var isMobile = (0, useIsMobile_1.useIsMobile)();
function handleClose(value) {
    if (!value) {
        emit('close');
    }
}
function handleSaved() {
    emit('saved');
    emit('close');
}
var _a = (0, usePrimeOverlay_1.useOverlayPt)(), modalPt = _a.modalPt, bottomSheetPt = _a.bottomSheetPt;
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
var __VLS_0 = (__VLS_ctx.isMobile ? __VLS_ctx.Drawer : __VLS_ctx.Dialog);
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign(__assign(__assign({ 'onUpdate:visible': {} }, { visible: (__VLS_ctx.show), position: (__VLS_ctx.isMobile ? 'bottom' : undefined), modal: (true), dismissableMask: (true), closable: (false), showHeader: (false) }), { class: ([
        '!bg-transparent !border-none !shadow-none w-full',
        __VLS_ctx.isMobile ? '!h-auto' : 'max-w-xl p-4 sm:p-6'
    ]) }), { pt: (__VLS_ctx.isMobile ? __VLS_ctx.bottomSheetPt : __VLS_ctx.modalPt) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onUpdate:visible': {} }, { visible: (__VLS_ctx.show), position: (__VLS_ctx.isMobile ? 'bottom' : undefined), modal: (true), dismissableMask: (true), closable: (false), showHeader: (false) }), { class: ([
            '!bg-transparent !border-none !shadow-none w-full',
            __VLS_ctx.isMobile ? '!h-auto' : 'max-w-xl p-4 sm:p-6'
        ]) }), { pt: (__VLS_ctx.isMobile ? __VLS_ctx.bottomSheetPt : __VLS_ctx.modalPt) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5;
var __VLS_6 = ({ 'update:visible': {} },
    { 'onUpdate:visible': (__VLS_ctx.handleClose) });
var __VLS_7 = {};
/** @type {__VLS_StyleScopedClasses['!bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['!border-none']} */ ;
/** @type {__VLS_StyleScopedClasses['!shadow-none']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "bg-primary-main/10 p-7 border-b border-white/5 relative" }));
    /** @type {__VLS_StyleScopedClasses['bg-primary-main/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-7']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "absolute inset-0 bg-gradient-to-br from-primary-main/10 via-transparent to-transparent pointer-events-none" }));
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
    /** @type {__VLS_StyleScopedClasses['from-primary-main/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['via-transparent']} */ ;
    /** @type {__VLS_StyleScopedClasses['to-transparent']} */ ;
    /** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center justify-between relative z-10" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    /** @type {__VLS_StyleScopedClasses['z-10']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-4" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-12 h-12 rounded-2xl bg-primary-main/20 flex items-center justify-center text-primary-main shadow-inner border border-primary-main/20" }));
    /** @type {__VLS_StyleScopedClasses['w-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-primary-main/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-primary-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-inner']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-primary-main/20']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: "pi pi-plus text-xl" }));
    /** @type {__VLS_StyleScopedClasses['pi']} */ ;
    /** @type {__VLS_StyleScopedClasses['pi-plus']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "text-2xl font-black text-text-primary tracking-tight leading-tight" }));
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
    /** @type {__VLS_StyleScopedClasses['leading-tight']} */ ;
    (__VLS_ctx.transaction ? 'Editar Transação' : 'Nova Transação');
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40" }));
    /** @type {__VLS_StyleScopedClasses['text-[0.65rem]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-[0.2em]']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-40']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(!__VLS_ctx.isMobile))
                return;
            __VLS_ctx.$emit('close');
            // @ts-ignore
            [isMobile, isMobile, isMobile, isMobile, isMobile, drawer_1.default, dialog_1.default, show, bottomSheetPt, modalPt, handleClose, transaction, $emit,];
        } }, { class: "w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all border border-white/5 group" }));
    /** @type {__VLS_StyleScopedClasses['w-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: "pi pi-times text-lg group-hover:rotate-90 transition-transform duration-300" }));
    /** @type {__VLS_StyleScopedClasses['pi']} */ ;
    /** @type {__VLS_StyleScopedClasses['pi-times']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['group-hover:rotate-90']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
    var __VLS_15 = TransactionFormContent_vue_1.default;
    // @ts-ignore
    var __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15(__assign(__assign({ 'onClose': {} }, { 'onSaved': {} }), { initialData: (__VLS_ctx.transaction) })));
    var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([__assign(__assign({ 'onClose': {} }, { 'onSaved': {} }), { initialData: (__VLS_ctx.transaction) })], __VLS_functionalComponentArgsRest(__VLS_16), false));
    var __VLS_20 = void 0;
    var __VLS_21 = ({ close: {} },
        { onClose: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(!__VLS_ctx.isMobile))
                    return;
                __VLS_ctx.$emit('close');
                // @ts-ignore
                [transaction, $emit,];
            } });
    var __VLS_22 = ({ saved: {} },
        { onSaved: (__VLS_ctx.handleSaved) });
    var __VLS_18;
    var __VLS_19;
    // @ts-ignore
    [handleSaved,];
    var __VLS_12;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "bg-primary-main/10 p-4 border-b border-black/5 dark:border-white/5 relative bg-surface-main dark:bg-surface-main text-text-primary rounded-t-[1.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.4)]" }));
    /** @type {__VLS_StyleScopedClasses['bg-primary-main/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-surface-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-surface-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-t-[1.5rem]']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-[0_-10px_40px_rgba(0,0,0,0.4)]']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "absolute inset-0 bg-gradient-to-br from-primary-main/10 via-transparent to-transparent pointer-events-none rounded-t-[1.5rem]" }));
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
    /** @type {__VLS_StyleScopedClasses['from-primary-main/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['via-transparent']} */ ;
    /** @type {__VLS_StyleScopedClasses['to-transparent']} */ ;
    /** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-t-[1.5rem]']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col items-center mb-4" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-12 h-1.5 bg-white/10 rounded-full mb-2 shrink-0" }));
    /** @type {__VLS_StyleScopedClasses['w-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-1.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center justify-between relative z-10" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    /** @type {__VLS_StyleScopedClasses['z-10']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-4" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-9 h-9 rounded-2xl bg-primary-main/20 flex items-center justify-center text-primary-main shadow-inner border border-primary-main/20" }));
    /** @type {__VLS_StyleScopedClasses['w-9']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-9']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-primary-main/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-primary-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-inner']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-primary-main/20']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: "pi pi-plus text-xl" }));
    /** @type {__VLS_StyleScopedClasses['pi']} */ ;
    /** @type {__VLS_StyleScopedClasses['pi-plus']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "text-xl font-black text-text-primary tracking-tight leading-tight" }));
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
    /** @type {__VLS_StyleScopedClasses['leading-tight']} */ ;
    (__VLS_ctx.transaction ? 'Editar Transação' : 'Nova Transação');
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!!(!__VLS_ctx.isMobile))
                return;
            __VLS_ctx.$emit('close');
            // @ts-ignore
            [transaction, $emit,];
        } }, { class: "w-8 h-8 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-black/10 dark:hover:bg-white/10 transition-all border border-black/5 dark:border-white/5 group" }));
    /** @type {__VLS_StyleScopedClasses['w-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-black/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:hover:bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: "pi pi-times text-lg group-hover:rotate-90 transition-transform duration-300" }));
    /** @type {__VLS_StyleScopedClasses['pi']} */ ;
    /** @type {__VLS_StyleScopedClasses['pi-times']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['group-hover:rotate-90']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "bg-surface-main dark:bg-surface-main text-text-primary h-full pb-safe" }));
    /** @type {__VLS_StyleScopedClasses['bg-surface-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-surface-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['pb-safe']} */ ;
    var __VLS_23 = TransactionFormContent_vue_1.default;
    // @ts-ignore
    var __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23(__assign(__assign({ 'onClose': {} }, { 'onSaved': {} }), { initialData: (__VLS_ctx.transaction) })));
    var __VLS_25 = __VLS_24.apply(void 0, __spreadArray([__assign(__assign({ 'onClose': {} }, { 'onSaved': {} }), { initialData: (__VLS_ctx.transaction) })], __VLS_functionalComponentArgsRest(__VLS_24), false));
    var __VLS_28 = void 0;
    var __VLS_29 = ({ close: {} },
        { onClose: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(!__VLS_ctx.isMobile))
                    return;
                __VLS_ctx.$emit('close');
                // @ts-ignore
                [transaction, $emit,];
            } });
    var __VLS_30 = ({ saved: {} },
        { onSaved: (__VLS_ctx.handleSaved) });
    var __VLS_26;
    var __VLS_27;
}
// @ts-ignore
[handleSaved,];
var __VLS_3;
var __VLS_4;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    emits: {},
    __typeProps: {},
});
exports.default = {};
