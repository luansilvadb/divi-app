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
var theme_1 = require("../../../core/theme");
var sidebarStore_1 = require("../../stores/sidebarStore");
var navigation_1 = require("../../config/navigation");
var menu_1 = require("primevue/menu");
var badge_1 = require("primevue/badge");
var ThemeToggle_vue_1 = require("../molecules/ThemeToggle.vue");
var emit = defineEmits(['logout']);
var sidebarStore = (0, sidebarStore_1.useSidebarStore)();
(0, theme_1.useTheme)();
var isCollapsed = (0, vue_1.computed)({
    get: function () { return !sidebarStore.isExpanded; },
    set: function (val) { return sidebarStore.setExpanded(!val); },
});
var menuItems = (0, vue_1.computed)(function () {
    return (0, navigation_1.createMainNavigation)({ onLogout: function () { return emit('logout'); } });
});
var lgQuery = window.matchMedia('(max-width: 1024px)');
function handleBreakpointChange(e) {
    if (e.matches) {
        sidebarStore.setExpanded(false);
    }
    else {
        sidebarStore.setExpanded(true);
    }
}
(0, vue_1.onMounted)(function () {
    sidebarStore.initPerformanceDetection();
    handleBreakpointChange(lgQuery);
    lgQuery.addEventListener('change', handleBreakpointChange);
});
(0, vue_1.onBeforeUnmount)(function () {
    lgQuery.removeEventListener('change', handleBreakpointChange);
});
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar--collapsed']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-header']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar--collapsed']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-brand']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)(__assign({ class: "sidebar !hidden md:!flex transition-all duration-300 ease-in-out" }, { class: ({
        'sidebar--collapsed': __VLS_ctx.isCollapsed,
        'low-power-mode': __VLS_ctx.sidebarStore.isLowPowerMode,
    }) }));
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['!hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:!flex']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-in-out']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar--collapsed']} */ ;
/** @type {__VLS_StyleScopedClasses['low-power-mode']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "sidebar-noise" }, { 'aria-hidden': "true" }));
/** @type {__VLS_StyleScopedClasses['sidebar-noise']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "sidebar-header" }));
/** @type {__VLS_StyleScopedClasses['sidebar-header']} */ ;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
RouterLink;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ to: "/" }, { class: "sidebar-brand" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ to: "/" }, { class: "sidebar-brand" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
/** @type {__VLS_StyleScopedClasses['sidebar-brand']} */ ;
var __VLS_5 = __VLS_3.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "sidebar-logo-icon" }));
/** @type {__VLS_StyleScopedClasses['sidebar-logo-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    width: "34",
    height: "34",
    viewBox: "0 0 44 44",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.rect)({
    width: "44",
    height: "44",
    rx: "11",
    fill: "url(#sidebarLogoGrad)",
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
    id: "sidebarLogoGrad",
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
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "sidebar-brand-text" }));
/** @type {__VLS_StyleScopedClasses['sidebar-brand-text']} */ ;
// @ts-ignore
[isCollapsed, sidebarStore,];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.isCollapsed = !__VLS_ctx.isCollapsed;
        // @ts-ignore
        [isCollapsed, isCollapsed,];
    } }, { class: "sidebar-master-toggle" }), { 'aria-label': (__VLS_ctx.isCollapsed ? 'Expandir menu' : 'Recolher menu') }));
/** @type {__VLS_StyleScopedClasses['sidebar-master-toggle']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: "pi pi-bars" }));
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-bars']} */ ;
var __VLS_6;
/** @ts-ignore @type {typeof __VLS_components.Menu | typeof __VLS_components.Menu} */
menu_1.default;
// @ts-ignore
var __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6(__assign({ model: (__VLS_ctx.menuItems) }, { class: "border-none bg-transparent w-full" })));
var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ model: (__VLS_ctx.menuItems) }, { class: "border-none bg-transparent w-full" })], __VLS_functionalComponentArgsRest(__VLS_7), false));
/** @type {__VLS_StyleScopedClasses['border-none']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_11 = __VLS_9.slots.default;
{
    var __VLS_12 = __VLS_9.slots.item;
    var _a = __VLS_vSlot(__VLS_12)[0], item = _a.item, props = _a.props;
    if (item.separator) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "my-2 mx-4 border-t border-black/5 dark:border-white/5" }, { class: ({ 'hidden': __VLS_ctx.isCollapsed }) }));
        /** @type {__VLS_StyleScopedClasses['my-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['mx-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
    }
    else if (item.route) {
        var __VLS_13 = void 0;
        /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
        RouterLink;
        // @ts-ignore
        var __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
            to: (item.route),
            custom: true,
        }));
        var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([{
                to: (item.route),
                custom: true,
            }], __VLS_functionalComponentArgsRest(__VLS_14), false));
        {
            var __VLS_18 = __VLS_16.slots.default;
            var _b = __VLS_vSlot(__VLS_18)[0], href = _b.href, navigate = _b.navigate, isActive = _b.isActive;
            __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)(__assign(__assign(__assign({ onClick: (navigate) }, { href: (href) }), (props.action)), { class: ([
                    'flex items-center px-4 py-3 cursor-pointer rounded-xl transition-colors mx-2',
                    isActive ? 'bg-primary-main/10 text-primary-main font-bold' : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
                ]) }));
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
            /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
            /** @type {__VLS_StyleScopedClasses['mx-2']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: (item.icon) }, { class: "text-xl" }));
            __VLS_asFunctionalDirective(__VLS_directives.vTooltip, {})(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { modifiers: { right: true, }, value: (__VLS_ctx.isCollapsed ? item.label : undefined) }), null, null);
            /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ml-3 truncate transition-opacity duration-300" }, { class: ({ 'opacity-0 w-0 hidden': __VLS_ctx.isCollapsed }) }));
            /** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
            /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
            /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
            /** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
            /** @type {__VLS_StyleScopedClasses['w-0']} */ ;
            /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
            (item.label);
            if (item.badge) {
                var __VLS_19 = void 0;
                /** @ts-ignore @type {typeof __VLS_components.Badge} */
                badge_1.default;
                // @ts-ignore
                var __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19(__assign({ class: "ml-auto" }, { value: (item.badge) })));
                var __VLS_21 = __VLS_20.apply(void 0, __spreadArray([__assign({ class: "ml-auto" }, { value: (item.badge) })], __VLS_functionalComponentArgsRest(__VLS_20), false));
                /** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
            }
            // @ts-ignore
            [isCollapsed, isCollapsed, isCollapsed, isCollapsed, menuItems, vTooltip,];
            __VLS_16.slots['' /* empty slot name completion */];
        }
        var __VLS_16;
    }
    else if (item.action) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)(__assign(__assign({ onClick: (item.action) }, (props.action)), { class: ([
                'flex items-center px-4 py-3 cursor-pointer rounded-xl transition-colors mx-2',
                item.class || 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
            ]) }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
        /** @type {__VLS_StyleScopedClasses['mx-2']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: (item.icon) }, { class: "text-xl" }));
        __VLS_asFunctionalDirective(__VLS_directives.vTooltip, {})(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { modifiers: { right: true, }, value: (__VLS_ctx.isCollapsed ? item.label : undefined) }), null, null);
        /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ml-3 truncate transition-opacity duration-300" }, { class: ({ 'opacity-0 w-0 hidden': __VLS_ctx.isCollapsed }) }));
        /** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
        /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
        /** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
        (item.label);
    }
    else if (item.component) {
        var __VLS_24 = (item.component);
        // @ts-ignore
        var __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24(__assign({}, (item.props))));
        var __VLS_26 = __VLS_25.apply(void 0, __spreadArray([__assign({}, (item.props))], __VLS_functionalComponentArgsRest(__VLS_25), false));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)(__assign({ class: ([
                'flex items-center px-4 py-3 cursor-pointer rounded-xl transition-colors mx-2 text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
            ]) }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
        /** @type {__VLS_StyleScopedClasses['mx-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:bg-black/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['dark:hover:bg-white/5']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: (item.icon) }, { class: "text-xl" }));
        __VLS_asFunctionalDirective(__VLS_directives.vTooltip, {})(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { modifiers: { right: true, }, value: (__VLS_ctx.isCollapsed ? item.label : undefined) }), null, null);
        /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ml-3 truncate transition-opacity duration-300" }, { class: ({ 'opacity-0 w-0 hidden': __VLS_ctx.isCollapsed }) }));
        /** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
        /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
        /** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
        (item.label);
    }
    // @ts-ignore
    [isCollapsed, isCollapsed, isCollapsed, isCollapsed, vTooltip, vTooltip,];
}
{
    var __VLS_29 = __VLS_9.slots.submenuheader;
    var item = __VLS_vSlot(__VLS_29)[0].item;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "px-6 py-2 text-xs font-bold uppercase tracking-wider text-text-disabled mt-2" }, { class: ({ 'opacity-0 h-0 p-0 hidden': __VLS_ctx.isCollapsed }) }));
    /** @type {__VLS_StyleScopedClasses['px-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
    (item.label);
    // @ts-ignore
    [isCollapsed,];
}
// @ts-ignore
[];
var __VLS_9;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "mt-auto p-4 flex justify-center mb-4" }));
/** @type {__VLS_StyleScopedClasses['mt-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
var __VLS_30 = ThemeToggle_vue_1.default;
// @ts-ignore
var __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({}));
var __VLS_32 = __VLS_31.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_31), false));
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    emits: {},
});
exports.default = {};
