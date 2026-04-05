"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMainNavigation = createMainNavigation;
exports.createMobileBottomNav = createMobileBottomNav;
function createMainNavigation(options) {
    var onLogout = options.onLogout;
    var items = [
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
    ];
    if (onLogout) {
        items.push({
            label: 'Sair',
            icon: 'pi pi-sign-out',
            class: 'text-error-main hover:bg-error-main/10',
            action: onLogout
        });
    }
    return items;
}
/**
 * Simplified navigation for mobile bottom bar (max 4 items)
 */
function createMobileBottomNav(options) {
    var onOpenDrawer = options.onOpenDrawer;
    return [
        { label: 'Dashboard', icon: 'pi pi-th-large', route: '/' },
        { label: 'Transações', icon: 'pi pi-arrow-right-arrow-left', route: '/transactions' },
        { label: 'Orçamentos', icon: 'pi pi-dollar', route: '/budgets' },
        { label: 'Mais', icon: 'pi pi-ellipsis-h', action: onOpenDrawer }
    ];
}
