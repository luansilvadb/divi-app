with open('src/modules/transactions/ui/views/TransactionsView.vue', 'r') as f:
    content = f.read()

content = content.replace('''<component
        :is="isMobile ? TransactionDialog : TransactionDialog"''', '<TransactionDialog')
content = content.replace('/>\n\n      <!-- Delete Confirmation Overlay -->', '/>\n\n      <!-- Delete Confirmation Overlay -->')
content = content.replace("import TransactionDialog from '@/shared/components/organisms/TransactionDialog.vue'\nimport TransactionDialog from '@/shared/components/organisms/TransactionDialog.vue'", "import TransactionDialog from '@/shared/components/organisms/TransactionDialog.vue'")

with open('src/modules/transactions/ui/views/TransactionsView.vue', 'w') as f:
    f.write(content)
