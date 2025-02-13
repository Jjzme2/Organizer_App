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
