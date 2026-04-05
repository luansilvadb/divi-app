"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var test_utils_1 = require("@vue/test-utils");
var config_1 = require("primevue/config");
var BaseBadge_vue_1 = require("../BaseBadge.vue");
(0, vitest_1.describe)('BaseBadge.vue', function () {
    var global = {
        plugins: [config_1.default],
    };
    (0, vitest_1.it)('renders default slot content', function () {
        var wrapper = (0, test_utils_1.mount)(BaseBadge_vue_1.default, {
            slots: {
                default: 'Custom Badge',
            },
            global: global,
        });
        (0, vitest_1.expect)(wrapper.text()).toContain('Custom Badge');
    });
    (0, vitest_1.it)('renders label prop if no default slot is provided', function () {
        var wrapper = (0, test_utils_1.mount)(BaseBadge_vue_1.default, {
            props: {
                label: 'Prop Label',
            },
            global: global,
        });
        (0, vitest_1.expect)(wrapper.text()).toContain('Prop Label');
    });
    (0, vitest_1.it)('maps success status to correct PrimeVue severity', function () {
        var wrapper = (0, test_utils_1.mount)(BaseBadge_vue_1.default, {
            props: {
                status: 'success',
            },
            global: global,
        });
        // We check that the component instance has severity success,
        // rather than looking for a DOM attribute which might be converted to classes by PrimeVue
        var badge = wrapper.findComponent({ name: 'Badge' });
        (0, vitest_1.expect)(badge.props('severity')).toBe('success');
    });
    (0, vitest_1.it)('maps error status to correct PrimeVue severity', function () {
        var wrapper = (0, test_utils_1.mount)(BaseBadge_vue_1.default, {
            props: {
                status: 'error',
            },
            global: global,
        });
        var badge = wrapper.findComponent({ name: 'Badge' });
        (0, vitest_1.expect)(badge.props('severity')).toBe('danger');
    });
    (0, vitest_1.it)('maps warning status to correct PrimeVue severity', function () {
        var wrapper = (0, test_utils_1.mount)(BaseBadge_vue_1.default, {
            props: {
                status: 'warning',
            },
            global: global,
        });
        var badge = wrapper.findComponent({ name: 'Badge' });
        (0, vitest_1.expect)(badge.props('severity')).toBe('warn');
    });
    (0, vitest_1.it)('maps info status to correct PrimeVue severity', function () {
        var wrapper = (0, test_utils_1.mount)(BaseBadge_vue_1.default, {
            props: {
                status: 'info',
            },
            global: global,
        });
        var badge = wrapper.findComponent({ name: 'Badge' });
        (0, vitest_1.expect)(badge.props('severity')).toBe('info');
    });
});
