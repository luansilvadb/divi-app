with open('src/shared/components/organisms/PatrimonialChart.vue', 'r') as f:
    content = f.read()

content = content.replace("import type { ChartOptions, ScriptableContext, TooltipItem } from 'chart.js'\n", "")
content = content.replace("import { computed } from 'vue'\nimport Chart from 'primevue/chart'", "import { computed } from 'vue'\nimport Chart from 'primevue/chart'\nimport type { ChartOptions, ScriptableContext, TooltipItem } from 'chart.js'")

with open('src/shared/components/organisms/PatrimonialChart.vue', 'w') as f:
    f.write(content)
