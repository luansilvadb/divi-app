export interface Category {
  id: string
  name: string
  icon?: string
  color?: string
  parent_id?: string
  user_id?: string // system categories don't have user_id
}
