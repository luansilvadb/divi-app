import re

with open('src/shared/components/organisms/PatrimonialChart.vue', 'r') as f:
    content = f.read()

content = content.replace('(context: Record<string, unknown>)', '(context: any)')
content = content.replace('const canvas = document.createElement(\'canvas\')', 'const canvas = document.createElement(\'canvas\') as any')

with open('src/shared/components/organisms/PatrimonialChart.vue', 'w') as f:
    f.write(content)
