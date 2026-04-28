import { vaultDb } from '@/infrastructure/storage/VaultDatabase'
import { v7 as uuidv7 } from 'uuid'
import type { ILocalITransaction, ILocalSubscription } from '@/infrastructure/storage/VaultDatabase'
import { SyncEngine } from '@/core/sync/SyncEngine'

export class SubscriptionProcessor {
  /**
   * Checks for all subscriptions that should have been billed by now
   * and creates the corresponding transactions.
   */
  static async processPendingSubscriptions(userId: string) {
    console.debug('[SubscriptionProcessor] Checking for due subscriptions for user:', userId)
    
    try {
      // 1. Get all active subscriptions for this user
      const subscriptions = await vaultDb.subscriptions
        .where('user_id')
        .equals(userId)
        .and(s => !s.deleted)
        .toArray()

      const today = new Date()
      const currentDay = today.getDate()
      let hasChanges = false

      for (const sub of subscriptions as ILocalSubscription[]) {
        // Simple logic: if today's day is >= billing day
        if (sub.billing_day <= currentDay) {
          
          // Check if already billed this month
          const lastBilled = sub.last_billed_at ? new Date(sub.last_billed_at) : null
          const alreadyBilled = 
            lastBilled && 
            lastBilled.getMonth() === today.getMonth() && 
            lastBilled.getFullYear() === today.getFullYear()

          if (!alreadyBilled) {
            console.info(`[SubscriptionProcessor] Generating ITransaction for: ${sub.name}`)

            // Create ITransaction
            const ITransactionId = uuidv7()
            const ITransaction: ILocalITransaction = {
              id: ITransactionId,
              user_id: userId,
              title: `Assinatura: ${sub.name}`,
              amount: BigInt(Math.abs(Number(sub.amount))),
              type: 'expense',
              category_id: sub.category_id,
              wallet_id: sub.wallet_id,
              date: today.toISOString(),
              sync_status: 'pending',
              deleted: false,
              client_updated_at: today.toISOString(),
              created_at: today.toISOString(),
              version: 1
            }

            await vaultDb.transactions.add(ITransaction)

            // Update ISubscription last billed date
            await vaultDb.subscriptions.update(sub.id, {
              last_billed_at: today.toISOString(),
              sync_status: 'pending',
              client_updated_at: today.toISOString()
            })

            hasChanges = true
          }
        }
      }

      if (hasChanges) {
        SyncEngine.getInstance().enqueueSync()
      }
    } catch (err) {
      console.error('[SubscriptionProcessor] Failed to process subscriptions:', err)
    }
  }
}
