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
var vue_router_1 = require("vue-router");
var drawer_1 = require("primevue/drawer");
var menu_1 = require("primevue/menu");
var ThemeToggle_vue_1 = require("../molecules/ThemeToggle.vue");
var navigation_1 = require("../../config/navigation");
var __VLS_props = defineProps();
var emit = defineEmits();
function handleLogout() {
    emit('close');
    emit('logout');
}
var menuItems = (0, vue_1.computed)(function () {
    return (0, navigation_1.createMainNavigation)({ onLogout: handleLogout }).slice(0, 2);
} // Only main groups, no logout section
);
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Drawer | typeof __VLS_components.Drawer} */
drawer_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign(__assign(__assign({ 'onUpdate:visible': {} }, { visible: (__VLS_ctx.isOpen), position: "right" }), { class: "!bg-bg-main !w-[280px] shadow-2xl !border-none" }), { pt: ({
        mask: { class: 'backdrop-blur-sm bg-black/40 z-[90]' },
        root: { class: 'flex flex-col overflow-hidden z-[100]' },
        header: { class: 'p-0 border-none hidden' },
        content: { class: 'p-0 flex-1 overflow-y-auto flex flex-col' }
    }) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onUpdate:visible': {} }, { visible: (__VLS_ctx.isOpen), position: "right" }), { class: "!bg-bg-main !w-[280px] shadow-2xl !border-none" }), { pt: ({
            mask: { class: 'backdrop-blur-sm bg-black/40 z-[90]' },
            root: { class: 'flex flex-col overflow-hidden z-[100]' },
            header: { class: 'p-0 border-none hidden' },
            content: { class: 'p-0 flex-1 overflow-y-auto flex flex-col' }
        }) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5;
var __VLS_6 = ({ 'update:visible': {} },
    { 'onUpdate:visible': function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.$emit('close');
            // @ts-ignore
            [isOpen, $emit,];
        } });
var __VLS_7 = {};
/** @type {__VLS_StyleScopedClasses['!bg-bg-main']} */ ;
/** @type {__VLS_StyleScopedClasses['!w-[280px]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['!border-none']} */ ;
var __VLS_8 = __VLS_3.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 shrink-0" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "font-bold text-lg text-text-primary" }));
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$emit('close');
        // @ts-ignore
        [$emit,];
    } }, { class: "p-2 -mr-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors" }), { 'aria-label': "Fechar menu" }));
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['-mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: "pi pi-times" }));
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-times']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.nav, __VLS_intrinsics.nav)(__assign({ class: "flex-1 p-4 overflow-y-auto" }));
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
var __VLS_9;
/** @ts-ignore @type {typeof __VLS_components.Menu | typeof __VLS_components.Menu} */
menu_1.default;
// @ts-ignore
var __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9(__assign({ model: (__VLS_ctx.menuItems) }, { class: "border-none bg-transparent w-full" })));
var __VLS_11 = __VLS_10.apply(void 0, __spreadArray([__assign({ model: (__VLS_ctx.menuItems) }, { class: "border-none bg-transparent w-full" })], __VLS_functionalComponentArgsRest(__VLS_10), false));
/** @type {__VLS_StyleScopedClasses['border-none']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_14 = __VLS_12.slots.default;
{
    var __VLS_15 = __VLS_12.slots.item;
    var _a = __VLS_vSlot(__VLS_15)[0], item = _a.item, props = _a.props;
    if (item.route) {
        var __VLS_16 = void 0;
        /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
        vue_router_1.RouterLink;
        // @ts-ignore
        var __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
            to: (item.route),
            custom: true,
        }));
        var __VLS_18 = __VLS_17.apply(void 0, __spreadArray([{
                to: (item.route),
                custom: true,
            }], __VLS_functionalComponentArgsRest(__VLS_17), false));
        {
            var __VLS_21 = __VLS_19.slots.default;
            var _b = __VLS_vSlot(__VLS_21)[0], href = _b.href, navigate_1 = _b.navigate, isActive = _b.isActive;
            __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)(__assign(__assign(__assign({ onClick: (function (e) { navigate_1(e); __VLS_ctx.$emit('close'); }) }, { href: (href) }), (props.action)), { class: ([
                    'flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer mx-1 mb-1 group',
                    isActive ? 'bg-primary-main/10 text-primary-main font-bold' : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
                ]) }));
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['py-3.5']} */ ;
            /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
            /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
            /** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
            /** @type {__VLS_StyleScopedClasses['group']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: ([item.icon, isActive ? 'scale-110' : 'group-hover:scale-110']) }, { class: "text-xl transition-transform duration-300" }));
            /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
            /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "font-medium text-base" }));
            /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
            (item.label);
            if (item.badge) {
                var __VLS_22 = void 0;
                /** @ts-ignore @type {typeof __VLS_components.Badge} */
                Badge;
                // @ts-ignore
                var __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22(__assign({ class: "ml-auto" }, { value: (item.badge) })));
                var __VLS_24 = __VLS_23.apply(void 0, __spreadArray([__assign({ class: "ml-auto" }, { value: (item.badge) })], __VLS_functionalComponentArgsRest(__VLS_23), false));
                /** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
            }
            // @ts-ignore
            [$emit, menuItems,];
            __VLS_19.slots['' /* empty slot name completion */];
        }
        var __VLS_19;
    }
    // @ts-ignore
    [];
}
{
    var __VLS_27 = __VLS_12.slots.submenuheader;
    var item = __VLS_vSlot(__VLS_27)[0].item;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "block text-[10px] font-black uppercase tracking-[0.2em] text-text-disabled mb-2 mt-4 ml-4" }));
    /** @type {__VLS_StyleScopedClasses['block']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-[0.2em]']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    (item.label);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_12;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "p-4 border-t border-black/5 dark:border-white/5 flex flex-col gap-4 pb-safe mt-auto" }));
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-safe']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-auto']} */ ;
if (__VLS_ctx.user) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "user-profile p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center gap-3" }));
    /** @type {__VLS_StyleScopedClasses['user-profile']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "user-avatar min-w-[40px] h-[40px] rounded-full overflow-hidden flex-shrink-0 border-2 border-primary-main/20" }));
    /** @type {__VLS_StyleScopedClasses['user-avatar']} */ ;
    /** @type {__VLS_StyleScopedClasses['min-w-[40px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-[40px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-primary-main/20']} */ ;
    if (__VLS_ctx.user.avatar_url) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)(__assign({ src: (__VLS_ctx.user.avatar_url), alt: (__VLS_ctx.user.name || __VLS_ctx.user.email) }, { class: "w-full h-full object-cover" }));
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-full h-full bg-primary-main text-white flex items-center justify-center font-bold text-lg uppercase" }));
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-primary-main']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
        ((__VLS_ctx.user.name || __VLS_ctx.user.email).charAt(0));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "user-info flex flex-col overflow-hidden" }));
    /** @type {__VLS_StyleScopedClasses['user-info']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-sm font-bold truncate" }));
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
    (__VLS_ctx.user.name || 'Usuário');
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-xs text-text-secondary truncate" }));
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
    (__VLS_ctx.user.email);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center justify-between" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
var __VLS_28 = ThemeToggle_vue_1.default;
// @ts-ignore
var __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({}));
var __VLS_30 = __VLS_29.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_29), false));
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.handleLogout) }, { class: "flex items-center gap-3 px-4 py-2 rounded-xl text-error-main font-bold hover:bg-error-main/10 transition-colors cursor-pointer border border-error-main/20" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error-main']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-error-main/10']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-error-main/20']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "pi pi-sign-out text-lg" }));
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-sign-out']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
// @ts-ignore
[user, user, user, user, user, user, user, user, user, handleLogout,];
var __VLS_3;
var __VLS_4;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
exports.default = {};
