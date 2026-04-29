<template>
  <div class="patrimonial-chart">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'
import type { ChartConfiguration, ScriptableContext } from 'chart.js'
import { useChartTheme } from '@/shared/composables/useChartTheme'
import { messages } from '@/shared/messages/catalog'

const props = defineProps<{
  data: number[]
  labels: string[]
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const { colors, hexToRgba } = useChartTheme()

function initChart() {
  if (!chartRef.value) return

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  const currentColors = colors.value

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: messages.MSG_I_PATRIMONY,
          data: props.data,
          borderColor: currentColors.accentColor,
          borderWidth: 4,
          pointBackgroundColor: currentColors.pointBg,
          pointBorderColor: currentColors.accentColor,
          pointBorderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 7,
          fill: true,
          backgroundColor: (context: ScriptableContext<'line'>) => {
            const chart = context.chart
            const { ctx, chartArea } = chart
            if (!chartArea) return undefined
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
            // Parse accent color to rgba for gradient
            const accentRgb = hexToRgba(currentColors.accentColor, 0.4)
            const accentRgbLight = hexToRgba(currentColors.accentColor, 0.1)
            gradient.addColorStop(0, accentRgb)
            gradient.addColorStop(0.5, accentRgbLight)
            gradient.addColorStop(1, hexToRgba(currentColors.accentColor, 0.0))
            return gradient
          },
          tension: 0.45,
          cubicInterpolationMode: 'monotone',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: currentColors.tooltipBg,
          titleColor: currentColors.tooltipTitleColor,
          titleFont: { size: 13, weight: 'normal' },
          bodyColor: currentColors.tooltipBodyColor,
          bodyFont: { size: 16, weight: 'bold' },
          padding: 16,
          cornerRadius: 12,
          displayColors: false,
          callbacks: {
            label: (context) => {
              return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(context.parsed.y || 0)
            },
            title: (tooltipItems) => {
              return tooltipItems[0]?.label || ''
            }
          },
        },
      },
      scales: {
        y: {
          border: { display: false },
          grid: {
            color: currentColors.gridColor,
            drawTicks: false,
          },
          ticks: {
            color: currentColors.neutral2,
            padding: 12,
            font: { size: 12, family: 'Inter, sans-serif' },
            callback: (value) => `R$ ${Number(value) / 1000}k`,
          },
        },
        x: {
          border: { display: false },
          grid: { display: false },
          ticks: {
            color: currentColors.neutral2,
            padding: 12,
            font: { size: 12, family: 'Inter, sans-serif' },
          },
        },
      },
    },
  }

  chartInstance = new Chart(ctx, config)
}

// Update chart colors when theme changes
function updateChartTheme() {
  if (!chartInstance) return

  const currentColors = colors.value
  const dataset = chartInstance.data.datasets[0] as {
    borderColor?: string
    pointBorderColor?: string
    pointBackgroundColor?: string
  } | undefined

  if (dataset) {
    dataset.borderColor = currentColors.accentColor
    dataset.pointBorderColor = currentColors.accentColor
    dataset.pointBackgroundColor = currentColors.pointBg
  }

  const options = chartInstance.options
  if (options.plugins?.tooltip) {
    options.plugins.tooltip.backgroundColor = currentColors.tooltipBg
    options.plugins.tooltip.titleColor = currentColors.tooltipTitleColor
    options.plugins.tooltip.bodyColor = currentColors.tooltipBodyColor
  }
  if (options.scales?.y) {
    options.scales.y.grid = { ...options.scales.y.grid, color: currentColors.gridColor }
    options.scales.y.ticks = { ...options.scales.y.ticks, color: currentColors.neutral2 }
  }
  if (options.scales?.x) {
    options.scales.x.ticks = { ...options.scales.x.ticks, color: currentColors.neutral2 }
  }

  chartInstance.update('none') // Update without animation
}

onMounted(() => {
  initChart()
})

watch(colors, () => {
  updateChartTheme()
})

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
