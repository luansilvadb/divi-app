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
  ],
})

// Auth Guard logic
let authInitialized = false
const authReady = new Promise<void>((resolve) => {
  const authService = container.resolve<IAuthService>('IAuthService')
  
  // First, check if we already have a session (sync/async)
  authService.getCurrentUser().then(() => {
    authInitialized = true
    resolve()
  }).catch(() => {
    authInitialized = true
    resolve()
  })

  // Also listen for change to be sure
  authService.onAuthStateChange(() => {
    if (!authInitialized) {
      authInitialized = true
      resolve()
    }
  })
})

router.beforeEach(async (to, _from) => {
  try {
    // If we have an access_token in hash, let Supabase process it (stay on current route/entry)
    const hasOAuthHash = window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('type=recovery'))
    if (hasOAuthHash) {
      console.debug('[Router] OAuth hash detected, bypassing immediate guard')
      // Wait a bit for Supabase to parse the URL fragments
      if (!authInitialized) await authReady
    }

    // Ensure auth state is resolved before first navigation
    if (!authInitialized) {
      await authReady
    }

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

export default router
