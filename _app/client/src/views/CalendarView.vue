<template>
  <div class="calendar-view">
    <header class="calendar-header">
      <div class="header-content">
        <h1>Calendar</h1>
        <div class="calendar-controls">
          <button class="btn" @click="previousMonth">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <h2>{{ currentMonthYear }}</h2>
          <button class="btn" @click="nextMonth">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main class="calendar-content">
      <div class="calendar-grid">
        <!-- Weekday headers -->
        <div v-for="day in weekDays" :key="day" class="calendar-cell header">
          {{ day }}
        </div>

        <!-- Calendar days -->
        <div
          v-for="{ date, isCurrentMonth, isToday, tasks } in calendarDays"
          :key="date.toISOString()"
          class="calendar-cell"
          :class="{
            'current-month': isCurrentMonth,
            'other-month': !isCurrentMonth,
            'today': isToday
          }"
          @click="selectDate(date)"
        >
          <div class="date-content">
            <span class="date-number">{{ date.getDate() }}</span>
            <div v-if="tasks?.length" class="task-indicators">
              <div
                v-for="task in tasks.slice(0, 3)"
                :key="task.id"
                class="task-dot"
                :class="{ 'completed': task.isComplete }"
                :title="task.name"
              ></div>
              <span v-if="tasks.length > 3" class="more-tasks">
                +{{ tasks.length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Date Details Modal -->
    <BaseModal
      v-model:show="showModal"
      :title="formatSelectedDate"
    >
      <div class="modal-body">
        <div v-if="selectedDateTasks.length" class="date-tasks">
          <div
            v-for="task in selectedDateTasks"
            :key="task.id"
            class="task-item"
            :class="{ 'completed': task.isComplete }"
          >
            <label class="checkbox-container">
              <input
                type="checkbox"
                :checked="task.isComplete"
                @change="toggleTaskComplete(task)"
              />
              <span class="checkmark"></span>
            </label>
            <div class="task-details">
              <h3>{{ task.name }}</h3>
              <p v-if="task.description" class="task-description">{{ task.description }}</p>
              <div v-if="task.notes" class="task-notes" :class="{ 'expanded': expandedNotes[task.id] }" @click="toggleNotes(task.id)">
                <div class="notes-header">
                  <svg class="icon" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  <span>Notes</span>
                  <svg class="icon expand-icon" viewBox="0 0 24 24">
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                  </svg>
                </div>
                <p class="notes-content">{{ task.notes }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No tasks scheduled for this date</p>
          <button class="btn btn-primary" @click="addTask">Add Task</button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../stores/tasks'
import { storeToRefs } from 'pinia'
import BaseModal from '../components/modals/BaseModal.vue'

const taskStore = useTaskStore()
const { tasks } = storeToRefs(taskStore)

const currentDate = ref(new Date())
const selectedDate = ref(null)
const expandedNotes = ref({})

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const daysInMonth = lastDay.getDate()
  const startOffset = firstDay.getDay()

  // Get days from previous month
  const daysInPreviousMonth = new Date(year, month, 0).getDate()

  const days = []

  // Add days from previous month
  for (let i = startOffset - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, daysInPreviousMonth - i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDay(date, new Date()),
      tasks: getTasksForDate(date)
    })
  }

  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isSameDay(date, new Date()),
      tasks: getTasksForDate(date)
    })
  }

  // Add days from next month
  const remainingDays = 42 - days.length // 6 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDay(date, new Date()),
      tasks: getTasksForDate(date)
    })
  }

  return days.map(day => ({
    ...day,
    reminders: tasks.value
      .filter(task => task.reminders?.some(reminder =>
        isSameDay(new Date(reminder.reminderTime), day.date)
      ))
  }))
})

const selectedDateTasks = computed(() => {
  if (!selectedDate.value) return []
  return getTasksForDate(selectedDate.value)
})

function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

function getTasksForDate(date) {
  return tasks.value.filter(task => {
    if (!task.dueDate) return false
    return isSameDay(new Date(task.dueDate), date)
  })
}

function previousMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

function nextMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}

function selectDate(date) {
  selectedDate.value = date
}

function closeModal() {
  selectedDate.value = null
}

async function toggleTaskComplete(task) {
  await taskStore.toggleTaskComplete(task.id)
}

function addTask() {
  // TODO: Implement add task functionality
  closeModal()
}

function toggleNotes(taskId) {
  expandedNotes.value[taskId] = !expandedNotes.value[taskId]
}

// Add computed property for modal visibility
const showModal = computed({
  get: () => !!selectedDate.value,
  set: (value) => {
    if (!value) {
      selectedDate.value = null
    }
  }
})

onMounted(() => {
  taskStore.fetchTasks()
})
</script>

<style scoped>
.calendar-view {
  min-height: 100vh;
  padding-top: var(--header-height);
}

.calendar-header {
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
}

.header-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.calendar-controls h2 {
  margin: 0;
  min-width: 200px;
  text-align: center;
}

.calendar-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--color-border);
  aspect-ratio: 7/6;
  width: 100%;
}

.calendar-cell {
  position: relative;
  background: var(--color-surface);
  width: 100%;
  transition: background-color 0.2s ease;
}

.calendar-cell:not(.header)::before {
  content: '';
  display: block;
  padding-bottom: 100%;
}

.date-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 8%;
  display: flex;
  flex-direction: column;
  gap: 4%;
}

.calendar-cell.header {
  padding: 8%;
  text-align: center;
  font-weight: 600;
  aspect-ratio: auto;
}

.date-number {
  font-size: clamp(0.875rem, 1.5vw, 1.25rem);
}

.task-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 4%;
}

.task-dot {
  width: clamp(4px, 0.8vw, 8px);
  height: clamp(4px, 0.8vw, 8px);
  border-radius: 50%;
  background: var(--color-primary);
}

.task-dot.completed {
  background: var(--color-success);
}

.more-tasks {
  font-size: clamp(0.625rem, 1vw, 0.75rem);
  color: var(--color-text-light);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  z-index: 50;
}

.modal-content {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
  margin: 0;
}

.modal-body {
  padding: var(--spacing-lg);
  max-height: 60vh;
  overflow-y: auto;
}

.task-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
}

.task-item:hover {
  background: var(--color-surface-hover);
}

.task-item.completed {
  opacity: 0.7;
}

.task-item.completed h3 {
  text-decoration: line-through;
  color: var(--color-text-light);
}

.task-details {
  flex: 1;
}

.task-description {
  color: var(--color-text-light);
  font-size: 0.875rem;
  margin-bottom: var(--spacing-sm);
}

.task-notes {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.7;
  border: 1px solid transparent;
}

.task-notes:hover,
.task-notes.expanded {
  opacity: 1;
  background: var(--color-surface-hover);
  border-color: var(--color-border);
}

.notes-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-light);
  font-size: 0.875rem;
  margin-bottom: var(--spacing-xs);
}

.notes-header .icon {
  width: 1rem;
  height: 1rem;
}

.expand-icon {
  margin-left: auto;
  transition: transform 0.3s ease;
}

.expanded .expand-icon {
  transform: rotate(180deg);
}

.notes-content {
  color: var(--color-text-light);
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
  margin: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.expanded .notes-content {
  max-height: 500px;
  margin-top: var(--spacing-sm);
}

.task-notes:hover .notes-content {
  max-height: 500px;
  margin-top: var(--spacing-sm);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-light);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
}

/* Checkbox styling */
.checkbox-container {
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.checkbox-container:hover .checkmark {
  border-color: var(--color-primary);
}

.checkbox-container input:checked ~ .checkmark {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
  left: 8px;
  top: 4px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

@media (max-width: 768px) {
  .calendar-header {
    padding: var(--spacing-md);
  }

  .calendar-content {
    padding: 0 var(--spacing-sm);
  }

  .calendar-grid {
    gap: 1px;
  }

  .date-number {
    font-size: 0.875rem;
  }

  .task-dot {
    width: 4px;
    height: 4px;
  }

  .more-tasks {
    font-size: clamp(0.625rem, 1vw, 0.75rem);
  }
}

.weekday-full {
  display: block;
}

.weekday-short {
  display: none;
}

.calendar-cell {
  min-height: 80px;
  padding: var(--spacing-sm);
  background: var(--color-surface);
  border-radius: var(--border-radius-sm);
  transition: background-color 0.2s ease;
}

.calendar-cell.header {
  min-height: auto;
  padding: var(--spacing-sm);
  font-weight: 600;
  text-align: center;
  background: transparent;
}

.date-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  height: 100%;
}
</style>
