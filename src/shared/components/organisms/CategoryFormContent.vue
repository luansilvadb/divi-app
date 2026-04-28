<template>
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
        @click="$emit('delete')"
        class="mr-auto"
      >
        Excluir
      </NButton>
      <div class="flex gap-3 justify-end flex-grow">
        <AppleButton variant="secondary" size="medium" @click="$emit('close')">
          Cancelar
        </AppleButton>
        <AppleButton
          variant="primary"
          size="medium"
          attr-type="submit"
          :loading="isSaving"
          id="btn-save-category"
        >
          Salvar
        </AppleButton>
      </div>
    </div>
  </NForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NForm, NFormItem, NInput, NSelect, NColorPicker, NButton } from 'naive-ui'
import AppleButton from '@/shared/components/apple-ui/AppleButton.vue'
import type { Category } from '@/shared/domain/entities/Category'

const props = defineProps<{
  initialData?: Category | null
  parentOptions: Array<{ label: string; value: string }>
  isSubmittingEdit: boolean
}>()

const emit = defineEmits(['close', 'saved', 'delete'])

const formRef = ref()
const isSaving = ref(false)

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

const formModel = ref({
  name: '',
  color: '#3b82f6',
  icon: 'i-lucide-tag',
  parent_id: null as string | null
})

const formRules = {
  name: { required: true, message: 'O nome é obrigatório' },
}

// Initialize form model when data changes
if (props.initialData) {
  formModel.value = {
    name: props.initialData.name,
    color: props.initialData.color,
    icon: props.initialData.icon,
    parent_id: props.initialData.parent_id || null
  }
} else {
  formModel.value = {
    name: '',
    color: swatches[Math.floor(Math.random() * swatches.length)] || '#3b82f6',
    icon: 'i-lucide-tag',
    parent_id: null
  }
}

async function handleSave() {
  if (!formModel.value.name) return
  isSaving.value = true
  try {
    emit('saved', { ...formModel.value })
  } catch (err) {
    console.error(err)
  } finally {
    isSaving.value = false
  }
}
</script>
