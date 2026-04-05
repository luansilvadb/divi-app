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
var BaseCard_vue_1 = require("../BaseCard.vue");
(0, vitest_1.describe)('BaseCard.vue', function () {
    var global = {
        plugins: [config_1.default],
        stubs: {
            BaseIconBox: true,
            BaseSkeleton: true,
        }
    };
    (0, vitest_1.it)('renders default slot content normally', function () {
        var wrapper = (0, test_utils_1.mount)(BaseCard_vue_1.default, {
            slots: {
                default: '<div class="content">Main Content</div>',
            },
            global: global,
        });
        (0, vitest_1.expect)(wrapper.html()).toContain('Main Content');
    });
    (0, vitest_1.it)('renders header slot if provided', function () {
        var wrapper = (0, test_utils_1.mount)(BaseCard_vue_1.default, {
            slots: {
                header: 'Card Header',
            },
            global: global,
        });
        (0, vitest_1.expect)(wrapper.html()).toContain('Card Header');
    });
    (0, vitest_1.it)('renders footer slot if provided', function () {
        var wrapper = (0, test_utils_1.mount)(BaseCard_vue_1.default, {
            slots: {
                footer: 'Card Footer',
            },
            global: global,
        });
        (0, vitest_1.expect)(wrapper.html()).toContain('Card Footer');
    });
    (0, vitest_1.it)('renders error state and retry button if error prop is true', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper, retryBtn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = (0, test_utils_1.mount)(BaseCard_vue_1.default, {
                        props: {
                            error: true,
                            errorMsg: 'Custom Error Message',
                            retryable: true,
                        },
                        global: global,
                    });
                    (0, vitest_1.expect)(wrapper.text()).toContain('Custom Error Message');
                    retryBtn = wrapper.find('button');
                    (0, vitest_1.expect)(retryBtn.exists()).toBe(true);
                    return [4 /*yield*/, retryBtn.trigger('click')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(wrapper.emitted('retry')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('renders empty state if isEmpty prop is true', function () {
        var wrapper = (0, test_utils_1.mount)(BaseCard_vue_1.default, {
            props: {
                isEmpty: true,
                emptyTitle: 'No Content',
            },
            global: global,
        });
        (0, vitest_1.expect)(wrapper.text()).toContain('No Content');
    });
    (0, vitest_1.it)('renders loading state if isLoading prop is true', function () {
        var wrapper = (0, test_utils_1.mount)(BaseCard_vue_1.default, {
            props: {
                isLoading: true,
            },
            global: global,
        });
        (0, vitest_1.expect)(wrapper.findComponent({ name: 'BaseSkeleton' }).exists()).toBe(true);
    });
    (0, vitest_1.it)('emits click when clickable and enter is pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = (0, test_utils_1.mount)(BaseCard_vue_1.default, {
                        props: {
                            clickable: true,
                        },
                        global: global,
                    });
                    return [4 /*yield*/, wrapper.trigger('keydown.enter')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(wrapper.emitted('click')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('emits click when clickable and space is pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = (0, test_utils_1.mount)(BaseCard_vue_1.default, {
                        props: {
                            clickable: true,
                        },
                        global: global,
                    });
                    return [4 /*yield*/, wrapper.trigger('keydown.space')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(wrapper.emitted('click')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
