export interface PredictionResult {
  categoryId: string
  IWalletId: string
  confidence: number // 0 a 1
}

export interface IPredictionService {
  predict(payeeId: string, amount: bigint): Promise<PredictionResult>
}
