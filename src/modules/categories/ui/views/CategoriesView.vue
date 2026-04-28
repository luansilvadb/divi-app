<template>
  <StandardPageLayout
    title="Categorias"
    highlight="Categorias"
    subtitle="Organize suas despesas com categorias visuais e intuitivas."
  >
    <template #action>
      <div class="flex items-center gap-3">
        <AppleButton variant="primary" size="medium" @click="openAddModal" id="btn-create-category">
          Nova Categoria
        </AppleButton>
      </div>
    </template>

    <div class="apple-categories-container">
      <main class="apple-main-content">
        <!-- Apple-style Empty State -->
        <div
          v-if="!categories || categories.length === 0"
          class="apple-empty-state"
        >
          <div class="apple-empty-icon">
            <i class="i-lucide-tag text-6xl text-[#0071e3]"></i>
          </div>
          <h3 class="apple-empty-title">Nenhuma categoria ainda</h3>
          <p class="apple-empty-description">
            Crie categorias para organizar suas transações e ter mais controle sobre seus gastos.
          </p>
          <AppleButton variant="primary" size="medium" @click="openAddModal">
            Criar Primeira Categoria
          </AppleButton>
        </div>

        <!-- Apple-style Category Cards -->
        <div v-else class="apple-category-grid">
          <div
            v-for="category in displayCategories"
            :key="category.id"
            class="apple-category-card"
            :style="{
              '--category-color': category.color,
              '--category-color-light': category.color + '15'
            }"
            @click="openEditModal(category)"
          >
            <div class="apple-card-icon">
              <i :class="category.icon" class="text-xl"></i>
            </div>
            <div class="apple-card-content">
              <h3 class="apple-card-title">{{ category.displayName }}</h3>
              <p v-if="category.parent_id" class="apple-card-subtitle">
                <i class="i-lucide-corner-down-right text-xs"></i>
                Subcategoria
              </p>
            </div>
            <div class="apple-card-chevron">
              <i class="i-lucide-chevron-right text-lg"></i>
            </div>
          </div>
        </div>
      </main>

      <!-- Apple-style Stats Panel -->
      <aside class="apple-stats-panel">
        <div class="apple-stat-card">
          <div class="apple-stat-header">
            <i class="i-lucide-grid-3x3 text-[#0071e3] text-xl"></i>
            <span class="apple-stat-label">Total de Categorias</span>
          </div>
          <div class="apple-stat-value">
            {{ categories?.length || 0 }}
          </div>
          <p class="apple-stat-description">
            {{ categories?.length === 1 ? '1 categoria criada' : `${categories?.length || 0} categorias criadas` }}
          </p>
        </div>
      </aside>
    </div>

    <!-- Modal Form -->
    <CategoryDialog
      :category="editingCategory"
      :show="showModal"
      :parent-options="parentOptions"
      @close="showModal = false"
      @saved="handleSave"
      @delete="handleDelete"
    />

    <!-- Mobile FAB Button -->
    <div
      v-if="isMobile"
      class="fixed bottom-24 right-6 z-50 md:hidden"
    >
      <AppleButton
        variant="primary"
        size="large"
        @click="openAddModal"
        class="!rounded-full !w-14 !h-14 !p-0 !shadow-lg"
      >
        <i class="i-lucide-plus text-xl"></i>
      </AppleButton>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  useMessage, useDialog
} from 'naive-ui'
import { useObservable } from '@vueuse/rxjs'
import { useService } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import AppleButton from '@/shared/components/apple-ui/AppleButton.vue'
import CategoryDialog from '@/shared/components/organisms/CategoryDialog.vue'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import type { CategoryService } from '../../application/services/CategoryService'
import type { Category } from '@/shared/domain/entities/Category'

const message = useMessage()
const dialog = useDialog()
const categoryService = useService<CategoryService>(DI_TOKENS.CategoryService)
const isMobile = useIsMobile()

// Subscribe to RxJS subject
const categories = useObservable(categoryService.categories$)

// Computed property to sanitize and transform category display data
const displayCategories = computed(() => {
  if (!categories.value) return []

  return categories.value.map(category => {
    // Check if name is a UUID or malformed
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category.name || '')
    const displayName = isUUID || !category.name || category.name.trim() === ''
      ? 'Sem Nome'
      : category.name

    return {
      ...category,
      displayName
    }
  })
})

onMounted(() => {
  categoryService.loadCategories()
})

const showModal = ref(false)
const isSaving = ref(false)
const editingCategory = ref<Category | null>(null)

const parentOptions = computed(() => {
  if (!categories.value) return []
  return categories.value
    .filter(c => c.id !== editingCategory.value?.id)
    .map(c => ({
      label: c.name,
      value: c.id
    }))
})

function openAddModal() {
  editingCategory.value = null
  showModal.value = true
}

function openEditModal(category: Category) {
  editingCategory.value = category
  showModal.value = true
}

async function handleSave(data: { name: string; color: string; icon: string; parent_id: string | null }) {
  if (!data.name) return
  isSaving.value = true
  try {
    if (editingCategory.value) {
      await categoryService.updateCategory(editingCategory.value.id, data)
      message.success('Categoria atualizada com sucesso!')
    } else {
      await categoryService.createCategory(data)
      message.success('Categoria criada com sucesso!')
    }
    showModal.value = false
  } catch (err) {
    console.error(err)
    message.error('Erro ao salvar categoria.')
  } finally {
    isSaving.value = false
  }
}

function handleDelete() {
  if (!editingCategory.value) return

  dialog.warning({
    title: 'Excluir Categoria',
    content: 'Tem certeza que deseja excluir esta categoria?',
    positiveText: 'Sim, excluir',
    negativeText: 'Cancelar',
    onPositiveClick: async () => {
      try {
        await categoryService.deleteCategory(editingCategory.value!.id)
        message.success('Categoria excluída.')
        showModal.value = false
      } catch {
        message.error('Erro ao excluir categoria.')
      }
    }
  })
}
</script>

<style scoped>
/* Apple Categories Container */
.apple-categories-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  padding: 4rem 0 2rem 0;
}

@media (min-width: 1024px) {
  .apple-categories-container {
    grid-template-columns: 1fr 360px;
    gap: 4rem;
  }
}

/* Apple Main Content */
.apple-main-content {
  min-height: 400px;
  padding-bottom: 2rem;
}

/* Apple Empty State */
.apple-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  animation: apple-fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.apple-empty-icon {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #f5f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.apple-empty-title {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;
}

.apple-empty-description {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
  font-size: 17px;
  color: #6e6e73;
  line-height: 1.47;
  margin: 0 0 2rem 0;
  max-width: 400px;
}

/* Apple Category Grid */
.apple-category-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  animation: apple-fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 640px) {
  .apple-category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .apple-category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.75rem;
  }
}

@media (min-width: 1280px) {
  .apple-category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

/* Apple Category Card */
.apple-category-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.apple-category-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--category-color);
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.apple-category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.08);
}

.apple-category-card:hover::before {
  opacity: 1;
}

.apple-category-card:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* Apple Card Icon */
.apple-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--category-color-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--category-color);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.apple-category-card:hover .apple-card-icon {
  transform: scale(1.05);
}

/* Apple Card Content */
.apple-card-content {
  flex: 1;
  min-width: 0;
}

.apple-card-title {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
  font-size: 17px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.01em;
  line-height: 1.24;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.apple-card-subtitle {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
  font-size: 13px;
  color: #6e6e73;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  line-height: 1.33;
}

/* Apple Card Chevron */
.apple-card-chevron {
  color: #c7c7cc;
  display: flex;
  align-items: center;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.apple-category-card:hover .apple-card-chevron {
  transform: translateX(2px);
  color: #8e8e93;
}

/* Apple Stats Panel */
.apple-stats-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 2rem;
  align-self: start;
}

@media (max-width: 1023px) {
  .apple-stats-panel {
    position: static;
  }
}

.apple-stat-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.apple-stat-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0;
}

.apple-stat-label {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #6e6e73;
  letter-spacing: -0.01em;
}

.apple-stat-value {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;
}

.apple-stat-description {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
  font-size: 14px;
  color: #6e6e73;
  margin: 0;
  line-height: 1.4;
  font-weight: 400;
}

/* Apple Animations */
@keyframes apple-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .apple-empty-icon {
    background: #2c2c2e;
  }

  .apple-empty-title,
  .apple-stat-value {
    color: #f5f5f7;
  }

  .apple-empty-description,
  .apple-stat-label {
    color: #8e8e93;
  }

  .apple-stat-description {
    color: #6e6e73;
  }

  /* Cards maintain light theme regardless of system preference */
  /* .apple-category-card and .apple-stat-card keep their default light styles */

  /* Card text colors remain optimized for light backgrounds */
  .apple-card-title {
    color: #1d1d1f;
  }

  .apple-card-subtitle {
    color: #6e6e73;
  }

  .apple-card-chevron {
    color: #c7c7cc;
  }

  .apple-category-card:hover .apple-card-chevron {
    color: #8e8e93;
  }
}
</style>
