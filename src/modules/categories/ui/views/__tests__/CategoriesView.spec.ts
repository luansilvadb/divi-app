import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoriesView from '../CategoriesView.vue'
import { BehaviorSubject } from 'rxjs'
import type { Category } from '@/shared/domain/entities/Category'

// Mocks configuration
const mockCategories = new BehaviorSubject<Category[]>([])

const mockCategoryService = {
  categories$: mockCategories.asObservable(),
  loadCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn()
}

// Global DI mock
vi.mock('@/core/di', () => ({
  useService: () => mockCategoryService
}))

// Mock Layout
vi.mock('@/shared/components/templates/StandardPageLayout.vue', () => ({
  default: {
    name: 'StandardPageLayout',
    template: '<div><slot name="action"></slot><slot></slot></div>'
  }
}))

vi.mock('naive-ui', async (importOriginal) => {
  const actual: any = await importOriginal()
  return {
    ...actual,
    useMessage: () => ({
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn()
    }),
    useDialog: () => ({
      warning: vi.fn(),
      success: vi.fn()
    })
  }
})

describe('CategoriesView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCategories.next([])
  })

  it('renders correctly with empty state', () => {
    const wrapper = mount(CategoriesView, {
      global: {
        stubs: {
          NEmpty: true,
          NGrid: true,
          NGridItem: true,
          NCard: true,
          NText: true,
          NButton: true,
          NModal: true,
          NForm: true,
          NFormItem: true,
          NInput: true,
          NColorPicker: true,
          NSelect: true,
        }
      }
    })

    expect(mockCategoryService.loadCategories).toHaveBeenCalled()
    // Test the internal state if DOM stub doesn't render properly right away
    const vm = wrapper.vm as any
    expect(vm.categories.length).toBe(0)
  })

  it('lists existing categories', async () => {
    mockCategories.next([
      { id: '1', name: 'Alimentação', color: '#111', icon: 'i-lucide-tag', parent_id: null } as Category,
      { id: '2', name: 'Lazer', color: '#222', icon: 'i-lucide-ticket', parent_id: null } as Category,
    ])

    const wrapper = mount(CategoriesView, {
      global: {
        stubs: {
          StandardPageLayout: true,
          NEmpty: true,
          NGrid: true,
          NGridItem: true,
          NCard: true,
          NText: true,
          NButton: true,
          NModal: true,
          NForm: true,
          NFormItem: true,
          NInput: true,
          NColorPicker: true,
          NSelect: true,
        }
      }
    })

    // Because naive-ui components are stubbed, we can't test internal render content easily,
    // but we can check if service values are accessible in wrapper.vm setup
    const vm = wrapper.vm as any
    expect(vm.categories.length).toBe(2)
  })

  it('opens add modal and creates a category', async () => {
    const wrapper = mount(CategoriesView, {
      global: { stubs: { NEmpty: true, NModal: true, NForm: true, NFormItem: true, NInput: true, NSelect: true, NColorPicker: true, NButton: true, NCard: true, NText: true, NGrid: true, NGridItem: true } }
    })

    const vm = wrapper.vm as any
    vm.openAddModal()
    
    expect(vm.showModal).toBe(true)
    expect(vm.isSubmittingEdit).toBe(false)
    
    vm.formModel.name = 'New Custom'
    vm.formModel.color = '#fff'
    vm.formModel.icon = 'i-lucide-car'

    await vm.handleSave()
    expect(mockCategoryService.createCategory).toHaveBeenCalledWith({
      name: 'New Custom',
      color: '#fff',
      icon: 'i-lucide-car',
      parent_id: null
    })
    expect(vm.showModal).toBe(false)
  })

  it('opens edit modal and updates', async () => {
    const wrapper = mount(CategoriesView, {
      global: { stubs: { NEmpty: true, NModal: true, NForm: true, NFormItem: true, NInput: true, NSelect: true, NColorPicker: true, NButton: true, NCard: true, NText: true, NGrid: true, NGridItem: true } }
    })
    const vm = wrapper.vm as any
    
    vm.openEditModal({ id: 'editing-1', name: 'Old', color: '#123', icon: 'i-lucide-tag' })
    expect(vm.showModal).toBe(true)
    expect(vm.editingId).toBe('editing-1')
    expect(vm.isSubmittingEdit).toBe(true)

    vm.formModel.name = 'New Name'
    await vm.handleSave()
    
    expect(mockCategoryService.updateCategory).toHaveBeenCalledWith('editing-1', {
      name: 'New Name',
      color: '#123',
      icon: 'i-lucide-tag',
      parent_id: null
    })
  })
})
