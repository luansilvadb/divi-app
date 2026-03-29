<template>
  <aside class="divi-sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-text">Divi</span>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <RouterLink to="/" class="nav-item" active-class="active">
        <span class="nav-icon">📊</span>
        <span class="nav-label">Dashboard</span>
      </RouterLink>
      
      <RouterLink to="/transactions" class="nav-item" active-class="active">
        <span class="nav-icon">💸</span>
        <span class="nav-label">Transactions</span>
      </RouterLink>

      <RouterLink to="/budgets" class="nav-item" active-class="active">
        <span class="nav-icon">🎯</span>
        <span class="nav-label">Budgets</span>
      </RouterLink>

      <RouterLink to="/goals" class="nav-item" active-class="active">
        <span class="nav-icon">🏆</span>
        <span class="nav-label">Goals</span>
      </RouterLink>

      <RouterLink to="/loans" class="nav-item" active-class="active">
        <span class="nav-icon">🏛️</span>
        <span class="nav-label">Loans</span>
      </RouterLink>

      <RouterLink to="/subscriptions" class="nav-item" active-class="active">
        <span class="nav-icon">📅</span>
        <span class="nav-label">Subscriptions</span>
      </RouterLink>

      <RouterLink to="/calendar" class="nav-item" active-class="active">
        <span class="nav-icon">🗓️</span>
        <span class="nav-label">Calendar</span>
      </RouterLink>

      <RouterLink to="/reports" class="nav-item" active-class="active">
        <span class="nav-icon">📈</span>
        <span class="nav-label">Reports</span>
      </RouterLink>

      <RouterLink to="/activity-log" class="nav-item" active-class="active">
        <span class="nav-icon">📑</span>
        <span class="nav-label">Activity Log</span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <button @click="$emit('logout')" class="logout-btn">
        <span class="nav-icon">🚪</span>
        <span class="nav-label">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineEmits(['logout'])

const isCollapsed = ref(false)
</script>

<style scoped>
.divi-sidebar {
  width: 260px;
  height: 100vh;
  background: #1f2937;
  color: #f3f4f6;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  position: sticky;
  top: 0;
}
.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #374151;
}
.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;
}
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}
.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #9ca3af;
  text-decoration: none;
  transition: all 0.2s;
}
.nav-item:hover {
  background: #374151;
  color: #f3f4f6;
}
.nav-item.active {
  background: #111827;
  color: #10b981;
  border-left: 4px solid #10b981;
}
.nav-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
}
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #374151;
}
.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.75rem 0.5rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: background 0.2s;
}
.logout-btn:hover {
  background: #374151;
  color: #ef4444;
}

@media (max-width: 768px) {
  .divi-sidebar {
    width: 70px;
  }
  .nav-label, .logo-text, .sidebar-header span {
    display: none;
  }
  .nav-item {
    padding: 1rem;
    justify-content: center;
  }
  .nav-icon {
    margin-right: 0;
  }
}
</style>
