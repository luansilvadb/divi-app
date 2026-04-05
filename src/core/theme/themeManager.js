"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTheme = void 0;
var themeStore_1 = require("../../shared/stores/themeStore");
var pinia_1 = require("pinia");
var useTheme = function () {
    var store = (0, themeStore_1.useThemeStore)();
    // Garante que os observadores globais estejam ativos
    store.initThemeObservers();
    var _a = (0, pinia_1.storeToRefs)(store), theme = _a.theme, isDark = _a.isDark;
    return {
        theme: theme,
        isDark: isDark,
        setTheme: store.setTheme,
        toggle: store.toggle,
    };
};
exports.useTheme = useTheme;
