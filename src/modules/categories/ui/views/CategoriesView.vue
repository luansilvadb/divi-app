<template>
  <StandardPageLayout
    title="Categorias Custo-Métricas"
    highlight="Categorias"
    subtitle="Classifique e entenda o direcionamento do seu patrimônio."
  >
    <template #action>
      <NButton type="primary" round @click="openAddModal" id="btn-create-category">
        <template #icon><i class="i-lucide-plus"></i></template>
        Nova Categoria
      </NButton>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <main class="lg:col-span-2 space-y-6">
        <NEmpty
          v-if="!categories || categories.length === 0"
          description="Nenhuma categoria configurada."
          class="py-24"
        >
          <template #icon>
            <i class="i-lucide-tag text-5xl text-violet-500/40"></i>
          </template>
        </NEmpty>
        
        <NGrid
          v-else
          cols="1 640:2"
          :x-gap="20"
          :y-gap="20"
          responsive="screen"
          item-responsive
        >
          <NGridItem v-for="category in categories" :key="category.id">
            <NCard size="small" hoverable class="h-full relative overflow-hidden" @click="openEditModal(category)">
              <div 
                class="absolute left-0 top-0 bottom-0 w-1.5" 
                :style="{ backgroundColor: category.color }"
              ></div>
              <div class="flex items-center gap-3 pl-2">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center bg-surface-200/50"
                  :style="{ color: category.color }"
                >
                  <i :class="category.icon" class="text-xl"></i>
                </div>
                <div>
                  <div class="font-inter font-semibold text-base">{{ category.name }}</div>
                  <div v-if="category.parent_id" class="text-xs text-secondary-500 flex items-center gap-1">
                    <i class="i-lucide-corner-down-right"></i> Subcategoria
                  </div>
                </div>
              </div>
            </NCard>
          </NGridItem>
        </NGrid>
      </main>

      <aside class="side-column space-y-6">
        <NCard>
          <template #header><NText strong>Total de Categorias</NText></template>
          <div class="font-jetbrains text-3xl font-bold tabular-nums text-primary-400">
            {{ categories?.length || 0 }}
          </div>
        </NCard>
      </aside>
    </div>

    <!-- Modal Form -->
    <NModal v-model:show="showModal" preset="card" :title="isSubmittingEdit ? 'Editar Categoria' : 'Nova Categoria'" style="width: 420px">
      <NForm ref="formRef" :model="formModel" :rules="formRules" @submit.prevent="handleSave">
        <NFormItem label="Nome" path="name">
          <NInput v-model:value="formModel.name" id="input-category-name" placeholder="Ex: Mercado, Viagem..." />
        </NFormItem>

        <div class="grid grid-cols-2 gap-4">
          <NFormItem label="Cor Tática" path="color">
            <NColorPicker v-model:value="formModel.color" :swatches="swatches" />
          </NFormItem>
          
          <NFormItem label="Ícone" path="icon">
            <NSelect v-model:value="formModel.icon" :options="iconOptions" />
          </NFormItem>
        </div>

        <NFormItem label="Subcategoria de (Opcional)" path="parent_id">
          <NSelect 
            v-model:value="formModel.parent_id" 
            :options="parentOptions" 
            clearable 
            placeholder="Nenhuma (Raiz)"
          />
        </NFormItem>

        <div class="flex justify-between mt-6">
          <NButton 
            v-if="isSubmittingEdit" 
            type="error" 
            ghost 
            @click="handleDelete"
            class="mr-auto"
          >
            Excluir
          </NButton>
          <div class="flex gap-3 justify-end flex-grow">
            <NButton @click="showModal = false">Cancelar</NButton>
            <NButton type="primary" attr-type="submit" :loading="isSaving" id="btn-save-category">
              Salvar
            </NButton>
          </div>
        </div>
      </NForm>
    </NModal>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  NButton, NCard, NText, NEmpty, NGrid, NGridItem, NModal, NForm, NFormItem, NInput, NSelect, NColorPicker, useMessage, useDialog
} from 'naive-ui'
import { useObservable } from '@vueuse/rxjs'
import { useService } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import type { CategoryService } from '../../application/services/CategoryService'
import type { Category } from '@/shared/domain/entities/Category'

const message = useMessage()
const dialog = useDialog()
const categoryService = useService<CategoryService>(DI_TOKENS.CategoryService)

// Subscribe to RxJS subject
const categories = useObservable(categoryService.categories$)

onMounted(() => {
  categoryService.loadCategories()
})

// Options for the form
const swatches = [
  '#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#34d399', '#2dd4bf', '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa', '#e879f9', '#f472b6', '#fb7185'
]

const iconOptions = [
  { label: '🛒 Carrinho', value: 'i-lucide-shopping-cart' },
  { label: '🍽️ Talheres', value: 'i-lucide-utensils' },
  { label: '🚌 Ônibus', value: 'i-lucide-bus' },
  { label: '🚗 Carro', value: 'i-lucide-car' },
  { label: '🎟️ Lazer', value: 'i-lucide-ticket' },
  { label: '🏠 Casa', value: 'i-lucide-home' },
  { label: '❤️ Saúde', value: 'i-lucide-heart' },
  { label: '🎓 Estudo', value: 'i-lucide-graduation-cap' },
  { label: '📱 Conta', value: 'i-lucide-smartphone' },
  { label: '🐕 Pet', value: 'i-lucide-dog' },
  { label: '💼 Trabalho', value: 'i-lucide-briefcase' },
  { label: '🏷️ Tag G.', value: 'i-lucide-tag' },
]

const parentOptions = computed(() => {
  if (!categories.value) return []
  // Avoid self-parenting logic filtering could go here, for now list all
  return categories.value
    .filter(c => c.id !== editingId.value)
    .map(c => ({
      label: c.name,
      value: c.id
    }))
})

const showModal = ref(false)
const isSaving = ref(false)
const isSubmittingEdit = ref(false)
const editingId = ref<string | null>(null)

const formModel = ref({
  name: '',
  color: '#3b82f6',
  icon: 'i-lucide-tag',
  parent_id: null as string | null
})

const formRules = {
  name: { required: true, message: 'O nome é obrigatório' },
}

function openAddModal() {
  editingId.value = null
  isSubmittingEdit.value = false
  formModel.value = {
    name: '',
    color: swatches[Math.floor(Math.random() * swatches.length)] || '#3b82f6',
    icon: 'i-lucide-tag',
    parent_id: null
  }
  showModal.value = true
}

function openEditModal(category: Category) {
  editingId.value = category.id
  isSubmittingEdit.value = true
  formModel.value = {
    name: category.name,
    color: category.color,
    icon: category.icon,
    parent_id: category.parent_id || null
  }
  showModal.value = true
}

async function handleSave() {
  if (!formModel.value.name) return
  isSaving.value = true
  try {
    if (isSubmittingEdit.value && editingId.value) {
      await categoryService.updateCategory(editingId.value, {
        name: formModel.value.name,
        icon: formModel.value.icon,
        color: formModel.value.color,
        parent_id: formModel.value.parent_id
      })
      message.success('Categoria atualizada com sucesso!')
    } else {
      await categoryService.createCategory({
        name: formModel.value.name,
        icon: formModel.value.icon,
        color: formModel.value.color,
        parent_id: formModel.value.parent_id
      })
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
  if (!editingId.value) return
  
  dialog.warning({
    title: 'Excluir Categoria',
    content: 'Tem certeza que deseja excluir esta categoria?',
    positiveText: 'Sim, excluir',
    negativeText: 'Cancelar',
    onPositiveClick: async () => {
      try {
        await categoryService.deleteCategory(editingId.value!)
        message.success('Categoria excluída.')
        showModal.value = false
      } catch (err) {
        message.error('Erro ao excluir categoria.')
      }
    }
  })
}
</script>
