import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';

test('Verify Mobile BottomSheet logic and touch events exist', async ({ page }) => {
  const transactionForm = readFileSync('src/shared/components/molecules/BaseBottomSheet.vue', 'utf-8');
  expect(transactionForm).toContain('translate3d');
  expect(transactionForm).toContain('@touchstart');
  expect(transactionForm).not.toContain('touch-none');
});
