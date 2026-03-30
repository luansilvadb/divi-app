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
import type { ChartOptions } from 'chart.js'
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

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Patrimonial Growth',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: '#10b981',
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#10b981',
      fill: true,
      tension: 0.4,
      data: props.data,
    },
  ],
}))

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      backgroundColor: '#1f2937',
      titleColor: '#f3f4f6',
      bodyColor: '#f3f4f6',
      borderColor: '#374151',
      borderWidth: 1,
      padding: 10,
      displayColors: false,
      callbacks: {
        label: (context: { raw: unknown, dataset: { label?: string }, parsed: { y: number | null } }) => {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              context.parsed.y,
            )
          }
          return label
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#f3f4f6',
      },
      ticks: {
        color: '#9ca3af',
        callback: (value: number | string) => {
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumSignificantDigits: 3,
          }).format(Number(value))
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#9ca3af',
      },
    },
  },
}
</script>

<style scoped>
.patrimonial-chart {
  height: 300px;
  width: 100%;
}
</style>
