import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import { CategoryService } from '@/modules/categories/application/services/CategoryService'
import type { Category } from '@/shared/domain/entities/Category'

export const useCategoryStore = defineStore('categories', () => {
  const categoryService = container.resolve<CategoryService>(DI_TOKENS.CategoryService)

  const categories = shallowRef<Category[]>([])
  const categoryMap = shallowRef<Record<string, Category>>({})

  async function fetchCategories() {
    await categoryService.loadCategories()
    const c = categoryService.categoriesSubject.getValue()
    categories.value = c
    const map: Record<string, Category> = {}
    for (let i = 0, len = c.length; i < len; i++) {
      const item = c[i]!
      map[item.id] = item
    }
    categoryMap.value = map
  }

  return {
    categories,
    categoryMap,
    fetchCategories,
  }
})
