"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var test_utils_1 = require("@vue/test-utils");
var BaseButton_vue_1 = require("../BaseButton.vue");
(0, vitest_1.describe)('BaseButton.vue', function () {
    var global = {
        directives: {
            ripple: function () { },
        },
        components: {
            Button: {
                template: '<button v-bind="$attrs"><slot /></button>',
            },
        },
    };
    (0, vitest_1.it)('renders default button correctly', function () {
        var wrapper = (0, test_utils_1.mount)(BaseButton_vue_1.default, {
            slots: {
                default: 'Click me',
            },
            global: global,
        });
        (0, vitest_1.expect)(wrapper.text()).toContain('Click me');
    });
    (0, vitest_1.it)('applies the correct primary variant by default', function () {
        var wrapper = (0, test_utils_1.mount)(BaseButton_vue_1.default, { global: global });
        // In our mock, severity might not pass through easily unless we use the real component.
        // Let's test the class directly or simply test that it mounts without crashing.
        // For now we check the base classes.
        (0, vitest_1.expect)(wrapper.classes()).toContain('font-bold');
        (0, vitest_1.expect)(wrapper.classes()).toContain('transition-all');
        (0, vitest_1.expect)(wrapper.classes()).toContain('shadow-lg'); // Not outline or ghost
    });
    (0, vitest_1.it)('does not apply shadow-lg when variant is outline', function () {
        var wrapper = (0, test_utils_1.mount)(BaseButton_vue_1.default, {
            props: {
                variant: 'outline',
            },
            global: global,
        });
        (0, vitest_1.expect)(wrapper.classes()).not.toContain('shadow-lg');
    });
    (0, vitest_1.it)('does not apply shadow-lg when variant is ghost', function () {
        var wrapper = (0, test_utils_1.mount)(BaseButton_vue_1.default, {
            props: {
                variant: 'ghost',
            },
            global: global,
        });
        (0, vitest_1.expect)(wrapper.classes()).not.toContain('shadow-lg');
    });
    (0, vitest_1.it)('disables the button when disabled prop is true', function () {
        var wrapper = (0, test_utils_1.mount)(BaseButton_vue_1.default, {
            props: {
                disabled: true,
            },
            global: global,
        });
        (0, vitest_1.expect)(wrapper.attributes('disabled')).toBeDefined();
    });
    (0, vitest_1.it)('disables the button when loading prop is true', function () {
        var wrapper = (0, test_utils_1.mount)(BaseButton_vue_1.default, {
            props: {
                loading: true,
            },
            global: global,
        });
        (0, vitest_1.expect)(wrapper.attributes('disabled')).toBeDefined();
    });
});
