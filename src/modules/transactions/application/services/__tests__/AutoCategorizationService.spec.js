"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var AutoCategorizationService_1 = require("../AutoCategorizationService");
(0, vitest_1.describe)('AutoCategorizationService', function () {
    var service = new AutoCategorizationService_1.AutoCategorizationService();
    var categories = [
        { id: '1', name: 'Entertainment' },
        { id: '2', name: 'Food' },
        { id: '3', name: 'Transportation' },
    ];
    (0, vitest_1.it)('should suggest Entertainment for Netflix', function () {
        var result = service.suggestCategory('Netflix Subscription', categories);
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.name).toBe('Entertainment');
    });
    (0, vitest_1.it)('should suggest Food for iFood', function () {
        var result = service.suggestCategory('iFood lunch', categories);
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.name).toBe('Food');
    });
    (0, vitest_1.it)('should return null for unknown title', function () {
        var result = service.suggestCategory('Unknown Item', categories);
        (0, vitest_1.expect)(result).toBeNull();
    });
});
