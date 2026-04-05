"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoCategorizationService = void 0;
var AutoCategorizationService = /** @class */ (function () {
    function AutoCategorizationService() {
        this.categoryMap = {
            netflix: 'Entertainment',
            spotify: 'Entertainment',
            uber: 'Transportation',
            ifood: 'Food',
            supermarket: 'Groceries',
            gas: 'Transportation',
            amazon: 'Shopping',
        };
    }
    /**
     * Suggests a category based on the transaction title
     */
    AutoCategorizationService.prototype.suggestCategory = function (title, categories) {
        var lowercaseTitle = title.toLowerCase();
        var foundKeyword = Object.keys(this.categoryMap).find(function (keyword) {
            return lowercaseTitle.includes(keyword);
        });
        if (foundKeyword) {
            var categoryName_1 = this.categoryMap[foundKeyword];
            return categories.find(function (c) { return c.name === categoryName_1; }) || null;
        }
        return null;
    };
    return AutoCategorizationService;
}());
exports.AutoCategorizationService = AutoCategorizationService;
