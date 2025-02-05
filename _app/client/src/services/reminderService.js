import api from './api'

export const reminderService = {
  async createReminder(taskId, reminderTime) {
    const response = await api.post('/api/task-reminders', {
      taskId,
      reminderTime
    })
    return response.data
  },

  async getRemindersForTask(taskId) {
    const response = await api.get(`/api/task-reminders?taskId=${taskId}`)
    return response.data
  },

  async updateReminder(id, data) {
    const response = await api.put(`/api/task-reminders/${id}`, data)
    return response.data
  },

  async deleteReminder(id) {
    await api.delete(`/api/task-reminders/${id}`)
  }
}
