/**
 * Shared navigation menu configuration for sidebar and mobile drawer.
 * Ensures consistent navigation across all device sizes.
 */
import type { RouteLocationRaw } from 'vue-router'

export interface NavMenuItem {
  label: string
  icon?: string
  route?: RouteLocationRaw
  action?: () => void
  badge?: string
  class?: string
  separator?: boolean
  component?: any
  props?: Record<string, any>
}

export interface NavMenuGroup {
  label: string
  items: NavMenuItem[]
}

export interface NavMenuSeparator {
  separator: true
}

export type NavMenuSection = NavMenuGroup | NavMenuSeparator

export function createMainNavigation(options: {
  onLogout?: () => void
}): (NavMenuSection | NavMenuItem)[] {
  const { onLogout } = options

  const items: (NavMenuSection | NavMenuItem)[] = [
    {
      label: 'Menu Principal',
      items: [
        { label: 'Dashboard', icon: 'pi pi-th-large', route: '/' },
        { label: 'Transações', icon: 'pi pi-arrow-right-arrow-left', route: '/transactions' },
        { label: 'Orçamentos', icon: 'pi pi-dollar', route: '/budgets' },
        { label: 'Metas', icon: 'pi pi-bullseye', route: '/goals' },
        { label: 'Empréstimos', icon: 'pi pi-credit-card', route: '/loans' },
        { label: 'Assinaturas', icon: 'pi pi-history', route: '/subscriptions' }
      ]
    },
    {
      label: 'Análise',
      items: [
        { label: 'Calendário', icon: 'pi pi-calendar', route: '/calendar' },
        { label: 'Relatórios', icon: 'pi pi-chart-line', route: '/reports' },
        { label: 'Atividades', icon: 'pi pi-file', route: '/activity-log' }
      ]
    },
    { separator: true }
  ]

  if (onLogout) {
    items.push({
      label: 'Sair',
      icon: 'pi pi-sign-out',
      class: 'text-error-main hover:bg-error-main/10',
      action: onLogout
    })
  }

  return items
}

/**
 * Simplified navigation for mobile bottom bar (max 4 items)
 */
export function createMobileBottomNav(options: {
  onOpenDrawer?: () => void
}): NavMenuItem[] {
  const { onOpenDrawer } = options

  return [
    { label: 'Dashboard', icon: 'pi pi-th-large', route: '/' },
    { label: 'Transações', icon: 'pi pi-arrow-right-arrow-left', route: '/transactions' },
    { label: 'Orçamentos', icon: 'pi pi-dollar', route: '/budgets' },
    { label: 'Mais', icon: 'pi pi-ellipsis-h', action: onOpenDrawer }
  ]
}
