"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsMobile = useIsMobile;
var core_1 = require("@vueuse/core");
function useIsMobile() {
    return (0, core_1.useMediaQuery)('(max-width: 768px)');
}
