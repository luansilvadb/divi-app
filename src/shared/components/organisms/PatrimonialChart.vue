<template>
  <div class="patrimonial-chart">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'
import type { ChartConfiguration, ScriptableContext } from 'chart.js'

const props = defineProps<{
  data: number[]
  labels: string[]
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

function initChart() {
  if (!chartRef.value) return

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: 'Patrimônio',
          data: props.data,
          borderColor: '#8b5cf6',
          borderWidth: 3,
          pointBackgroundColor: '#8b5cf6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          backgroundColor: (context: ScriptableContext<'line'>) => {
            const chart = context.chart
            const { ctx, chartArea } = chart
            if (!chartArea) return undefined
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
            gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)')
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0)')
            return gradient
          },
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#18181b',
          titleColor: '#fafafa',
          padding: 12,
          cornerRadius: 12,
          displayColors: false,
          callbacks: {
            label: (context) => {
              return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(context.parsed.y || 0)
            },
          },
        },
      },
      scales: {
        y: {
          grid: { color: 'rgba(161, 161, 170, 0.1)' },
          ticks: {
            color: '#a1a1aa',
            callback: (value) => `R$ ${Number(value) / 1000}k`,
          },
        },
        x: {
          grid: { display: false },
          ticks: { color: '#a1a1aa' },
        },
      },
    },
  }

  chartInstance = new Chart(ctx, config)
}

onMounted(initChart)

watch(
  () => props.data,
  (newData) => {
    if (chartInstance && chartInstance.data.datasets[0]) {
      chartInstance.data.datasets[0].data = newData
      chartInstance.data.labels = props.labels
      chartInstance.update()
    }
  },
  { deep: true },
)

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.patrimonial-chart {
  height: 100%;
  width: 100%;
}
</style>
