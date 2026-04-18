import { BehaviorSubject, Observable } from 'rxjs';
import type { IWalletRepository } from '@/shared/domain/contracts/IWalletRepository';
import type { Wallet } from '@/shared/domain/entities/Wallet';
import { v7 as uuidv7 } from 'uuid';
import { useAuthStore } from '@/modules/auth/application/authStore';
import { AuthError, ValidationError } from '@/core/errors';

// Constants for currency conversion
const MINOR_UNIT_MULTIPLIER = 100;
const INITIAL_VERSION = 1;

export class WalletService {
  private _walletsSubject = new BehaviorSubject<Wallet[]>([]);
  public readonly walletsSubject = this._walletsSubject;
  public wallets$: Observable<Wallet[]> = this._walletsSubject.asObservable();

  constructor(private walletRepo: IWalletRepository) {}

  async loadWallets(): Promise<void> {
    const wallets = await this.walletRepo.getAll();
    this._walletsSubject.next(wallets);
  }

  async createWallet(walletData: Pick<Wallet, 'name' | 'type' | 'currency' | 'icon'> & { balance: number }): Promise<void> {
    // Guard clause: Authentication check
    const authStore = useAuthStore();
    const activeUserId = authStore.user?.id;
    if (!activeUserId) throw new AuthError('User not authenticated');

    // Guard clause: Required field validation
    if (!walletData.name?.trim()) throw new ValidationError('Wallet name is required');
    if (!walletData.currency?.trim()) throw new ValidationError('Wallet currency is required');

    const newWallet: Wallet = {
      ...walletData,
      balance: BigInt(Math.round(walletData.balance * MINOR_UNIT_MULTIPLIER)),
      id: uuidv7(),
      user_id: activeUserId,
      sync_status: 'pending',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: INITIAL_VERSION,
      deleted: false
    };

    await this.walletRepo.save(newWallet);
    await this.loadWallets();
  }
}
