"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var test_utils_1 = require("@vue/test-utils");
var BaseIconBox_vue_1 = require("../BaseIconBox.vue");
(0, vitest_1.describe)('BaseIconBox.vue', function () {
    (0, vitest_1.it)('renders default slot content', function () {
        var wrapper = (0, test_utils_1.mount)(BaseIconBox_vue_1.default, {
            slots: {
                default: '<i>Icon</i>',
            },
        });
        (0, vitest_1.expect)(wrapper.html()).toContain('<i>Icon</i>');
    });
    (0, vitest_1.it)('applies default md size class', function () {
        var wrapper = (0, test_utils_1.mount)(BaseIconBox_vue_1.default);
        (0, vitest_1.expect)(wrapper.classes()).toContain('w-10');
        (0, vitest_1.expect)(wrapper.classes()).toContain('h-10');
    });
    (0, vitest_1.it)('applies sm size class', function () {
        var wrapper = (0, test_utils_1.mount)(BaseIconBox_vue_1.default, {
            props: { size: 'sm' },
        });
        (0, vitest_1.expect)(wrapper.classes()).toContain('w-8');
        (0, vitest_1.expect)(wrapper.classes()).toContain('h-8');
    });
    (0, vitest_1.it)('applies lg size class', function () {
        var wrapper = (0, test_utils_1.mount)(BaseIconBox_vue_1.default, {
            props: { size: 'lg' },
        });
        (0, vitest_1.expect)(wrapper.classes()).toContain('w-12');
        (0, vitest_1.expect)(wrapper.classes()).toContain('h-12');
    });
    (0, vitest_1.it)('applies custom color style correctly', function () {
        var wrapper = (0, test_utils_1.mount)(BaseIconBox_vue_1.default, {
            props: { color: '#ff0000' },
        });
        (0, vitest_1.expect)(wrapper.attributes('style')).toContain('background-color: rgba(255, 0, 0, 0.082)');
        (0, vitest_1.expect)(wrapper.attributes('style')).toContain('color: rgb(255, 0, 0)');
    });
    (0, vitest_1.it)('applies css var color style correctly', function () {
        var wrapper = (0, test_utils_1.mount)(BaseIconBox_vue_1.default, {
            props: { color: 'var(--my-color)' },
        });
        (0, vitest_1.expect)(wrapper.attributes('style')).toContain('background-color: rgba(var(--my-color), 0.1)');
        (0, vitest_1.expect)(wrapper.attributes('style')).toContain('color: var(--my-color)');
    });
    (0, vitest_1.it)('applies default classes if no color is provided', function () {
        var wrapper = (0, test_utils_1.mount)(BaseIconBox_vue_1.default);
        (0, vitest_1.expect)(wrapper.classes()).toContain('bg-primary-main/10');
        (0, vitest_1.expect)(wrapper.classes()).toContain('text-primary-main');
    });
});
