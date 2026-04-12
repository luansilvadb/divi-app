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
          borderColor: '#8b5cf6', // Violeta intenso (marca principal)
          borderWidth: 4, // Linha um pouco mais grossa para mais presença
          pointBackgroundColor: '#18181b', // Fundo escuro do hover
          pointBorderColor: '#8b5cf6', // Borda do ponto igual a cor da linha
          pointBorderWidth: 3,
          pointRadius: 0, // Remove os pontos no estado inativo (linha limpa)
          pointHoverRadius: 7, // Ponto magnético lindíssimo no mouseover
          fill: true,
          backgroundColor: (context: ScriptableContext<'line'>) => {
            const chart = context.chart
            const { ctx, chartArea } = chart
            if (!chartArea) return undefined
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
            gradient.addColorStop(0, 'rgba(139, 92, 246, 0.4)') // Topo mais vivo
            gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.1)') // Transição suave
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0.0)') // Chão invisível
            return gradient
          },
          tension: 0.45, // Curva mais orgânica (spline)
          cubicInterpolationMode: 'monotone', // Evita "overshoots"
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index', // Ativa o tooltip em qualquer lugar da coluna (magnético)
        intersect: false, // Não precisa bater o mouse cirurgicamente no ponto
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(24, 24, 27, 0.85)', // Glassmorphism escuro
          titleColor: '#a1a1aa', // Subtitulo prateado discreto
          titleFont: { size: 13, weight: 'normal' },
          bodyColor: '#ffffff', // Valor principal gritante
          bodyFont: { size: 16, weight: 'bold' },
          padding: 16,
          cornerRadius: 16, // Arredondamento premium
          displayColors: false,
          callbacks: {
            label: (context) => {
              return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(context.parsed.y || 0)
            },
            title: (tooltipItems) => {
              // Mudei para retornar o mes limpo se necessário
              return tooltipItems[0].label;
            }
          },
        },
      },
      scales: {
        y: {
          border: { display: false }, // Oculta a espinha vertical do eixo Y
          grid: { 
            color: 'rgba(161, 161, 170, 0.15)', // Grade muito suave
            drawTicks: false, // Desliga os tracinhos de eixo
          }, 
          ticks: {
            color: '#a1a1aa',
            padding: 12, // Afasta o texto do grafico
            font: { size: 12, family: 'Inter, sans-serif' },
            callback: (value) => `R$ ${Number(value) / 1000}k`,
          },
        },
        x: {
          border: { display: false }, // Oculta a espinha vertical inferior 
          grid: { display: false }, // Zero linhas verticais pelo fundo
          ticks: { 
            color: '#a1a1aa',
            padding: 12,
            font: { size: 12, family: 'Inter, sans-serif' },
          },
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
