"use strict";
/**
 * Centralized formatting utilities for the application.
 * All functions follow Brazilian (pt-BR) standards.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMonthLong = formatMonthLong;
exports.formatTime = formatTime;
exports.formatMonthShort = formatMonthShort;
exports.formatCurrency = formatCurrency;
exports.formatCurrencySign = formatCurrencySign;
exports.formatDate = formatDate;
exports.formatDateShort = formatDateShort;
exports.getRelativeDayLabel = getRelativeDayLabel;
// Reusable formatters for better performance
var currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});
var currencySignFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    signDisplay: 'always',
});
var dateFormatter = new Intl.DateTimeFormat('pt-BR');
var monthShortFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });
var monthLongFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' });
var timeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
/**
 * Formats a date to long month name (e.g., "Janeiro")
 */
function formatMonthLong(date) {
    return monthLongFormatter.format(date).replace(/^\w/, function (c) { return c.toUpperCase(); });
}
/**
 * Formats a date string to time (HH:MM)
 */
function formatTime(dateStr) {
    if (!dateStr)
        return '';
    var date = new Date(dateStr);
    return timeFormatter.format(date);
}
/**
 * Formats a date to short month name (e.g., "JAN")
 */
function formatMonthShort(date) {
    return monthShortFormatter.format(date).replace('.', '').toUpperCase();
}
/**
 * Formats a number as BRL currency (R$ 1.000,00)
 */
function formatCurrency(value) {
    return currencyFormatter.format(value);
}
/**
 * Formats a number as BRL currency with sign always displayed (+R$ 1,00 or -R$ 1,00)
 */
function formatCurrencySign(value) {
    return currencySignFormatter.format(value);
}
/**
 * Formats an ISO date string to pt-BR date (DD/MM/YYYY)
 */
function formatDate(dateStr) {
    if (!dateStr)
        return '';
    var date = new Date(dateStr);
    return dateFormatter.format(date);
}
/**
 * Formats a date string to a short representation (e.g., "12 MAR")
 */
function formatDateShort(dateStr) {
    if (!dateStr)
        return '';
    var date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T12:00:00'));
    var day = date.getDate().toString().padStart(2, '0');
    var month = monthShortFormatter.format(date).replace('.', '').toUpperCase();
    return "".concat(day, " ").concat(month);
}
/**
 * Get human-friendly relative date day (Hoje, Ontem, or DD)
 */
function getRelativeDayLabel(dateStr) {
    if (!dateStr)
        return '';
    var date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T12:00:00'));
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    var checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    if (checkDate.getTime() === today.getTime())
        return 'Hoje';
    if (checkDate.getTime() === yesterday.getTime())
        return 'Ontem';
    return date.getDate().toString().padStart(2, '0');
}
