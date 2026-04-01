import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';

test('Verify Mobile BottomSheet and Desktop Modal components exist', async ({ page }) => {
  const transactionForm = readFileSync('src/shared/components/organisms/TransactionForm.vue', 'utf-8');
  expect(transactionForm).toContain('isDesktop ? BaseModal : BaseBottomSheet');
});
