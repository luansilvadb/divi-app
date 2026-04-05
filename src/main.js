"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var pinia_1 = require("pinia");
var config_1 = require("@primevue/core/config");
var diviPreset_1 = require("./core/theme/diviPreset");
var ripple_1 = require("primevue/ripple");
var tooltip_1 = require("primevue/tooltip");
var animateonscroll_1 = require("primevue/animateonscroll");
var toastservice_1 = require("primevue/toastservice");
require("primeicons/primeicons.css");
require("./core/styles/main.css");
var App_vue_1 = require("./App.vue");
var router_1 = require("./core/router");
var app = (0, vue_1.createApp)(App_vue_1.default);
app.use((0, pinia_1.createPinia)());
app.use(router_1.default);
app.directive('ripple', ripple_1.default);
app.directive('tooltip', tooltip_1.default);
app.directive('animateonscroll', animateonscroll_1.default);
app.use(config_1.default, {
    theme: {
        preset: diviPreset_1.default,
        options: {
            darkModeSelector: '.dark',
            cssLayer: {
                name: 'primevue',
                order: 'primevue, tailwind',
            },
        }
    }
});
app.use(toastservice_1.default);
app.mount('#app');
