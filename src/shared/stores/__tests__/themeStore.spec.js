"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pinia_1 = require("pinia");
var vitest_1 = require("vitest");
var themeStore_1 = require("../themeStore");
(0, vitest_1.describe)('Theme Store', function () {
    (0, vitest_1.beforeEach)(function () {
        (0, pinia_1.setActivePinia)((0, pinia_1.createPinia)());
        localStorage.clear();
        vitest_1.vi.stubGlobal('requestAnimationFrame', function (cb) {
            cb(performance.now());
            return 0;
        });
        var isDarkMatches = false;
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vitest_1.vi.fn().mockImplementation(function (query) { return ({
                matches: query === '(prefers-color-scheme: dark)' ? isDarkMatches : false,
                media: query,
                onchange: null,
                addListener: vitest_1.vi.fn(),
                removeListener: vitest_1.vi.fn(),
                addEventListener: vitest_1.vi.fn(),
                removeEventListener: vitest_1.vi.fn(),
                dispatchEvent: vitest_1.vi.fn(),
            }); }),
        });
        // reset DOM state
        document.documentElement.classList.remove('dark');
    });
    (0, vitest_1.it)('initializes with system theme by default', function () {
        var store = (0, themeStore_1.useThemeStore)();
        (0, vitest_1.expect)(store.theme).toBe('system');
    });
    (0, vitest_1.it)('initializes from localStorage if available', function () {
        localStorage.setItem('divi-ui-theme', 'dark');
        var store = (0, themeStore_1.useThemeStore)();
        (0, vitest_1.expect)(store.theme).toBe('dark');
    });
    (0, vitest_1.it)('setTheme updates state and localStorage', function () {
        var store = (0, themeStore_1.useThemeStore)();
        store.setTheme('dark');
        (0, vitest_1.expect)(store.theme).toBe('dark');
        (0, vitest_1.expect)(localStorage.getItem('divi-ui-theme')).toBe('dark');
    });
    (0, vitest_1.it)('toggle switches between light and dark when currently system and system is light', function () {
        var store = (0, themeStore_1.useThemeStore)();
        (0, vitest_1.expect)(store.isDark).toBe(false);
        store.toggle();
        (0, vitest_1.expect)(store.theme).toBe('dark');
        (0, vitest_1.expect)(store.isDark).toBe(true);
    });
});
