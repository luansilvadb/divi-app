"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var test_utils_1 = require("@vue/test-utils");
var config_1 = require("primevue/config");
var BaseSkeleton_vue_1 = require("../BaseSkeleton.vue");
(0, vitest_1.describe)('BaseSkeleton.vue', function () {
    var global = {
        plugins: [config_1.default],
        stubs: {
            Skeleton: {
                props: ['width', 'height', 'borderRadius'],
                template: '<div class="p-skeleton" :data-width="width" :data-height="height" :data-radius="borderRadius"><slot /></div>',
            },
        },
    };
    (0, vitest_1.it)('renders with default props', function () {
        var wrapper = (0, test_utils_1.mount)(BaseSkeleton_vue_1.default, {
            global: global,
        });
        var skeleton = wrapper.find('.p-skeleton');
        (0, vitest_1.expect)(skeleton.exists()).toBe(true);
        (0, vitest_1.expect)(skeleton.attributes('data-width')).toBe('100%');
        (0, vitest_1.expect)(skeleton.attributes('data-height')).toBe('20px');
        (0, vitest_1.expect)(skeleton.attributes('data-radius')).toBe('8px');
    });
    (0, vitest_1.it)('renders with custom width and height', function () {
        var wrapper = (0, test_utils_1.mount)(BaseSkeleton_vue_1.default, {
            props: {
                width: '50px',
                height: '50px',
            },
            global: global,
        });
        var skeleton = wrapper.find('.p-skeleton');
        (0, vitest_1.expect)(skeleton.attributes('data-width')).toBe('50px');
        (0, vitest_1.expect)(skeleton.attributes('data-height')).toBe('50px');
    });
    (0, vitest_1.it)('applies full border radius when rounded is true', function () {
        var wrapper = (0, test_utils_1.mount)(BaseSkeleton_vue_1.default, {
            props: {
                rounded: true,
            },
            global: global,
        });
        var skeleton = wrapper.find('.p-skeleton');
        (0, vitest_1.expect)(skeleton.attributes('data-radius')).toBe('50%');
    });
    (0, vitest_1.it)('applies custom classes', function () {
        var wrapper = (0, test_utils_1.mount)(BaseSkeleton_vue_1.default, {
            props: {
                customClass: 'my-custom-class',
            },
            global: global,
        });
        // Skeleton wrapper should have the class passed via the template
        // In our stub, we can check wrapper classes.
        (0, vitest_1.expect)(wrapper.find('.p-skeleton').classes()).toContain('my-custom-class');
    });
});
