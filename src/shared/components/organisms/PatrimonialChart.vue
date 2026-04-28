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

// Get CSS variable value with fallback
function getCssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

// Get all theme colors for chart
function getChartColors() {
  const accentColor = getCssVar('--color-accent-main', '#8b5cf6')
  const surface100 = getCssVar('--color-surface-100', '#FFFFFF')
  const neutral2 = getCssVar('--color-neutral-2', 'rgba(0,0,0,0.6)')
  const isDark = document.documentElement.classList.contains('dark')

  // Tooltip background based on theme
  const tooltipBg = isDark ? 'rgba(44, 44, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)'
  const tooltipTitleColor = neutral2
  const tooltipBodyColor = isDark ? '#FFFFFF' : '#000000'

  return {
    accentColor,
    surface100,
    neutral2,
    tooltipBg,
    tooltipTitleColor,
    tooltipBodyColor,
    isDark,
  }
}

function initChart() {
  if (!chartRef.value) return

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  const colors = getChartColors()

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: 'Patrimônio',
          data: props.data,
          borderColor: colors.accentColor,
          borderWidth: 4,
          pointBackgroundColor: colors.isDark ? '#2C2C2E' : '#FFFFFF',
          pointBorderColor: colors.accentColor,
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
            const accentRgb = hexToRgba(colors.accentColor, 0.4)
            const accentRgbLight = hexToRgba(colors.accentColor, 0.1)
            gradient.addColorStop(0, accentRgb)
            gradient.addColorStop(0.5, accentRgbLight)
            gradient.addColorStop(1, hexToRgba(colors.accentColor, 0.0))
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
          backgroundColor: colors.tooltipBg,
          titleColor: colors.tooltipTitleColor,
          titleFont: { size: 13, weight: 'normal' },
          bodyColor: colors.tooltipBodyColor,
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
            color: colors.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            drawTicks: false,
          },
          ticks: {
            color: colors.neutral2,
            padding: 12,
            font: { size: 12, family: 'Inter, sans-serif' },
            callback: (value) => `R$ ${Number(value) / 1000}k`,
          },
        },
        x: {
          border: { display: false },
          grid: { display: false },
          ticks: {
            color: colors.neutral2,
            padding: 12,
            font: { size: 12, family: 'Inter, sans-serif' },
          },
        },
      },
    },
  }

  chartInstance = new Chart(ctx, config)
}

// Helper to convert hex to rgba
function hexToRgba(hex: string, alpha: number): string {
  // Handle rgba() format
  if (hex.startsWith('rgba')) return hex
  // Handle rgb() format
  if (hex.startsWith('rgb(')) {
    const values = hex.match(/\d+/g)
    if (values) return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`
  }
  // Handle hex
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Update chart colors when theme changes
function updateChartTheme() {
  if (!chartInstance) return

  const colors = getChartColors()
  const dataset = chartInstance.data.datasets[0] as {
    borderColor?: string
    pointBorderColor?: string
    pointBackgroundColor?: string
  } | undefined

  if (dataset) {
    dataset.borderColor = colors.accentColor
    dataset.pointBorderColor = colors.accentColor
    dataset.pointBackgroundColor = colors.isDark ? '#2C2C2E' : '#FFFFFF'
  }

  const options = chartInstance.options
  if (options.plugins?.tooltip) {
    options.plugins.tooltip.backgroundColor = colors.tooltipBg
    options.plugins.tooltip.titleColor = colors.tooltipTitleColor
    options.plugins.tooltip.bodyColor = colors.tooltipBodyColor
  }
  if (options.scales?.y) {
    options.scales.y.grid = { ...options.scales.y.grid, color: colors.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }
    options.scales.y.ticks = { ...options.scales.y.ticks, color: colors.neutral2 }
  }
  if (options.scales?.x) {
    options.scales.x.ticks = { ...options.scales.x.ticks, color: colors.neutral2 }
  }

  chartInstance.update('none') // Update without animation
}

onMounted(() => {
  initChart()
  // Listen for theme changes
  window.addEventListener('storage', handleStorageChange)
})

function handleStorageChange(e: StorageEvent) {
  if (e.key === 'divi-ui-theme') {
    // Small delay to allow theme injector to update CSS vars
    setTimeout(updateChartTheme, 50)
  }
}

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
  window.removeEventListener('storage', handleStorageChange)
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
