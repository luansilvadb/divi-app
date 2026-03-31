import re

with open('src/modules/calendar/application/stores/calendarStore.ts', 'r') as f:
    content = f.read()

# Replace any with specific type or unknown
content = content.replace('new Map<string, any[]>()', 'new Map<string, typeof transactionStore.transactions[0][]>()')
content = content.replace('(t as any)._dateKey', '(t as typeof transactionStore.transactions[0] & { _dateKey?: string })._dateKey')

with open('src/modules/calendar/application/stores/calendarStore.ts', 'w') as f:
    f.write(content)
