import { BehaviorSubject, Observable } from 'rxjs';
import type { IWalletRepository } from '@/shared/domain/contracts/IWalletRepository';
import type { Wallet } from '@/shared/domain/entities/Wallet';
import { useAuthStore } from '@/modules/auth/application/authStore';
import { AuthError, ValidationError } from '@/core/errors';

// Constants for currency conversion
const MINOR_UNIT_MULTIPLIER = 100;

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

    const walletToCreate: any = {
      ...walletData,
      balance: BigInt(Math.round(walletData.balance * MINOR_UNIT_MULTIPLIER)),
      user_id: activeUserId,
    };

    await this.walletRepo.create(walletToCreate);
    await this.loadWallets();
  }

  async updateWallet(id: string, walletData: Partial<Wallet>): Promise<void> {
    await this.walletRepo.update(id, walletData);
    await this.loadWallets();
  }
}
