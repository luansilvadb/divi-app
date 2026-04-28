import { db } from '@/infrastructure/storage/VaultDatabase'
import { v7 as uuidv7 } from 'uuid'
import type { LocalTransaction, LocalSubscription } from '@/infrastructure/storage/VaultDatabase'
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
      const subscriptions = await db.subscriptions
        .where('user_id')
        .equals(userId)
        .and(s => !s.deleted)
        .toArray()

      const today = new Date()
      const currentDay = today.getDate()
      let hasChanges = false

      for (const sub of subscriptions as LocalSubscription[]) {
        // Simple logic: if today's day is >= billing day
        if (sub.billing_day <= currentDay) {
          
          // Check if already billed this month
          const lastBilled = sub.last_billed_at ? new Date(sub.last_billed_at) : null
          const alreadyBilled = 
            lastBilled && 
            lastBilled.getMonth() === today.getMonth() && 
            lastBilled.getFullYear() === today.getFullYear()

          if (!alreadyBilled) {
            console.info(`[SubscriptionProcessor] Generating transaction for: ${sub.name}`)

            // Create Transaction
            const transactionId = uuidv7()
            const transaction: LocalTransaction = {
              id: transactionId,
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

            await db.transactions.add(transaction)

            // Update Subscription last billed date
            await db.subscriptions.update(sub.id, {
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
