"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var test_utils_1 = require("@vue/test-utils");
var config_1 = require("primevue/config");
var BaseSelect_vue_1 = require("../BaseSelect.vue");
// Mock matchMedia for PrimeVue Select component
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vitest_1.vi.fn().mockImplementation(function (query) { return ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vitest_1.vi.fn(), // deprecated
        removeListener: vitest_1.vi.fn(), // deprecated
        addEventListener: vitest_1.vi.fn(),
        removeEventListener: vitest_1.vi.fn(),
        dispatchEvent: vitest_1.vi.fn(),
    }); }),
});
(0, vitest_1.describe)('BaseSelect.vue', function () {
    var global = {
        plugins: [config_1.default],
    };
    var defaultOptions = [
        { label: 'Option 1', value: 1 },
        { label: 'Option 2', value: 2 },
    ];
    (0, vitest_1.it)('renders a label if provided', function () {
        var wrapper = (0, test_utils_1.mount)(BaseSelect_vue_1.default, {
            props: {
                id: 'test-select',
                label: 'Test Label',
                modelValue: null,
                options: defaultOptions,
            },
            global: global,
        });
        var label = wrapper.find('label');
        (0, vitest_1.expect)(label.exists()).toBe(true);
        (0, vitest_1.expect)(label.text()).toBe('Test Label');
        (0, vitest_1.expect)(label.attributes('for')).toBe('test-select');
    });
    (0, vitest_1.it)('emits update:modelValue when an option is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper, select;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    wrapper = (0, test_utils_1.mount)(BaseSelect_vue_1.default, {
                        props: {
                            id: 'test-select',
                            modelValue: null,
                            options: defaultOptions,
                        },
                        global: global,
                    });
                    select = wrapper.findComponent({ name: 'Select' });
                    return [4 /*yield*/, select.vm.$emit('update:modelValue', 2)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(wrapper.emitted('update:modelValue')).toBeTruthy();
                    (0, vitest_1.expect)((_a = wrapper.emitted('update:modelValue')) === null || _a === void 0 ? void 0 : _a[0]).toEqual([2]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('renders error message if error prop is provided', function () {
        var wrapper = (0, test_utils_1.mount)(BaseSelect_vue_1.default, {
            props: {
                id: 'test-error',
                modelValue: null,
                options: defaultOptions,
                error: 'This is an error message',
            },
            global: global,
        });
        var errorMsg = wrapper.find('#test-error-error');
        (0, vitest_1.expect)(errorMsg.exists()).toBe(true);
        (0, vitest_1.expect)(errorMsg.text()).toBe('This is an error message');
    });
});
