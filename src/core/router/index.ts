import { createRouter, createWebHistory } from 'vue-router'
import { container } from '../di'
import type { IAuthService } from '../../modules/auth/domain/contracts/IAuthService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../../modules/dashboard/ui/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../../modules/transactions/ui/views/TransactionsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/budgets',
      name: 'budgets',
      component: () => import('../../modules/budgets/ui/views/BudgetsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/goals',
      name: 'goals',
      component: () => import('../../modules/goals/ui/views/GoalsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/loans',
      name: 'loans',
      component: () => import('../../modules/loans/ui/views/LoansView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: () => import('../../modules/subscriptions/ui/views/SubscriptionsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../../modules/calendar/ui/views/CalendarView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../../modules/reports/ui/views/ReportsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/activity-log',
      name: 'activity-log',
      component: () => import('../../modules/activity-log/ui/views/ActivityLogView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../../modules/auth/ui/views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../../modules/auth/ui/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../../modules/settings/ui/views/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Auth Guard logic
router.beforeEach(async (to, _from) => {
  try {
    const authService = container.resolve<IAuthService>('IAuthService')
    const user = await authService.getCurrentUser()

    if (to.meta.requiresAuth && !user) {
      return { name: 'login' }
    } else if (to.meta.guestOnly && user) {
      return { name: 'dashboard' }
    } else {
      return true
    }
  } catch (e) {
    console.error('Router Auth Guard Error:', e)
    return true
  }
})

// Navigation Error Handler (Critical for Offline/PWA)
router.onError((error, to) => {
  if (error.message.includes('Failed to fetch dynamically imported module') || error.message.includes('Importing a shadowed module')) {
    console.error(`[Router] Falha ao carregar a página "${String(to.name)}" devido à falta de conexão.`, error)
    // Aqui poderíamos redirecionar para uma página de "Offline" customizada se desejado
  } else {
    console.error('[Router] Erro inesperado na navegação:', error)
  }
})

export default router

