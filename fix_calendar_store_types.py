import re

with open('src/modules/calendar/application/stores/calendarStore.ts', 'r') as f:
    content = f.read()

# Fix possibly undefined array access in calendar store
content = content.replace('const t = transactionStore.transactions[i]', 'const t = transactionStore.transactions[i]!')
content = content.replace('const t = txs[i]', 'const t = txs[i]!')

with open('src/modules/calendar/application/stores/calendarStore.ts', 'w') as f:
    f.write(content)
