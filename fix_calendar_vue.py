with open('src/modules/calendar/ui/views/CalendarView.vue', 'r') as f:
    content = f.read()

content = content.replace('currentDate', 'calendarStore.currentDate')

with open('src/modules/calendar/ui/views/CalendarView.vue', 'w') as f:
    f.write(content)
