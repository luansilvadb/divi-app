import re

with open('src/modules/calendar/ui/views/CalendarView.vue', 'r') as f:
    content = f.read()

content = content.replace('calendarStore.calendarStore.currentYear', 'calendarStore.currentYear')

with open('src/modules/calendar/ui/views/CalendarView.vue', 'w') as f:
    f.write(content)
