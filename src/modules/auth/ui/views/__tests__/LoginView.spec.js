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
var di_1 = require("@/core/di");
var di_tokens_1 = require("@/core/di-tokens");
var LoginView_vue_1 = require("../LoginView.vue");
var mockAuthService = {
    signInWithGoogle: vitest_1.vi.fn(),
    signOut: vitest_1.vi.fn(),
    getCurrentUser: vitest_1.vi.fn(),
    onAuthStateChange: vitest_1.vi.fn(),
};
(0, vitest_1.describe)('LoginView.vue', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        di_1.container.register(di_tokens_1.DI_TOKENS.AuthService, mockAuthService);
    });
    (0, vitest_1.it)('renders login view with proper accessibility attributes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper, googleBtn, signInMock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = (0, test_utils_1.mount)(LoginView_vue_1.default);
                    googleBtn = wrapper.find('#login-google-btn');
                    (0, vitest_1.expect)(googleBtn.exists()).toBe(true);
                    // Initially should not be loading
                    (0, vitest_1.expect)(googleBtn.attributes('aria-busy')).toBe('false');
                    signInMock = vitest_1.vi.mocked(mockAuthService.signInWithGoogle).mockImplementation(function () {
                        return new Promise(function (resolve) { return setTimeout(resolve, 100); });
                    });
                    return [4 /*yield*/, googleBtn.trigger('click')
                        // Expect aria-busy to be true
                    ];
                case 1:
                    _a.sent();
                    // Expect aria-busy to be true
                    (0, vitest_1.expect)(googleBtn.attributes('aria-busy')).toBe('true');
                    // Wait for the mock to resolve
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 150); })];
                case 2:
                    // Wait for the mock to resolve
                    _a.sent();
                    return [4 /*yield*/, wrapper.vm.$nextTick()
                        // Expect it to be back to false
                    ];
                case 3:
                    _a.sent();
                    // Expect it to be back to false
                    (0, vitest_1.expect)(googleBtn.attributes('aria-busy')).toBe('false');
                    (0, vitest_1.expect)(signInMock).toHaveBeenCalledOnce();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('svg and loading spinner should have aria-hidden', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper, svgIcon, spinner;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = (0, test_utils_1.mount)(LoginView_vue_1.default);
                    svgIcon = wrapper.find('#login-google-btn svg');
                    (0, vitest_1.expect)(svgIcon.exists()).toBe(true);
                    (0, vitest_1.expect)(svgIcon.attributes('aria-hidden')).toBe('true');
                    // Loading state
                    vitest_1.vi.mocked(mockAuthService.signInWithGoogle).mockImplementation(function () {
                        return new Promise(function (resolve) { return setTimeout(resolve, 100); });
                    });
                    return [4 /*yield*/, wrapper.find('#login-google-btn').trigger('click')
                        // Wait for DOM update
                    ];
                case 1:
                    _a.sent();
                    // Wait for DOM update
                    return [4 /*yield*/, wrapper.vm.$nextTick()
                        // The spinner
                    ];
                case 2:
                    // Wait for DOM update
                    _a.sent();
                    spinner = wrapper.find('#login-google-btn .animate-spin');
                    (0, vitest_1.expect)(spinner.exists()).toBe(true);
                    (0, vitest_1.expect)(spinner.attributes('aria-hidden')).toBe('true');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('terms and privacy links should have aria-labels', function () {
        var wrapper = (0, test_utils_1.mount)(LoginView_vue_1.default);
        var links = wrapper.findAll('a');
        (0, vitest_1.expect)(links.length).toBe(2);
        var termsLink = links[0];
        var privacyLink = links[1];
        (0, vitest_1.expect)(termsLink === null || termsLink === void 0 ? void 0 : termsLink.text()).toBe('Termos de Uso');
        (0, vitest_1.expect)(termsLink === null || termsLink === void 0 ? void 0 : termsLink.attributes('aria-label')).toBe('Termos de Uso');
        (0, vitest_1.expect)(privacyLink === null || privacyLink === void 0 ? void 0 : privacyLink.text()).toBe('Política de Privacidade');
        (0, vitest_1.expect)(privacyLink === null || privacyLink === void 0 ? void 0 : privacyLink.attributes('aria-label')).toBe('Política de Privacidade');
    });
});
