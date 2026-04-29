import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata';

/**
 * Internal storage interfaces used only by VaultDatabase.
 */

export interface ILocalPayee extends ISyncMetadata {
  name: string;
}

export interface ILocalActivity extends ISyncMetadata {
  timestamp: string;
  action: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
