import type { ICategory } from '@/modules/categories/core/entities/ICategory'

export interface IAutoCategorizationService {
  suggestCategory(title: string, categories: ICategory[]): ICategory | null
}
