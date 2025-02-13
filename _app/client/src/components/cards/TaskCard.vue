<template>
  <BaseCard
    :title="task.name"
    :is-complete="task.isComplete"
    :is-completing="task.isCompleting"
    :is-uncompleting="task.isUncompleting"
    :priority="task.priority"
    custom-class="task-card"
    :show-default-actions="false"
  >
    <template #header-prefix>
      <label class="checkbox-wrapper">
        <input
          type="checkbox"
          :checked="task.isComplete"
          @change="$emit('toggle-complete', task.id)"
          :disabled="task.isCompleting || task.isUncompleting"
        >
        <span class="checkbox-custom"></span>
      </label>
    </template>

    <template #body>
      <p v-if="task.description" class="task-card-description">
        {{ task.description }}
      </p>
    </template>

    <template #controls>
      <div class="task-controls" v-if="!task.isComplete">
        <div class="control-group">
          <div class="control-row">
            <label>Status:</label>
            <select v-model="currentStatus" @change="handleStatusChange">
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div class="control-row">
            <label>Priority:</label>
            <select v-model="currentPriority" @change="handlePriorityChange">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      <div class="task-notes-section">
        <div v-if="task.notes && task.notes.length > 0" class="task-notes">
          <div class="notes-header" @click="isNotesExpanded = !isNotesExpanded">
            <span class="notes-title">📝 Notes ({{ task.notes.length }})</span>
            <span class="expand-icon" :class="{ 'expanded': isNotesExpanded }">▼</span>
          </div>
          <div class="notes-list" v-if="isNotesExpanded">
            <div v-for="(note, index) in formattedNotes" :key="index" class="note-item">
              <template v-for="(segment, sIndex) in note.split('|')" :key="`${index}-${sIndex}`">
                <span class="note-segment" :class="{ 'primary': sIndex === 0 }">
                  {{ segment.trim() }}
                </span>
              </template>
            </div>
          </div>
        </div>

        <div v-if="!task.isComplete" class="add-note">
          <div class="note-input-wrapper">
            <input
              v-model="newNote"
              type="text"
              placeholder="Add note (use | to separate segments)..."
              @keyup.enter="handleAddNote"
            >
            <button
              class="btn add-btn"
              :disabled="!newNote.trim()"
              @click="handleAddNote"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </template>

    <template #meta>
      <div class="task-meta">
        <span v-if="task.isComplete && task.completedAt" class="completion-date">
          ✅ Marked Completed {{ formatCompletionInfo }}
        </span>
        <span v-else-if="task.dueDate" class="due-date" :class="{ 'overdue': isOverdue }">
          ⏰ {{ formatDueDate }}
        </span>
        <span v-if="task.categoryId && category" class="category-badge" :style="{ backgroundColor: category.color + '20', color: category.color, borderColor: category.color }">
          {{ category.name }}
        </span>
      </div>
    </template>

    <template #footer-actions>
      <div class="task-actions" v-if="!task.isComplete">
        <button @click="$emit('edit', task)" class="btn edit-btn" aria-label="Edit task">
          ✎
        </button>
        <button @click="$emit('delete', task.id)" class="btn delete-btn" aria-label="Delete task">
          🗑
        </button>
      </div>
    </template>
  </BaseCard>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import BaseCard from './BaseCard.vue';
import { useCategoryStore } from '../../stores/categories'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle-complete', 'edit', 'delete', 'update-status', 'update-priority', 'add-note'])

const categoryStore = useCategoryStore()
const category = computed(() => {
  if (!props.task.categoryId) return null
  return categoryStore.categories.find(c => c.id === props.task.categoryId)
})

const isNotesExpanded = ref(false);
const newNote = ref('');
const currentStatus = ref(props.task.status);
const currentPriority = ref(props.task.priority);

// Watch for changes in task props and update local state
watch(() => props.task.status, (newStatus) => {
  currentStatus.value = newStatus;
}, { immediate: true });

watch(() => props.task.priority, (newPriority) => {
  currentPriority.value = newPriority;
}, { immediate: true });

const formattedNotes = computed(() => {
  return props.task.notes?.map(note => note.replace(/\n/g, '|')) || [];
});

const isOverdue = computed(() => {
  if (!props.task.dueDate) return false;
  return new Date(props.task.dueDate) < new Date();
});

const formatDueDate = computed(() => {
  if (!props.task.dueDate) return '';
  const date = new Date(props.task.dueDate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
});

const formatCompletionInfo = computed(() => {
  if (!props.task.completedAt || !props.task.dueDate) {
    return new Date(props.task.completedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  const completedDate = new Date(props.task.completedAt);
  const dueDate = new Date(props.task.dueDate);
  const diffDays = Math.round((dueDate - completedDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'on time';
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} early`;
  } else {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} late`;
  }
});

function handleStatusChange() {
  console.log('Status change:', currentStatus.value); // Debug log
  emit('update-status', { id: props.task.id, status: currentStatus.value });
}

function handlePriorityChange() {
  console.log('Priority change:', currentPriority.value); // Debug log
  emit('update-priority', { id: props.task.id, priority: currentPriority.value });
}

function handleAddNote() {
  if (newNote.value.trim()) {
    console.log('Adding note:', newNote.value.trim()); // Debug log
    emit('add-note', { id: props.task.id, note: newNote.value.trim() });
    newNote.value = '';
  }
}
</script>