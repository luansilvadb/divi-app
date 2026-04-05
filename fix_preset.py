with open('src/core/theme/diviPreset.ts', 'r') as f:
    content = f.read()

content = content.replace("    // @ts-expect-error Types in primevue theme might be incomplete\n    card:", "    card:")

with open('src/core/theme/diviPreset.ts', 'w') as f:
    f.write(content)
