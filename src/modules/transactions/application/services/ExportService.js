"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportService = void 0;
var ExportService = /** @class */ (function () {
    function ExportService() {
    }
    /**
     * Generates a CSV string from a list of transactions
     */
    ExportService.prototype.generateCSV = function (transactions) {
        var headers = ['Data', 'Título', 'Valor', 'Tipo', 'Categoria', 'Carteira', 'Notas'];
        var rows = transactions.map(function (t) { return [
            new Date(t.date).toLocaleDateString('pt-BR'),
            "\"".concat(t.title.replace(/"/g, '""'), "\""),
            t.amount.toString(),
            t.type,
            t.category_id, // For now exporting IDs, in a real app we would map to names
            t.wallet_id,
            "\"".concat((t.notes || '').replace(/"/g, '""'), "\""),
        ]; });
        return __spreadArray([headers.join(',')], rows.map(function (r) { return r.join(','); }), true).join('\n');
    };
    /**
     * Triggers a browser download for the generated CSV
     */
    ExportService.prototype.downloadCSV = function (csvContent, fileName) {
        if (fileName === void 0) { fileName = 'extrato.csv'; }
        var blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        var url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return ExportService;
}());
exports.ExportService = ExportService;
