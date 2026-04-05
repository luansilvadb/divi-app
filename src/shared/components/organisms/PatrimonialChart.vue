<template>
  <div class="patrimonial-chart">
    <Chart type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Chart from 'primevue/chart'
import type { ScriptableContext, TooltipItem } from 'chart.js'
import { useTheme } from '@/core/theme'

const props = defineProps<{
  data: number[]
  labels: string[]
}>()

const { isDark } = useTheme()

// Memoized formatters for better performance
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const thousandsFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  compactDisplay: 'short',
})

// Cache gradient to avoid recreation on every render
const gradientCache = ref<{ dark: boolean; gradient: any } | null>(null)

const getGradient = (context: ScriptableContext<'line'>) => {
  const chart = context.chart
  const { ctx, chartArea } = chart
  if (!chartArea) return undefined

  // Return cached gradient if theme hasn't changed
  if (gradientCache.value && gradientCache.value.dark === isDark.value) {
    return gradientCache.value.gradient
  }

  const stopColorStart = isDark.value ? 'rgba(74, 111, 165, 0.4)' : 'rgba(61, 91, 135, 0.4)'
  const stopColorEnd = isDark.value ? 'rgba(74, 111, 165, 0)' : 'rgba(61, 91, 135, 0)'

  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
  gradient.addColorStop(0, stopColorStart)
  gradient.addColorStop(1, stopColorEnd)

  // Update cache
  gradientCache.value = { dark: isDark.value, gradient }

  return gradient
}

const chartData = computed(() => {
  const primaryColor = isDark.value ? '#4a6fa5' : '#3d5b87'

  return {
    labels: props.labels,
    datasets: [
      {
        label: 'Patrimônio',
        data: props.data,
        borderColor: primaryColor,
        borderWidth: 3,
        pointBackgroundColor: primaryColor,
        pointBorderColor: isDark.value ? '#0e1219' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        backgroundColor: getGradient,
        tension: 0.4,
      },
    ],
  }
})

const chartOptions = computed(() => {
  const textColor = isDark.value ? '#94a3b8' : '#475569'
  const gridColor = isDark.value ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
  const tooltipBg = isDark.value ? '#0e1219' : '#ffffff'
  const tooltipText = isDark.value ? '#f0f6fc' : '#1a2333'
  const tooltipBorder = isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        titleFont: { size: 13, weight: 'bold' },
        bodyColor: textColor,
        bodyFont: { size: 12 },
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        cornerRadius: 12,
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            return currencyFormatter.format(context.parsed.y || 0)
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: gridColor,
        },
        border: { display: false },
        ticks: {
          color: textColor,
          font: { size: 10, weight: 'bold' },
          padding: 10,
          callback: (value: string | number) => {
            const numValue = Number(value)
            if (numValue >= 1000) {
              return thousandsFormatter.format(numValue)
            }
            return currencyFormatter.format(numValue)
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        border: { display: false },
        ticks: {
          color: textColor,
          font: { size: 10, weight: 'bold' },
          padding: 5,
        },
      },
    },
  }
})
</script>

<style scoped>
.patrimonial-chart {
  height: 100%;
  min-height: 250px;
  width: 100%;
}
</style>
