import os
import re

for filepath in ['src/modules/transactions/ui/views/__tests__/TransactionsView.spec.ts', 'src/__tests__/App.spec.ts']:
    with open(filepath, 'r') as f:
        content = f.read()

    if "import 'fake-indexeddb/auto'" not in content:
        content = "import 'fake-indexeddb/auto'\n" + content

        with open(filepath, 'w') as f:
            f.write(content)
