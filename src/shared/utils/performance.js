"use strict";
/**
 * Utilitário para detecção de performance e recursos do sistema.
 */
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
exports.checkIsLowPowerMode = checkIsLowPowerMode;
exports.isReducedMotionDetected = isReducedMotionDetected;
function checkIsLowPowerMode() {
    return __awaiter(this, void 0, Promise, function () {
        var battery, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!('getBattery' in navigator)) return [3 /*break*/, 4];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, navigator.getBattery()
                        // Se não estiver carregando e a bateria estiver abaixo de 20%
                    ];
                case 2:
                    battery = _b.sent();
                    // Se não estiver carregando e a bateria estiver abaixo de 20%
                    if (battery.charging === false && battery.level <= 0.2) {
                        return [2 /*return*/, true];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4:
                    // 2. Verificação de Preferência do Usuário (Reduced Motion)
                    // Quase sempre indica economia de recursos ou necessidade de acessibilidade.
                    if (isReducedMotionDetected()) {
                        return [2 /*return*/, true];
                    }
                    // 3. Heurística de FPS (Detecta se o hardware está sofrendo ou em economia de energia)
                    // Mede o tempo de resposta do requestAnimationFrame em uma janela curta de 100ms.
                    return [2 /*return*/, new Promise(function (resolve) {
                            var frameCount = 0;
                            var start = performance.now();
                            var check = function (now) {
                                frameCount++;
                                var elapsed = now - start;
                                if (elapsed >= 100) {
                                    var fps = (frameCount * 1000) / elapsed;
                                    // Se o FPS for menor que 40 em uma janela de 100ms sem carga pesada aparente,
                                    // inferimos que o dispositivo está em modo de economia ou é hardware limitado.
                                    resolve(fps < 40);
                                }
                                else {
                                    requestAnimationFrame(check);
                                }
                            };
                            requestAnimationFrame(check);
                        })];
            }
        });
    });
}
/**
 * Detecta se o usuário prefere movimentos reduzidos (Configuração do SO).
 */
function isReducedMotionDetected() {
    if (typeof window === 'undefined')
        return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
