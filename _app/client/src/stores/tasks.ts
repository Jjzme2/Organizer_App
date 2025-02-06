const completedTasks = computed(() => {
  return tasks.value.filter(task =>
    task.isComplete && (task.isDeactivated || !task.isDeactivated)
  )
})
