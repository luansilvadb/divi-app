export interface PredictionResult {
  categoryId: string
  walletId: string
  confidence: number // 0 a 1
}

export interface IPredictionService {
  predict(payeeId: string, amount: number): Promise<PredictionResult>
}
