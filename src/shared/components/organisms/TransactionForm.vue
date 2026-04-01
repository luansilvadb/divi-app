<template>
  <component
    :is="isDesktop ? BaseModal : BaseBottomSheet"
    :show="show"
    @update:show="$emit('close')"
  >
    <template v-if="isDesktop">
      <BaseCard
        class="w-full shadow-[0_30px_70px_rgba(0,0,0,0.6)] border border-white/5 !bg-surface-main overflow-hidden flex flex-col relative"
        padding="none"
      >
        <TransactionFormContent @close="$emit('close')" @saved="$emit('saved')" />
      </BaseCard>
    </template>
    <template v-else>
      <TransactionFormContent @close="$emit('close')" @saved="$emit('saved')" />
    </template>
  </component>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import BaseModal from '@/shared/components/molecules/BaseModal.vue'
import BaseBottomSheet from '@/shared/components/molecules/BaseBottomSheet.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import TransactionFormContent from '@/shared/components/organisms/TransactionFormContent.vue'

defineProps<{
  show: boolean
}>()

defineEmits(['close', 'saved'])

const isDesktop = useMediaQuery('(min-width: 640px)')
</script>
