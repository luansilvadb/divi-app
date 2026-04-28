import { BehaviorSubject } from 'rxjs';
import { Wallet } from '@/shared/domain/entities/Wallet';

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
  async add(wallet: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wallet> {
    // Simulação de criação
    const newWallet: Wallet = {
      ...wallet,
      id: `wallet_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentWallets = this.walletsSubject.value;
    this.walletsSubject.next([...currentWallets, newWallet]);
    return newWallet;
  }
}
