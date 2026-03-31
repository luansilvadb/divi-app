import type { IAssetLoader } from '../domain/contracts/IAssetLoader'
import { ASSET_LIMITS } from '../domain/entities/Asset'
import type { IActivityLogService } from '../../modules/activity-log/domain/contracts/IActivityLogService'

export class AssetLoader implements IAssetLoader {
  constructor(private activityLogService?: IActivityLogService) {}

  sanitize(url: string | undefined): string {
    if (!url) return this.getFallback()

    const trimmedUrl = url.trim()

    // Remove common malformed suffixes like :1
    const cleanUrl = trimmedUrl.replace(/:\d+$/, '')

    // Check protocol
    const isAllowed = ASSET_LIMITS.ALLOWED_PROTOCOLS.some((protocol) =>
      cleanUrl.startsWith(protocol),
    )

    if (!isAllowed) {
      this.logWarning(
        'Invalid asset protocol',
        `Asset URL blocked: ${cleanUrl.substring(0, 50)}...`,
      )
      return this.getFallback()
    }

    // Check Data URI size
    if (cleanUrl.startsWith('data:') && !this.isValidSize(cleanUrl)) {
      this.logWarning('Asset too large', `Data URI exceeds 128KB limit.`)
      return this.getFallback()
    }

    return cleanUrl
  }

  isValidSize(dataUri: string): boolean {
    return dataUri.length <= ASSET_LIMITS.MAX_DATA_URI_SIZE
  }

  getFallback(type: 'category' | 'wallet' | 'generic' = 'generic'): string {
    switch (type) {
      case 'category':
        return '/assets/placeholder.svg'
      case 'wallet':
        return '/assets/placeholder.svg'
      default:
        return '/assets/placeholder.svg'
    }
  }

  private async logWarning(action: string, description: string) {
    if (this.activityLogService) {
      await this.activityLogService.logActivity({
        action: `Asset Loader: ${action}`,
        description,
        type: 'warning',
      })
    }
  }
}
