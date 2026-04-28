import { BehaviorSubject, Observable } from 'rxjs'
import type { IWallet } from '../entities/IWallet'

export interface IWalletService {
  readonly wallets$: Observable<IWallet[]>
  readonly walletsSubject: BehaviorSubject<IWallet[]>
  loadwallets(): Promise<void>
  createIWallet(IWalletData: any): Promise<void>
  updateIWallet(id: string, IWalletData: any): Promise<void>
}
