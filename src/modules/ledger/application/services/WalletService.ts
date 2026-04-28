import { BehaviorSubject } from 'rxjs';
import type { Wallet } from '@/shared/domain/entities/Wallet';

export class WalletService {
  private walletsSubject = new BehaviorSubject<Wallet[]>([]);
  public wallets$ = this.walletsSubject.asObservable();

  constructor() {}

  // Método para obter todas as carteiras
  async getAll(): Promise<Wallet[]> {
    // Simulação de busca de carteiras
    return this.walletsSubject.value;
  }

  // Método para atualizar a lista de carteiras
  updateWallets(wallets: Wallet[]): void {
    this.walletsSubject.next(wallets);
  }

  // Método para adicionar uma nova carteira
  async add(wallet: Omit<Wallet, 'id' | 'created_at' | 'client_updated_at' | 'sync_status' | 'version' | 'deleted'>): Promise<Wallet> {
    // Simulação de criação
    const newWallet: Wallet = {
      ...wallet,
      id: `wallet_${Date.now()}`,
      created_at: new Date().toISOString(),
      client_updated_at: new Date().toISOString(),
      sync_status: 'synced',
      version: 1,
      deleted: false
    };

    const currentWallets = this.walletsSubject.value;
    this.walletsSubject.next([...currentWallets, newWallet]);
    return newWallet;
  }
}
