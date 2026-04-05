"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThemeStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
exports.useThemeStore = (0, pinia_1.defineStore)('theme', function () {
    var themeState = (0, vue_1.ref)(localStorage.getItem('divi-ui-theme') || 'system');
    var applyTheme = function () {
        var root = document.documentElement;
        var isDarkValue = themeState.value === 'system'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
            : themeState.value === 'dark';
        requestAnimationFrame(function () {
            if (isDarkValue) {
                root.classList.add('dark');
            }
            else {
                root.classList.remove('dark');
            }
        });
    };
    var isInitialized = false;
    var initThemeObservers = function () {
        if (isInitialized)
            return;
        isInitialized = true;
        applyTheme();
        (0, vue_1.watch)(themeState, applyTheme);
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
            if (themeState.value === 'system') {
                applyTheme();
            }
        });
    };
    var setTheme = function (newTheme) {
        if (themeState.value === newTheme)
            return;
        themeState.value = newTheme;
        localStorage.setItem('divi-ui-theme', newTheme);
    };
    var isDark = (0, vue_1.computed)(function () {
        if (themeState.value === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return themeState.value === 'dark';
    });
    var toggle = function () {
        setTheme(isDark.value ? 'light' : 'dark');
    };
    return {
        theme: themeState,
        isDark: isDark,
        setTheme: setTheme,
        toggle: toggle,
        initThemeObservers: initThemeObservers
    };
});
