import re

with open('src/shared/components/organisms/PatrimonialChart.vue', 'r') as f:
    content = f.read()

content = content.replace('context: any', 'context: Record<string, unknown>')
content = content.replace('const canvas = document.createElement(\'canvas\') as any', 'const canvas = document.createElement(\'canvas\')')

with open('src/shared/components/organisms/PatrimonialChart.vue', 'w') as f:
    f.write(content)
