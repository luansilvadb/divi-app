"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var themes_1 = require("@primeuix/themes");
var aura_1 = require("@primeuix/themes/aura");
var DiviPreset = (0, themes_1.definePreset)(aura_1.default, {
    semantic: {
        primary: {
            50: '#eef2f7',
            100: '#d5dde8',
            200: '#adbbd1',
            300: '#8499ba',
            400: '#5c77a3',
            500: '#4a6fa5',
            600: '#3d5b87',
            700: '#2f4769',
            800: '#22334b',
            900: '#1a2333',
            950: '#0f1520',
        },
        colorScheme: {
            light: {
                primary: {
                    color: '#1a2333',
                    contrastColor: '#ffffff',
                    hoverColor: '#22334b',
                    activeColor: '#2f4769',
                },
                surface: {
                    0: '#ffffff',
                    50: '#f8fafc',
                    100: '#f5f7fa',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
            },
            dark: {
                primary: {
                    color: '#4a6fa5',
                    contrastColor: '#ffffff',
                    hoverColor: '#5c77a3',
                    activeColor: '#3d5b87',
                },
                surface: {
                    0: '#ffffff',
                    50: '#f0f6fc',
                    100: '#e2e8f0',
                    200: '#94a3b8',
                    300: '#64748b',
                    400: '#334155',
                    500: '#1e2433',
                    600: '#1a1f2e',
                    700: '#151a26',
                    800: '#131824',
                    900: '#0e1219',
                    950: '#0a0d14',
                },
            },
        },
    },
    components: {
        drawer: {
            // @ts-expect-error Types in primevue theme might be incomplete
            root: { borderRadius: '0' },
        },
        card: {
            root: { borderRadius: '2rem', shadow: 'none' },
            body: { padding: '0' },
            // @ts-expect-error Types in primevue theme might be incomplete
            content: { padding: '1.5rem' },
        },
        button: {
            root: { borderRadius: '9999px' },
        },
        dialog: {
            root: { borderRadius: '1.5rem' },
        },
        inputtext: {
            root: { borderRadius: '0.5rem' },
        },
        select: {
            root: { borderRadius: '0.5rem' },
        },
        progressbar: {
            root: { borderRadius: '9999px', height: '0.625rem' },
        },
        skeleton: {
            root: { borderRadius: '0.5rem' },
        },
        badge: {
            root: { borderRadius: '9999px', fontWeight: '900', fontSize: '0.7rem' },
        },
        carousel: {
            // @ts-expect-error Types in primevue theme might be incomplete
            root: { borderRadius: '1.25rem' }
        },
        selectbutton: {
            root: { borderRadius: '0.5rem' }
        },
        menu: {
            root: { borderRadius: '1rem' },
        },
    },
});
exports.default = DiviPreset;
