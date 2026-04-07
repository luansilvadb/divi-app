import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import DiviPreset from './core/theme/diviPreset'
import Ripple from 'primevue/ripple'
import Tooltip from 'primevue/tooltip'
import AnimateOnScroll from 'primevue/animateonscroll'
import 'primeicons/primeicons.css'


import './core/styles/main.css'
import App from './App.vue'
import router from './core/router'
import { db } from './infrastructure/db/DexieDB'
import { useDashboardStore } from './modules/dashboard/application/stores/dashboardStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize Database
db.open().catch((err) => {
  console.error('Failed to open Dexie DB:', err)
  const dashboardStore = useDashboardStore(pinia)
  dashboardStore.initializationError = true
})

app.directive('ripple', Ripple)
app.directive('tooltip', Tooltip)
app.directive('animateonscroll', AnimateOnScroll)
app.use(PrimeVue, {
  theme: {
    preset: DiviPreset,
    options: {
      darkModeSelector: '.dark',
      cssLayer: {
        name: 'primevue',
        order: 'primevue, tailwind',
      },
    }
  },
  locale: {
    startsWith: 'Começa com',
    contains: 'Contém',
    notContains: 'Não contém',
    endsWith: 'Termina com',
    equals: 'Igual a',
    notEquals: 'Diferente de',
    noFilter: 'Sem filtro',
    lt: 'Menor que',
    lte: 'Menor ou igual a',
    gt: 'Maior que',
    gte: 'Maior ou igual a',
    dateIs: 'Data é',
    dateIsNot: 'Data não é',
    dateBefore: 'Data é anterior a',
    dateAfter: 'Data é posterior a',
    clear: 'Limpar',
    apply: 'Aplicar',
    matchAll: 'Corresponde a todos',
    matchAny: 'Corresponde a qualquer',
    addRule: 'Adicionar regra',
    removeRule: 'Remover regra',
    accept: 'Sim',
    reject: 'Não',
    choose: 'Escolher',
    upload: 'Upload',
    cancel: 'Cancelar',
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    weekHeader: 'Sem',
    firstDayOfWeek: 0,
    dateFormat: 'dd/mm/yy',
    weak: 'Fraco',
    medium: 'Médio',
    strong: 'Forte',
    passwordPrompt: 'Digite a senha',
    emptyMessage: 'Nenhuma opção disponível',
    emptyFilterMessage: 'Nenhuma opção disponível',
  }
})

app.mount('#app')
