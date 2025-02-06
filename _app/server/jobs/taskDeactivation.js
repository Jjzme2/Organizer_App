const cron = require('node-cron')
const Task = require('../models/Task')
const logger = require('../utils/logger')

// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const tasksToDeactivate = await Task.findAll({
      where: {
        isComplete: true,
        isDeactivated: false,
        completedAt: {
          [Op.lt]: oneWeekAgo
        }
      }
    })

    for (const task of tasksToDeactivate) {
      await task.update({
        isDeactivated: true,
        deactivatedAt: new Date()
      })
    }

    logger.info(`Deactivated ${tasksToDeactivate.length} old completed tasks`)
  } catch (error) {
    logger.error('Error in task deactivation job:', error)
  }
})