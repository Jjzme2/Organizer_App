export interface TaskFormData {
  name: string
  description: string
  dueDate: string
  notes: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  expectedDifficulty: number
  reminderTime: string
  categoryId: string
}

export interface Task extends TaskFormData {
  id: string
  isComplete: boolean
  createdAt: string
  updatedAt: string
  userId: string
  completedAt?: string
}

export interface CategoryForm {
  name: string
  color: string
}

export interface Category extends CategoryForm {
  id: string
  createdAt: string
  updatedAt: string
}
