import { describe, it, expect, vi } from 'vitest'
import { AssetLoader } from './asset-loader'
import type { IActivityLogService } from '@/modules/activity-log/core/ports/IActivityLogService'

describe('AssetLoader', () => {
  describe('getFallback', () => {
    it('should return placeholder svg path without type parameter', () => {
      const loader = new AssetLoader()
      expect(loader.getFallback()).toBe('/assets/placeholder.svg')
    })

    it('should consistently return the same fallback path', () => {
      const loader = new AssetLoader()
      const fallback1 = loader.getFallback()
      const fallback2 = loader.getFallback()
      const fallback3 = loader.getFallback()

      expect(fallback1).toBe('/assets/placeholder.svg')
      expect(fallback2).toBe('/assets/placeholder.svg')
      expect(fallback3).toBe('/assets/placeholder.svg')
      expect(fallback1).toBe(fallback2)
      expect(fallback2).toBe(fallback3)
    })
  })

  describe('sanitize', () => {
    it('should return fallback for undefined URL', () => {
      const loader = new AssetLoader()
      expect(loader.sanitize(undefined)).toBe('/assets/placeholder.svg')
    })

    it('should return fallback for empty URL', () => {
      const loader = new AssetLoader()
      expect(loader.sanitize('')).toBe('/assets/placeholder.svg')
    })

    it('should return fallback for URL with invalid protocol', () => {
      const loader = new AssetLoader()
      expect(loader.sanitize('ftp://example.com/image.png')).toBe('/assets/placeholder.svg')
      expect(loader.sanitize('javascript:alert(1)')).toBe('/assets/placeholder.svg')
      expect(loader.sanitize('https://example.com/image.png')).toBe('/assets/placeholder.svg')
    })

    it('should return local path for valid root-relative URL', () => {
      const loader = new AssetLoader()
      expect(loader.sanitize('/assets/images/IWallet-icon.svg')).toBe('/assets/images/IWallet-icon.svg')
    })

    it('should trim whitespace from URL', () => {
      const loader = new AssetLoader()
      expect(loader.sanitize('  /assets/images/icon.svg  ')).toBe('/assets/images/icon.svg')
    })

    it('should remove malformed suffixes like :1', () => {
      const loader = new AssetLoader()
      expect(loader.sanitize('/assets/images/icon.svg:1')).toBe('/assets/images/icon.svg')
    })
  })

  describe('isValidSize', () => {
    it('should return true for data URI under 128KB', () => {
      const loader = new AssetLoader()
      const smallDataUri = 'data:image/png;base64,' + 'a'.repeat(1000)
      expect(loader.isValidSize(smallDataUri)).toBe(true)
    })

    it('should return false for data URI over 128KB', () => {
      const loader = new AssetLoader()
      const largeDataUri = 'data:image/png;base64,' + 'a'.repeat(200000)
      expect(loader.isValidSize(largeDataUri)).toBe(false)
    })
  })

  describe('with activityLogService', () => {
    it('should log warning when blocking invalid URL', async () => {
      const mockLogActivity = vi.fn().mockResolvedValue(undefined)
      const mockGetRecentActivities = vi.fn().mockResolvedValue([])
      const mockActivityLogService: IActivityLogService = {
        logActivity: mockLogActivity,
        getRecentActivities: mockGetRecentActivities,
      }

      const loader = new AssetLoader(mockActivityLogService)
      loader.sanitize('ftp://example.com/image.png')

      // Wait for async logActivity
      await new Promise((resolve) => setTimeout(resolve, 10))

      expect(mockLogActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'Asset Loader: Invalid asset protocol',
          type: 'warning',
        }),
      )
    })
  })
})
