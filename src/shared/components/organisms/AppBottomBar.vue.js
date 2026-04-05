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
var dock_1 = require("primevue/dock");
var navigation_1 = require("../../config/navigation");
var emit = defineEmits();
var items = (0, vue_1.computed)(function () {
    return (0, navigation_1.createMobileBottomNav)({ onOpenDrawer: function () { return emit('open-drawer'); } });
});
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-main border-t border-black/5 dark:border-white/5 pb-safe" }));
/** @type {__VLS_StyleScopedClasses['md:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-bg-main']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-safe']} */ ;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Dock | typeof __VLS_components.Dock} */
dock_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    model: (__VLS_ctx.items),
    position: "bottom",
    pt: ({
        root: { class: 'w-full justify-around h-[4.5rem] bg-transparent !border-none' },
        container: { class: 'w-full justify-around' },
        item: { class: 'w-full h-full flex justify-center items-center' },
        itemLink: { class: 'flex flex-col items-center justify-center w-full h-full text-text-disabled transition-colors duration-200' }
    }),
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        model: (__VLS_ctx.items),
        position: "bottom",
        pt: ({
            root: { class: 'w-full justify-around h-[4.5rem] bg-transparent !border-none' },
            container: { class: 'w-full justify-around' },
            item: { class: 'w-full h-full flex justify-center items-center' },
            itemLink: { class: 'flex flex-col items-center justify-center w-full h-full text-text-disabled transition-colors duration-200' }
        }),
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = __VLS_3.slots.default;
{
    var __VLS_6 = __VLS_3.slots.item;
    var _a = __VLS_vSlot(__VLS_6)[0], item = _a.item, props = _a.props;
    if (item.route) {
        var __VLS_7 = void 0;
        /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
        vue_router_1.RouterLink;
        // @ts-ignore
        var __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
            to: (item.route),
            custom: true,
        }));
        var __VLS_9 = __VLS_8.apply(void 0, __spreadArray([{
                to: (item.route),
                custom: true,
            }], __VLS_functionalComponentArgsRest(__VLS_8), false));
        {
            var __VLS_12 = __VLS_10.slots.default;
            var _b = __VLS_vSlot(__VLS_12)[0], href = _b.href, navigate = _b.navigate, isActive = _b.isActive;
            __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)(__assign(__assign(__assign({ onClick: (navigate) }, { href: (href) }), (props.action)), { class: ([
                    'flex flex-col items-center justify-center w-full h-full transition-colors duration-200 cursor-pointer',
                    isActive ? 'text-primary-main' : 'text-text-disabled'
                ]) }));
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
            /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: (item.icon) }, { class: "text-xl mb-1" }));
            /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-[10px] font-bold tracking-wider uppercase" }));
            /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
            /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
            /** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
            /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
            (item.label);
            // @ts-ignore
            [items,];
            __VLS_10.slots['' /* empty slot name completion */];
        }
        var __VLS_10;
    }
    else if (item.action) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)(__assign(__assign({ onClick: (item.action) }, (props.action)), { class: "flex flex-col items-center justify-center w-full h-full text-text-disabled transition-colors duration-200 cursor-pointer" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
        /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: (item.icon) }, { class: "text-xl mb-1" }));
        /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-[10px] font-bold tracking-wider uppercase" }));
        /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
        (item.label);
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeEmits: {},
});
exports.default = {};
