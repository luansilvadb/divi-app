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
exports.useSidebarStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var performance_1 = require("../utils/performance");
var router_1 = require("../../core/router");
/**
 * Store global para gerenciar o estado da Sidebar e detecção de performance da UI.
 */
exports.useSidebarStore = (0, pinia_1.defineStore)('sidebar', function () {
    var isExpanded = (0, vue_1.ref)(true);
    var isLowPowerMode = (0, vue_1.ref)(false);
    var prefetchQueue = (0, vue_1.reactive)(new Set());
    var performanceProfile = (0, vue_1.reactive)({
        lastFps: 60,
        interactionLatency: 0,
    });
    /**
     * Inicializa a detecção de performance e recursos do sistema.
     * Ajusta o estado de economia de energia conforme necessário.
     */
    var initPerformanceDetection = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, battery, updateLowPowerState, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = isLowPowerMode;
                    return [4 /*yield*/, (0, performance_1.checkIsLowPowerMode)()
                        // Monitoramento reativo do status da bateria se disponível
                    ];
                case 1:
                    _a.value = _c.sent();
                    if (!('getBattery' in navigator)) return [3 /*break*/, 5];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, navigator.getBattery()];
                case 3:
                    battery = _c.sent();
                    updateLowPowerState = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = isLowPowerMode;
                                    return [4 /*yield*/, (0, performance_1.checkIsLowPowerMode)()];
                                case 1:
                                    _a.value = _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    battery.addEventListener('chargingchange', updateLowPowerState);
                    battery.addEventListener('levelchange', updateLowPowerState);
                    return [3 /*break*/, 5];
                case 4:
                    _b = _c.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Prefetch inteligente de rotas baseado no hover do usuário.
     */
    var prefetchRoute = function (to) { return __awaiter(void 0, void 0, void 0, function () {
        var connection, route, components, loaders, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // Evita prefetch em conexões lentas ou se já estiver na fila
                    if (prefetchQueue.has(to))
                        return [2 /*return*/];
                    connection = navigator.connection;
                    if (connection && (connection.saveData || /2g|3g/.test(connection.effectiveType))) {
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    prefetchQueue.add(to);
                    route = router_1.default.resolve(to);
                    components = route.matched.flatMap(function (m) {
                        return m.components ? Object.values(m.components) : [];
                    });
                    loaders = components.map(function (c) {
                        if (typeof c === 'function')
                            return c();
                        return Promise.resolve();
                    });
                    return [4 /*yield*/, Promise.all(loaders)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    // Falha silenciosa no prefetch para não afetar o usuário
                    prefetchQueue.delete(to);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var toggleSidebar = function () {
        isExpanded.value = !isExpanded.value;
    };
    var setExpanded = function (value) {
        isExpanded.value = value;
    };
    return {
        isExpanded: isExpanded,
        isLowPowerMode: isLowPowerMode,
        prefetchQueue: prefetchQueue,
        performanceProfile: performanceProfile,
        toggleSidebar: toggleSidebar,
        setExpanded: setExpanded,
        initPerformanceDetection: initPerformanceDetection,
        prefetchRoute: prefetchRoute,
    };
});
