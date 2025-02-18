export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string
  priority?: 'low' | 'medium' | 'high'
  completed: boolean
  completedAt?: string | null
  status?: 'pending' | 'in_progress' | 'completed' | 'active' | 'deactivated'
  category?: string
  notes?: Array<{
    id: string
    content: string
    createdAt: string
  }>
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface CategoryForm {
  name: string
  color: string
  userId: string
}

export interface Quote {
  id: string
  author: string
  text: string
  source?: string
  category: 'motivation' | 'success' | 'wisdom' | 'leadership' | 'personal_growth'
  createdAt: string
  updatedAt: string
}
