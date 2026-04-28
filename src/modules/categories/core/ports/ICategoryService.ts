import { BehaviorSubject, Observable } from 'rxjs'
import type { ICategory } from '../entities/ICategory'

export interface ICategoryService {
  readonly categories$: Observable<ICategory[]>
  readonly categoriesSubject: BehaviorSubject<ICategory[]>
  loadCategories(): Promise<void>
  createCategory(data: any): Promise<void>
  updateCategory(id: string, data: any): Promise<void>
  deleteCategory(id: string): Promise<void>
}
