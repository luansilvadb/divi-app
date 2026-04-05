"use strict";
/// <reference types="D:/software/divi/divi-app/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="D:/software/divi/divi-app/node_modules/@vue/language-core/types/props-fallback.d.ts" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var vue_1 = require("vue");
var transactionStore_1 = require("@/modules/transactions/application/stores/transactionStore");
var AutoCategorizationService_1 = require("@/modules/transactions/application/services/AutoCategorizationService");
var BaseInput_vue_1 = require("@/shared/components/atoms/BaseInput.vue");
var BaseSelect_vue_1 = require("@/shared/components/atoms/BaseSelect.vue");
var BaseButton_vue_1 = require("@/shared/components/atoms/BaseButton.vue");
var selectbutton_1 = require("primevue/selectbutton");
var props = defineProps();
var emit = defineEmits(['close', 'saved']);
var store = (0, transactionStore_1.useTransactionStore)();
var autoCatService = new AutoCategorizationService_1.AutoCategorizationService();
var isSubmitting = (0, vue_1.ref)(false);
var errors = (0, vue_1.reactive)({});
var typeOptions = [
    { label: 'Despesa', value: 'expense', icon: 'pi pi-arrow-down' },
    { label: 'Receita', value: 'income', icon: 'pi pi-arrow-up' }
];
var form = (0, vue_1.reactive)({
    title: '',
    amount: null,
    type: 'expense',
    category_id: '',
    wallet_id: '',
    date: new Date().toISOString().slice(0, 10),
});
function validateForm() {
    Object.keys(errors).forEach(function (key) { return delete errors[key]; });
    if (!form.title.trim()) {
        errors.title = 'O título é obrigatório';
    }
    if (form.amount === null || form.amount <= 0) {
        errors.amount = 'O valor deve ser maior que zero';
    }
    if (!form.category_id) {
        errors.category_id = 'A categoria é obrigatória';
    }
    if (!form.wallet_id) {
        errors.wallet_id = 'A conta é obrigatória';
    }
    if (!form.date) {
        errors.date = 'A data é obrigatória';
    }
    return Object.keys(errors).length === 0;
}
(0, vue_1.watch)(function () { return props.initialData; }, function (newData) {
    if (newData) {
        form.title = newData.title;
        form.amount = newData.amount;
        form.type = newData.type;
        form.category_id = newData.category_id;
        form.wallet_id = newData.wallet_id;
        form.date = new Date(newData.date).toISOString().slice(0, 10);
    }
    else {
        form.title = '';
        form.amount = null;
        form.type = 'expense';
        form.category_id = '';
        form.wallet_id = '';
        form.date = new Date().toISOString().slice(0, 10);
    }
    Object.keys(errors).forEach(function (key) { return delete errors[key]; });
}, { immediate: true });
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(store.wallets.length === 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, store.fetchWallets()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!(store.categories.length === 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, store.fetchCategories()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
function handleTitleInput() {
    if (errors.title)
        delete errors.title;
    var suggestion = autoCatService.suggestCategory(form.title, store.categories);
    if (suggestion) {
        form.category_id = suggestion.id;
        if (errors.category_id)
            delete errors.category_id;
    }
}
function handleSubmit() {
    return __awaiter(this, void 0, void 0, function () {
        var isEditing, transactionData, transactionData, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (isSubmitting.value)
                        return [2 /*return*/];
                    if (!validateForm())
                        return [2 /*return*/];
                    isSubmitting.value = true;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    isEditing = !!((_a = props.initialData) === null || _a === void 0 ? void 0 : _a.id);
                    if (!isEditing) return [3 /*break*/, 3];
                    transactionData = __assign(__assign(__assign({}, props.initialData), form), { updated_at: new Date().toISOString() });
                    return [4 /*yield*/, store.saveTransaction(transactionData)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 3:
                    transactionData = __assign(__assign({}, form), { id: crypto.randomUUID(), user_id: '', synced: false, deleted: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
                    return [4 /*yield*/, store.saveTransaction(transactionData)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    emit('saved');
                    emit('close');
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _b.sent();
                    console.error('Save error:', error_1);
                    return [3 /*break*/, 8];
                case 7:
                    isSubmitting.value = false;
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)(__assign({ onSubmit: (__VLS_ctx.handleSubmit) }, { class: "p-5 space-y-4 bg-surface-main dark:bg-surface-main h-full max-h-none pb-4" }));
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-surface-main']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-surface-main']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-none']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col gap-2" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.SelectButton | typeof __VLS_components.SelectButton} */
selectbutton_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign(__assign({ modelValue: (__VLS_ctx.form.type), options: (__VLS_ctx.typeOptions), optionLabel: "label", optionValue: "value" }, { class: "w-full" }), { pt: ({
        root: { class: 'flex p-1.5 bg-white/5 rounded-2xl gap-1.5 border border-white/5 shadow-inner' },
        button: function (_a) {
            var context = _a.context;
            return ({
                class: [
                    'flex-1 py-2.5 px-4 rounded-xl font-black text-[0.7rem] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 group relative overflow-hidden border-none shadow-none focus:ring-0',
                    context.active
                        ? (__VLS_ctx.form.type === 'expense'
                            ? 'bg-error-main text-white shadow-[0_10px_25_rgba(248,81,73,0.3)]'
                            : 'bg-success-main text-white shadow-[0_10px_25_rgba(50,205,50,0.3)]')
                        : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 bg-transparent'
                ]
            });
        }
    }) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign({ modelValue: (__VLS_ctx.form.type), options: (__VLS_ctx.typeOptions), optionLabel: "label", optionValue: "value" }, { class: "w-full" }), { pt: ({
            root: { class: 'flex p-1.5 bg-white/5 rounded-2xl gap-1.5 border border-white/5 shadow-inner' },
            button: function (_a) {
                var context = _a.context;
                return ({
                    class: [
                        'flex-1 py-2.5 px-4 rounded-xl font-black text-[0.7rem] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 group relative overflow-hidden border-none shadow-none focus:ring-0',
                        context.active
                            ? (__VLS_ctx.form.type === 'expense'
                                ? 'bg-error-main text-white shadow-[0_10px_25_rgba(248,81,73,0.3)]'
                                : 'bg-success-main text-white shadow-[0_10px_25_rgba(50,205,50,0.3)]')
                            : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 bg-transparent'
                    ]
                });
            }
        }) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_5 = __VLS_3.slots.default;
{
    var __VLS_6 = __VLS_3.slots.option;
    var slotProps = __VLS_vSlot(__VLS_6)[0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-2" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)(__assign({ class: (slotProps.option.icon) }, { class: "text-sm" }));
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (slotProps.option.label);
    // @ts-ignore
    [handleSubmit, form, form, typeOptions,];
}
// @ts-ignore
[];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "space-y-4" }));
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
var __VLS_7 = BaseInput_vue_1.default;
// @ts-ignore
var __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7(__assign(__assign(__assign({ 'onInput': {} }, { id: "title", label: "Título da Transação", modelValue: (__VLS_ctx.form.title), placeholder: "Ex: Netflix, Supermercado..." }), { class: "premium-input-group" }), { error: (__VLS_ctx.errors.title) })));
var __VLS_9 = __VLS_8.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onInput': {} }, { id: "title", label: "Título da Transação", modelValue: (__VLS_ctx.form.title), placeholder: "Ex: Netflix, Supermercado..." }), { class: "premium-input-group" }), { error: (__VLS_ctx.errors.title) })], __VLS_functionalComponentArgsRest(__VLS_8), false));
var __VLS_12;
var __VLS_13 = ({ input: {} },
    { onInput: (__VLS_ctx.handleTitleInput) });
/** @type {__VLS_StyleScopedClasses['premium-input-group']} */ ;
var __VLS_10;
var __VLS_11;
var __VLS_14 = BaseInput_vue_1.default;
// @ts-ignore
var __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    id: "amount",
    label: "Valor (R$)",
    type: "number",
    step: "0.01",
    modelValue: (__VLS_ctx.form.amount),
    placeholder: "0,00",
    error: (__VLS_ctx.errors.amount),
}));
var __VLS_16 = __VLS_15.apply(void 0, __spreadArray([{
        id: "amount",
        label: "Valor (R$)",
        type: "number",
        step: "0.01",
        modelValue: (__VLS_ctx.form.amount),
        placeholder: "0,00",
        error: (__VLS_ctx.errors.amount),
    }], __VLS_functionalComponentArgsRest(__VLS_15), false));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }));
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
var __VLS_19 = BaseSelect_vue_1.default;
// @ts-ignore
var __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19(__assign(__assign({ id: "category", label: "Categoria", modelValue: (__VLS_ctx.form.category_id), options: (__VLS_ctx.store.categories.map(function (cat) { return ({ label: cat.name, value: cat.id }); })), placeholder: "Selecionar Categoria" }, { class: "!mb-0" }), { error: (__VLS_ctx.errors.category_id) })));
var __VLS_21 = __VLS_20.apply(void 0, __spreadArray([__assign(__assign({ id: "category", label: "Categoria", modelValue: (__VLS_ctx.form.category_id), options: (__VLS_ctx.store.categories.map(function (cat) { return ({ label: cat.name, value: cat.id }); })), placeholder: "Selecionar Categoria" }, { class: "!mb-0" }), { error: (__VLS_ctx.errors.category_id) })], __VLS_functionalComponentArgsRest(__VLS_20), false));
/** @type {__VLS_StyleScopedClasses['!mb-0']} */ ;
var __VLS_24 = BaseSelect_vue_1.default;
// @ts-ignore
var __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24(__assign(__assign({ id: "wallet", label: "Conta / Carteira", modelValue: (__VLS_ctx.form.wallet_id), options: (__VLS_ctx.store.wallets.map(function (w) { return ({ label: w.name, value: w.id }); })), placeholder: "Selecionar Conta" }, { class: "!mb-0" }), { error: (__VLS_ctx.errors.wallet_id) })));
var __VLS_26 = __VLS_25.apply(void 0, __spreadArray([__assign(__assign({ id: "wallet", label: "Conta / Carteira", modelValue: (__VLS_ctx.form.wallet_id), options: (__VLS_ctx.store.wallets.map(function (w) { return ({ label: w.name, value: w.id }); })), placeholder: "Selecionar Conta" }, { class: "!mb-0" }), { error: (__VLS_ctx.errors.wallet_id) })], __VLS_functionalComponentArgsRest(__VLS_25), false));
/** @type {__VLS_StyleScopedClasses['!mb-0']} */ ;
var __VLS_29 = BaseInput_vue_1.default;
// @ts-ignore
var __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    id: "date",
    label: "Data do Lançamento",
    type: "date",
    modelValue: (__VLS_ctx.form.date),
    error: (__VLS_ctx.errors.date),
}));
var __VLS_31 = __VLS_30.apply(void 0, __spreadArray([{
        id: "date",
        label: "Data do Lançamento",
        type: "date",
        modelValue: (__VLS_ctx.form.date),
        error: (__VLS_ctx.errors.date),
    }], __VLS_functionalComponentArgsRest(__VLS_30), false));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-4 pt-4 shrink-0" }));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
var __VLS_34 = BaseButton_vue_1.default || BaseButton_vue_1.default;
// @ts-ignore
var __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34(__assign(__assign({ 'onClick': {} }, { variant: "ghost", type: "button" }), { class: "flex-1 !py-3 font-black uppercase text-[0.7rem] tracking-widest opacity-40 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all" })));
var __VLS_36 = __VLS_35.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { variant: "ghost", type: "button" }), { class: "flex-1 !py-3 font-black uppercase text-[0.7rem] tracking-widest opacity-40 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all" })], __VLS_functionalComponentArgsRest(__VLS_35), false));
var __VLS_39;
var __VLS_40 = ({ click: {} },
    { onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.$emit('close');
            // @ts-ignore
            [form, form, form, form, form, errors, errors, errors, errors, errors, handleTitleInput, store, store, $emit,];
        } });
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['!py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.7rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-40']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
var __VLS_41 = __VLS_37.slots.default;
// @ts-ignore
[];
var __VLS_37;
var __VLS_38;
var __VLS_42 = BaseButton_vue_1.default || BaseButton_vue_1.default;
// @ts-ignore
var __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42(__assign(__assign({ type: "submit", loading: (__VLS_ctx.isSubmitting) }, { class: "flex-[2] !py-3 font-black uppercase text-[0.7rem] tracking-[0.15em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]" }), { variant: (__VLS_ctx.form.type === 'expense' ? 'danger' : 'primary') })));
var __VLS_44 = __VLS_43.apply(void 0, __spreadArray([__assign(__assign({ type: "submit", loading: (__VLS_ctx.isSubmitting) }, { class: "flex-[2] !py-3 font-black uppercase text-[0.7rem] tracking-[0.15em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]" }), { variant: (__VLS_ctx.form.type === 'expense' ? 'danger' : 'primary') })], __VLS_functionalComponentArgsRest(__VLS_43), false));
/** @type {__VLS_StyleScopedClasses['flex-[2]']} */ ;
/** @type {__VLS_StyleScopedClasses['!py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.7rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-[0.15em]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-[1.02]']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-[0.98]']} */ ;
var __VLS_47 = __VLS_45.slots.default;
// @ts-ignore
[form, isSubmitting,];
var __VLS_45;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    emits: {},
    __typeProps: {},
});
exports.default = {};
