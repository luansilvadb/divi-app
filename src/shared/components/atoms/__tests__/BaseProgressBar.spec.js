"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var test_utils_1 = require("@vue/test-utils");
var config_1 = require("primevue/config");
var BaseProgressBar_vue_1 = require("../BaseProgressBar.vue");
(0, vitest_1.describe)('BaseProgressBar.vue', function () {
    var global = {
        plugins: [config_1.default],
        stubs: {
            ProgressBar: {
                props: ['value', 'showValue'],
                template: '<div class="p-progressbar" :data-value="value"><slot /></div>',
            },
        },
    };
    (0, vitest_1.it)('renders progress bar with correct value', function () {
        var wrapper = (0, test_utils_1.mount)(BaseProgressBar_vue_1.default, {
            props: {
                percentage: 75,
            },
            global: global,
        });
        // Search by stub's class name since findComponent doesn't always work perfectly with stubs named the same as global components
        var progressBar = wrapper.find('.p-progressbar');
        (0, vitest_1.expect)(progressBar.exists()).toBe(true);
        (0, vitest_1.expect)(progressBar.attributes('data-value')).toBe('75');
    });
    (0, vitest_1.it)('renders default slot containing shimmer animation div', function () {
        var wrapper = (0, test_utils_1.mount)(BaseProgressBar_vue_1.default, {
            props: {
                percentage: 50,
            },
            global: global,
        });
        var shimmerDiv = wrapper.find('.animate-shimmer');
        (0, vitest_1.expect)(shimmerDiv.exists()).toBe(true);
    });
});
