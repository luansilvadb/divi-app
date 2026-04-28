import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { ICategoryService } from '@/modules/categories/core/ports/ICategoryService'
import type { ICategory } from '@/modules/categories/core/entities/ICategory'

export const useCategoryStore = defineStore('categories', () => {
  const categoryService = container.resolve<ICategoryService>(DI_TOKENS.ICategoryService)

  const categories = shallowRef<ICategory[]>([])
  const categoryMap = shallowRef<Record<string, ICategory>>({})

  async function fetchCategories() {
    await categoryService.loadCategories()
    const c = categoryService.categoriesSubject.getValue()
    categories.value = c
    const map: Record<string, ICategory> = {}
    for (let i = 0, len = c.length; i < len; i++) {
      const item = c[i]!
      map[item.id] = item
    }
    categoryMap.value = map
  }

  async function saveCategory(category: ICategory) {
    await categoryService.createCategory({
      name: category.name,
      icon: category.icon,
      color: category.color,
      parent_id: category.parent_id,
    })
    await fetchCategories()
  }

  return {
    categories,
    categoryMap,
    fetchCategories,
    saveCategory,
  }
})
