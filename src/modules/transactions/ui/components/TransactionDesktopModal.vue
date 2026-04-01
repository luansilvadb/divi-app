<template>
  <TransactionForm :show="show" @close="$emit('close')" @saved="$emit('saved')" />
</template>

<script setup lang="ts">
import TransactionForm from '@/shared/components/organisms/TransactionForm.vue'

defineProps<{
  show: boolean
}>()

defineEmits(['close', 'saved'])
</script>
