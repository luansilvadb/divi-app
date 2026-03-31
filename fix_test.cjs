const fs = require('fs');
const file = 'src/modules/transactions/ui/views/__tests__/TransactionsView.spec.ts';
let content = fs.readFileSync(file, 'utf8');

const importFakeDb = `import 'fake-indexeddb/auto'\n`;
if (!content.includes('fake-indexeddb')) {
    content = importFakeDb + content;
}

fs.writeFileSync(file, content);
