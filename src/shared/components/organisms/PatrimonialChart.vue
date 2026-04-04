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
import type { ChartOptions, ScriptableContext, TooltipItem, Scale } from 'chart.js'
import { Line } from 'vue-chartjs'

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
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        backgroundColor: (context: any) => {
          const chart = context.chart
          const { ctx, chartArea } = chart
          if (!chartArea) return null
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

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
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
        label: (context: any) => {
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(context.parsed.y)
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
        font: { size: 10, weight: 'bold' },
        padding: 10,
        callback: (value: any) => {
          if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)} mil`
          return `R$ ${value}`
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
        font: { size: 10, weight: 'bold' },
        padding: 5,
      },
    },
  },
}
</script>

<style scoped>
.patrimonial-chart {
  height: 100%;
  min-height: 250px;
  width: 100%;
}
</style>
