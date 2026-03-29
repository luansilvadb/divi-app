import { createRouter, createWebHistory } from 'vue-router'
import { container } from '../di'
import type { IAuthService } from '../../modules/finance/domain/services/IAuthService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../../modules/finance/ui/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../../modules/finance/ui/views/TransactionsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/budgets',
      name: 'budgets',
      component: () => import('../../modules/finance/ui/views/BudgetsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/goals',
      name: 'goals',
      component: () => import('../../modules/finance/ui/views/GoalsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/loans',
      name: 'loans',
      component: () => import('../../modules/finance/ui/views/LoansView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: () => import('../../modules/finance/ui/views/SubscriptionsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../../modules/finance/ui/views/CalendarView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../../modules/finance/ui/views/ReportsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/activity-log',
      name: 'activity-log',
      component: () => import('../../modules/finance/ui/views/ActivityLogView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../../modules/finance/ui/views/LoginView.vue'),
      meta: { guestOnly: true }
    }
  ]
})

// Auth Guard logic
router.beforeEach(async (to, _from, next) => {
  try {
    const authService = container.resolve<IAuthService>('IAuthService')
    const user = await authService.getCurrentUser()

    if (to.meta.requiresAuth && !user) {
      next({ name: 'login' })
    } else if (to.meta.guestOnly && user) {
      next({ name: 'dashboard' })
    } else {
      next()
    }
  } catch (e) {
    console.error('Router Auth Guard Error:', e)
    next()
  }
})

export default router
