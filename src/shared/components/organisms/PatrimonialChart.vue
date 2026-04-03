<template>
  <div class="patrimonial-chart">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import type { ChartOptions, ScriptableContext } from 'chart.js'
import { Line } from 'vue-chartjs'
import { useIsMobile } from '@/shared/composables/useIsMobile'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

const isMobile = useIsMobile()

const props = defineProps<{
  data: number[]
  labels: string[]
}>()

const chartData = computed(() => {
  return {
    labels: props.labels,
    datasets: [
      {
        label: 'Patrimônio',
        data: props.data,
        borderColor: '#3D5A80',
        borderWidth: 3,
        pointBackgroundColor: '#3D5A80',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: isMobile.value ? 5 : 4,
        pointHoverRadius: isMobile.value ? 8 : 6,
        hitRadius: isMobile.value ? 20 : 10,
        fill: true,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const chart = context.chart
          const { ctx, chartArea } = chart
          if (!chartArea) return undefined
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, 'rgba(61, 90, 128, 0.4)')
          gradient.addColorStop(1, 'rgba(61, 90, 128, 0)')
          return gradient
        },
        tension: 0.4,
      },
    ],
  }
})

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: isMobile.value
      ? { left: 0, right: 8, top: 10, bottom: 0 }
      : { left: 0, right: 0, top: 0, bottom: 0 },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: '#161b22',
      titleColor: '#f0f6fc',
      titleFont: { size: 13, weight: 'bold' },
      bodyColor: '#8b949e',
      bodyFont: { size: 12 },
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      cornerRadius: 12,
      callbacks: {
        label: (context) => {
          const val = context.parsed.y
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(val || 0)
        },
      },
    },
  },
  scales: {
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
      },
      border: { display: false },
      ticks: {
        color: '#8b949e',
        font: { size: isMobile.value ? 11 : 10, weight: 'bold' },
        padding: 10,
        callback: (value) => {
          const numericValue = Number(value)
          if (isNaN(numericValue)) return ''
          if (numericValue >= 1000) return `R$ ${(numericValue / 1000).toFixed(1)} mil`
          return `R$ ${numericValue}`
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      border: { display: false },
      ticks: {
        color: '#8b949e',
        font: { size: isMobile.value ? 11 : 10, weight: 'bold' },
        padding: 5,
      },
    },
  },
}))
</script>

<style scoped>
.patrimonial-chart {
  height: 100%;
  width: 100%;
}
</style>
