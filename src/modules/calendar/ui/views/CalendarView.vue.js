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
var transactionStore_1 = require("@/modules/transactions/application/stores/transactionStore");
var formatters_1 = require("@/shared/utils/formatters");
var BaseCard_vue_1 = require("@/shared/components/atoms/BaseCard.vue");
var BaseIconBox_vue_1 = require("@/shared/components/atoms/BaseIconBox.vue");
var BaseSummaryItem_vue_1 = require("@/shared/components/molecules/BaseSummaryItem.vue");
var StandardPageLayout_vue_1 = require("@/shared/components/templates/StandardPageLayout.vue");
var store = (0, transactionStore_1.useTransactionStore)();
var currentDate = (0, vue_1.ref)(new Date());
var selectedDate = (0, vue_1.ref)(new Date());
var currentMonth = (0, vue_1.computed)(function () { return currentDate.value.getMonth(); });
var currentYear = (0, vue_1.computed)(function () { return currentDate.value.getFullYear(); });
var monthName = (0, vue_1.computed)(function () {
    return currentDate.value.toLocaleString('pt-BR', { month: 'long' });
});
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchMonthData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
var fetchMonthData = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, store.fetchTransactionsByMonth(currentYear.value, currentMonth.value + 1)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var prevMonth = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
                return [4 /*yield*/, fetchMonthData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var nextMonth = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
                return [4 /*yield*/, fetchMonthData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var selectDate = function (date) {
    selectedDate.value = date;
};
var calendarDays = (0, vue_1.computed)(function () {
    var firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1);
    var lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0);
    var days = [];
    var startPadding = firstDayOfMonth.getDay();
    for (var i = startPadding - 1; i >= 0; i--) {
        var d = new Date(currentYear.value, currentMonth.value, -i);
        days.push({ date: d, isCurrentMonth: false, dayNumber: d.getDate() });
    }
    for (var i = 1; i <= lastDayOfMonth.getDate(); i++) {
        var d = new Date(currentYear.value, currentMonth.value, i);
        days.push({ d: d, date: d, isCurrentMonth: true, dayNumber: i });
    }
    var endPadding = 42 - days.length;
    for (var i = 1; i <= endPadding; i++) {
        var d = new Date(currentYear.value, currentMonth.value + 1, i);
        days.push({ date: d, isCurrentMonth: false, dayNumber: d.getDate() });
    }
    return days;
});
var getTransactionsForDate = function (date) {
    return store.transactions.filter(function (t) {
        var tDate = new Date(t.date);
        return (tDate.getDate() === date.getDate() &&
            tDate.getMonth() === date.getMonth() &&
            tDate.getFullYear() === date.getFullYear());
    });
};
var selectedDateTransactions = (0, vue_1.computed)(function () { return getTransactionsForDate(selectedDate.value); });
var selectedDateIncome = (0, vue_1.computed)(function () {
    return selectedDateTransactions.value
        .filter(function (t) { return t.type === 'income'; })
        .reduce(function (sum, t) { return sum + t.amount; }, 0);
});
var selectedDateExpense = (0, vue_1.computed)(function () {
    return selectedDateTransactions.value
        .filter(function (t) { return t.type === 'expense'; })
        .reduce(function (sum, t) { return sum + t.amount; }, 0);
});
var selectedDateBalance = (0, vue_1.computed)(function () { return selectedDateIncome.value - selectedDateExpense.value; });
var isToday = function (date) {
    var today = new Date();
    return (date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear());
};
var isSelected = function (date) {
    return (date.getDate() === selectedDate.value.getDate() &&
        date.getMonth() === selectedDate.value.getMonth() &&
        date.getFullYear() === selectedDate.value.getFullYear());
};
var formatDateFull = function (date) {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
};
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
var __VLS_0 = StandardPageLayout_vue_1.default || StandardPageLayout_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: "Calendário Financeiro",
    highlight: "Calendário",
    subtitle: "Visualize seus compromissos e transações em uma linha do tempo mensal.",
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        title: "Calendário Financeiro",
        highlight: "Calendário",
        subtitle: "Visualize seus compromissos e transações em uma linha do tempo mensal.",
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = {};
var __VLS_6 = __VLS_3.slots.default;
{
    var __VLS_7 = __VLS_3.slots.action;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center bg-bg-main dark:bg-black/20 p-1.5 rounded-2xl border border-black/5 dark:border-white/5" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-bg-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-black/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-1.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-white/5']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.prevMonth) }, { class: "h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-white/10 text-text-secondary transition-all active:scale-95" }));
    /** @type {__VLS_StyleScopedClasses['h-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:hover:bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2.5",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.polyline, __VLS_intrinsics.polyline)({
        points: "15 18 9 12 15 6",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "px-6 flex flex-col items-center min-w-[140px]" }));
    /** @type {__VLS_StyleScopedClasses['px-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['min-w-[140px]']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-[10px] font-black uppercase tracking-widest text-text-disabled leading-none mb-1" }));
    /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
    /** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
    (__VLS_ctx.currentDate.getFullYear());
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-sm font-black text-text-primary tracking-tight leading-none uppercase" }));
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
    /** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    (__VLS_ctx.monthName);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.nextMonth) }, { class: "h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-white/10 text-text-secondary transition-all active:scale-95" }));
    /** @type {__VLS_StyleScopedClasses['h-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:hover:bg-white/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2.5",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.polyline, __VLS_intrinsics.polyline)({
        points: "9 18 15 12 9 6",
    });
    // @ts-ignore
    [prevMonth, currentDate, monthName, nextMonth,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "view-content-grid" }));
/** @type {__VLS_StyleScopedClasses['view-content-grid']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)(__assign({ class: "main-column" }));
/** @type {__VLS_StyleScopedClasses['main-column']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "glass-card p-6 shadow-sm overflow-hidden" }));
/** @type {__VLS_StyleScopedClasses['glass-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "grid grid-cols-7 mb-4" }));
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-7']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
for (var _i = 0, _a = __VLS_vFor((['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'])); _i < _a.length; _i++) {
    var day = _a[_i][0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (day) }, { class: "text-center text-[10px] font-black uppercase tracking-widest text-text-disabled py-2" }));
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    (day);
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "grid grid-cols-7 gap-3" }));
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-7']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
var _loop_1 = function (day) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            day.isCurrentMonth && __VLS_ctx.selectDate(day.date);
            // @ts-ignore
            [calendarDays, selectDate,];
        } }, { key: (day.date.toISOString()) }), { class: "relative aspect-square rounded-2xl p-2 border border-transparent transition-all duration-300 flex flex-col items-center cursor-pointer group" }), { class: ([
            day.isCurrentMonth
                ? 'bg-white/40 dark:bg-black/10 hover:bg-white dark:hover:bg-white/10 hover:border-black/5 dark:hover:border-white/10'
                : 'opacity-20 cursor-default',
            __VLS_ctx.isSelected(day.date)
                ? 'ring-2 ring-primary-main/40 border-primary-main/20 bg-white/80 dark:bg-white/5'
                : '',
        ]) }));
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    /** @type {__VLS_StyleScopedClasses['aspect-square']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-transparent']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
    /** @type {__VLS_StyleScopedClasses['group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-sm font-black w-8 h-8 flex items-center justify-center rounded-full transition-colors" }, { class: (__VLS_ctx.isToday(day.date)
            ? 'bg-primary-main text-white shadow-lg shadow-primary-main/20'
            : 'text-text-primary') }));
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    (day.dayNumber);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "mt-auto flex gap-1 flex-wrap justify-center max-w-full overflow-hidden pb-1" }));
    /** @type {__VLS_StyleScopedClasses['mt-auto']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['max-w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
    /** @type {__VLS_StyleScopedClasses['pb-1']} */ ;
    for (var _f = 0, _g = __VLS_vFor((__VLS_ctx.getTransactionsForDate(day.date).slice(0, 3))); _f < _g.length; _f++) {
        var _h = _g[_f], t = _h[0], i = _h[1];
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ key: (t.id || i) }, { class: "w-1.5 h-1.5 rounded-full shadow-sm" }), { class: (t.type === 'income' ? 'bg-success-main' : 'bg-error-main') }));
        /** @type {__VLS_StyleScopedClasses['w-1.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-1.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
        // @ts-ignore
        [isSelected, isToday, getTransactionsForDate,];
    }
    if (__VLS_ctx.getTransactionsForDate(day.date).length > 3) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-[8px] font-black text-text-disabled" }));
        /** @type {__VLS_StyleScopedClasses['text-[8px]']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
        (__VLS_ctx.getTransactionsForDate(day.date).length - 3);
    }
    // @ts-ignore
    [getTransactionsForDate, getTransactionsForDate,];
};
for (var _b = 0, _c = __VLS_vFor((__VLS_ctx.calendarDays)); _b < _c.length; _b++) {
    var day = _c[_b][0];
    _loop_1(day);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)(__assign({ class: "side-column" }));
/** @type {__VLS_StyleScopedClasses['side-column']} */ ;
var __VLS_8 = BaseCard_vue_1.default || BaseCard_vue_1.default;
// @ts-ignore
var __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({}));
var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_9), false));
var __VLS_13 = __VLS_11.slots.default;
{
    var __VLS_14 = __VLS_11.slots.header;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col gap-1" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-text-primary" }));
    /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-[10px] font-black uppercase tracking-widest text-text-disabled" }));
    /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
    (__VLS_ctx.formatDateFull(__VLS_ctx.selectedDate));
    // @ts-ignore
    [formatDateFull, selectedDate,];
}
if (__VLS_ctx.selectedDateTransactions.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col items-center justify-center py-16 opacity-40 text-center" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-40']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", width: "36", height: "36", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "1.5", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, { class: "mb-4" }));
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.rect)({
        width: "18",
        height: "18",
        x: "3",
        y: "4",
        rx: "2",
        ry: "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "16",
        x2: "16",
        y1: "2",
        y2: "6",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "8",
        x2: "8",
        y1: "2",
        y2: "6",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "3",
        x2: "21",
        y1: "10",
        y2: "10",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-[10px] font-black uppercase tracking-widest" }));
    /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)(__assign({ class: "list-none p-0 m-0 flex flex-col gap-2 pt-2" }));
    /** @type {__VLS_StyleScopedClasses['list-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['m-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
    for (var _d = 0, _e = __VLS_vFor((__VLS_ctx.selectedDateTransactions)); _d < _e.length; _d++) {
        var t = _e[_d][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)(__assign({ key: (t.id || t.localId) }, { class: "flex items-center gap-4 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:bg-black/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['dark:hover:bg-white/5']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
        var __VLS_15 = BaseIconBox_vue_1.default || BaseIconBox_vue_1.default;
        // @ts-ignore
        var __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
            color: (t.type === 'expense' ? 'var(--color-error-main)' : 'var(--color-success-main)'),
            size: "sm",
        }));
        var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([{
                color: (t.type === 'expense' ? 'var(--color-error-main)' : 'var(--color-success-main)'),
                size: "sm",
            }], __VLS_functionalComponentArgsRest(__VLS_16), false));
        var __VLS_20 = __VLS_18.slots.default;
        if (t.type === 'expense') {
            __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
                xmlns: "http://www.w3.org/2000/svg",
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                'stroke-width': "2.5",
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
                d: "M12 5v14M5 12l7 7 7-7",
            });
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
                xmlns: "http://www.w3.org/2000/svg",
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                'stroke-width': "2.5",
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
                d: "M12 19V5M5 12l7-7 7 7",
            });
        }
        // @ts-ignore
        [selectedDateTransactions, selectedDateTransactions,];
        var __VLS_18;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex-1 min-w-0" }));
        /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "font-bold text-sm text-text-primary truncate" }));
        /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-primary']} */ ;
        /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
        (t.title);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "text-[10px] font-black uppercase tracking-widest text-text-disabled" }));
        /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
        (t.category_id || 'Geral');
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "font-black text-sm tracking-tight" }, { class: (t.type === 'expense' ? 'text-error-main' : 'text-success-main') }));
        /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
        (t.type === 'expense' ? '-' : '+');
        (__VLS_ctx.formatCurrency(t.amount));
        // @ts-ignore
        [formatters_1.formatCurrency,];
    }
}
// @ts-ignore
[];
var __VLS_11;
if (__VLS_ctx.selectedDateTransactions.length > 0) {
    var __VLS_21 = BaseCard_vue_1.default || BaseCard_vue_1.default;
    // @ts-ignore
    var __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({}));
    var __VLS_23 = __VLS_22.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_22), false));
    var __VLS_26 = __VLS_24.slots.default;
    {
        var __VLS_27 = __VLS_24.slots.header;
        // @ts-ignore
        [selectedDateTransactions,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col gap-6 pt-2" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
    var __VLS_28 = BaseSummaryItem_vue_1.default;
    // @ts-ignore
    var __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
        label: "Entradas",
        value: (__VLS_ctx.formatCurrency(__VLS_ctx.selectedDateIncome)),
        color: "var(--color-success-main)",
        status: "success",
    }));
    var __VLS_30 = __VLS_29.apply(void 0, __spreadArray([{
            label: "Entradas",
            value: (__VLS_ctx.formatCurrency(__VLS_ctx.selectedDateIncome)),
            color: "var(--color-success-main)",
            status: "success",
        }], __VLS_functionalComponentArgsRest(__VLS_29), false));
    var __VLS_33 = BaseSummaryItem_vue_1.default;
    // @ts-ignore
    var __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
        label: "Saídas",
        value: (__VLS_ctx.formatCurrency(__VLS_ctx.selectedDateExpense)),
        color: "var(--color-error-main)",
        status: "error",
    }));
    var __VLS_35 = __VLS_34.apply(void 0, __spreadArray([{
            label: "Saídas",
            value: (__VLS_ctx.formatCurrency(__VLS_ctx.selectedDateExpense)),
            color: "var(--color-error-main)",
            status: "error",
        }], __VLS_functionalComponentArgsRest(__VLS_34), false));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "h-px bg-black/5 dark:bg-white/5" }));
    /** @type {__VLS_StyleScopedClasses['h-px']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-black/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-white/5']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-full p-4 rounded-2xl bg-bg-main dark:bg-black/20 flex flex-col items-center text-center" }));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-bg-main']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-black/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-[10px] font-black uppercase tracking-widest text-text-disabled mb-1" }));
    /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-text-disabled']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "text-2xl font-black tracking-tight" }, { class: (__VLS_ctx.selectedDateBalance >= 0 ? 'text-primary-main' : 'text-error-main') }));
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
    (__VLS_ctx.formatCurrency(__VLS_ctx.selectedDateBalance));
    // @ts-ignore
    [formatters_1.formatCurrency, formatters_1.formatCurrency, formatters_1.formatCurrency, selectedDateIncome, selectedDateExpense, selectedDateBalance, selectedDateBalance,];
    var __VLS_24;
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
