import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';

test('Verify Mobile BottomSheet uses single Transition', async ({ page }) => {
  const transactionForm = readFileSync('src/shared/components/molecules/BaseBottomSheet.vue', 'utf-8');
  expect(transactionForm).toContain('<Transition name="sheet" :duration="400" @after-leave="$emit(\'closed\')">');
});
