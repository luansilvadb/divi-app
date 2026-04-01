import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';

test('Verify Mobile BottomSheet uses motion.dev', async ({ page }) => {
  const transactionForm = readFileSync('src/shared/components/molecules/BaseBottomSheet.vue', 'utf-8');
  expect(transactionForm).toContain('import { animate, spring } from \'motion\'');
  expect(transactionForm).not.toContain('.finished');
});
