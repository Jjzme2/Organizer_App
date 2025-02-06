exports.deactivateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id)

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    if (!task.isComplete) {
      return res.status(400).json({ error: 'Only completed tasks can be deactivated' })
    }

    const completedDate = new Date(task.completedAt)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    if (completedDate > oneWeekAgo) {
      return res.status(400).json({ error: 'Task must be completed for at least a week to be deactivated' })
    }

    await task.update({
      isDeactivated: true,
      deactivatedAt: new Date()
    })

    res.json(task)
  } catch (error) {
    logger.error('Error deactivating task:', error)
    res.status(500).json({ error: 'Failed to deactivate task' })
  }
}

exports.reactivateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id)

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    if (!task.isDeactivated) {
      return res.status(400).json({ error: 'Task is not deactivated' })
    }

    await task.update({
      isDeactivated: false,
      deactivatedAt: null
    })

    res.json(task)
  } catch (error) {
    logger.error('Error reactivating task:', error)
    res.status(500).json({ error: 'Failed to reactivate task' })
  }
}