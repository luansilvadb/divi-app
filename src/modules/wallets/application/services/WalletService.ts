import { BehaviorSubject, Observable } from 'rxjs';
import type { IWalletRepository } from '@/modules/wallets/core/ports/IWalletRepository';
import type { IWallet } from '@/modules/wallets/core/entities/IWallet';
import type { IWalletService } from '@/modules/wallets/core/ports/IWalletService';
import { useAuthStore } from '@/modules/auth/application/authStore';
import { AuthError, ValidationError } from '@/core/errors';

// Constants for currency conversion
const MINOR_UNIT_MULTIPLIER = 100;

export class WalletService implements IWalletService {
  private _walletsSubject = new BehaviorSubject<IWallet[]>([]);
  public readonly walletsSubject = this._walletsSubject;
  public wallets$: Observable<IWallet[]> = this._walletsSubject.asObservable();

  constructor(private IWalletRepo: IWalletRepository) {}

  async loadwallets(): Promise<void> {
    const wallets = await this.IWalletRepo.getAll();
    this._walletsSubject.next(wallets);
  }

  async createIWallet(IWalletData: Pick<IWallet, 'name' | 'type' | 'currency' | 'icon'> & { balance: number }): Promise<void> {
    // Guard clause: Authentication check
    const authStore = useAuthStore();
    const activeUserId = authStore.user?.id;
    if (!activeUserId) throw new AuthError('User not authenticated');

    // Guard clause: Required field validation
    if (!IWalletData.name?.trim()) throw new ValidationError('IWallet name is required');
    if (!IWalletData.currency?.trim()) throw new ValidationError('IWallet currency is required');

    const IWalletToCreate: any = {
      ...IWalletData,
      balance: BigInt(Math.round(IWalletData.balance * MINOR_UNIT_MULTIPLIER)),
      user_id: activeUserId,
    };

    await this.IWalletRepo.create(IWalletToCreate);
    await this.loadwallets();
  }

  async updateIWallet(id: string, IWalletData: Partial<IWallet>): Promise<void> {
    await this.IWalletRepo.update(id, IWalletData);
    await this.loadwallets();
  }
}
