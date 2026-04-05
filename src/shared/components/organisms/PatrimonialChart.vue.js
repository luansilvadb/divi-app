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
var chart_1 = require("primevue/chart");
var theme_1 = require("@/core/theme");
var props = defineProps();
var isDark = (0, theme_1.useTheme)().isDark;
// Memoized formatters for better performance
var currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});
var thousandsFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    compactDisplay: 'short',
});
// Cache gradient to avoid recreation on every render
var gradientCache = (0, vue_1.ref)(null);
var getGradient = function (context) {
    var chart = context.chart;
    var ctx = chart.ctx, chartArea = chart.chartArea;
    if (!chartArea)
        return undefined;
    // Return cached gradient if theme hasn't changed
    if (gradientCache.value && gradientCache.value.dark === isDark.value) {
        return gradientCache.value.gradient;
    }
    var stopColorStart = isDark.value ? 'rgba(74, 111, 165, 0.4)' : 'rgba(61, 91, 135, 0.4)';
    var stopColorEnd = isDark.value ? 'rgba(74, 111, 165, 0)' : 'rgba(61, 91, 135, 0)';
    var gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, stopColorStart);
    gradient.addColorStop(1, stopColorEnd);
    // Update cache
    gradientCache.value = { dark: isDark.value, gradient: gradient };
    return gradient;
};
var chartData = (0, vue_1.computed)(function () {
    var primaryColor = isDark.value ? '#4a6fa5' : '#3d5b87';
    return {
        labels: props.labels,
        datasets: [
            {
                label: 'Patrimônio',
                data: props.data,
                borderColor: primaryColor,
                borderWidth: 3,
                pointBackgroundColor: primaryColor,
                pointBorderColor: isDark.value ? '#0e1219' : '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                backgroundColor: getGradient,
                tension: 0.4,
            },
        ],
    };
});
var chartOptions = (0, vue_1.computed)(function () {
    var textColor = isDark.value ? '#94a3b8' : '#475569';
    var gridColor = isDark.value ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    var tooltipBg = isDark.value ? '#0e1219' : '#ffffff';
    var tooltipText = isDark.value ? '#f0f6fc' : '#1a2333';
    var tooltipBorder = isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: tooltipBg,
                titleColor: tooltipText,
                titleFont: { size: 13, weight: 'bold' },
                bodyColor: textColor,
                bodyFont: { size: 12 },
                borderColor: tooltipBorder,
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                cornerRadius: 12,
                callbacks: {
                    label: function (context) {
                        return currencyFormatter.format(context.parsed.y || 0);
                    },
                },
            },
        },
        scales: {
            y: {
                grid: {
                    color: gridColor,
                },
                border: { display: false },
                ticks: {
                    color: textColor,
                    font: { size: 10, weight: 'bold' },
                    padding: 10,
                    callback: function (value) {
                        var numValue = Number(value);
                        if (numValue >= 1000) {
                            return thousandsFormatter.format(numValue);
                        }
                        return currencyFormatter.format(numValue);
                    },
                },
            },
            x: {
                grid: {
                    display: false,
                },
                border: { display: false },
                ticks: {
                    color: textColor,
                    font: { size: 10, weight: 'bold' },
                    padding: 5,
                },
            },
        },
    };
});
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "patrimonial-chart" }));
/** @type {__VLS_StyleScopedClasses['patrimonial-chart']} */ ;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Chart} */
chart_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ type: "line", data: (__VLS_ctx.chartData), options: (__VLS_ctx.chartOptions) }, { class: "h-full w-full" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ type: "line", data: (__VLS_ctx.chartData), options: (__VLS_ctx.chartOptions) }, { class: "h-full w-full" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
// @ts-ignore
[chartData, chartOptions,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
