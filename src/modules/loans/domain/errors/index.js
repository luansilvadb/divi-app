"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructureError = exports.DomainError = void 0;
var DomainError = /** @class */ (function (_super) {
    __extends(DomainError, _super);
    function DomainError(message, originalError) {
        var _this = _super.call(this, message) || this;
        _this.originalError = originalError;
        _this.name = 'DomainError';
        return _this;
    }
    return DomainError;
}(Error));
exports.DomainError = DomainError;
var InfrastructureError = /** @class */ (function (_super) {
    __extends(InfrastructureError, _super);
    function InfrastructureError(message, originalError) {
        var _this = _super.call(this, message, originalError) || this;
        _this.name = 'InfrastructureError';
        return _this;
    }
    return InfrastructureError;
}(DomainError));
exports.InfrastructureError = InfrastructureError;
