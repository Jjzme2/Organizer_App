module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('quotes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Unknown'
      },
      source: {
        type: Sequelize.STRING,
        allowNull: true
      },
      category: {
        type: Sequelize.ENUM('motivation', 'success', 'wisdom', 'leadership', 'personal_growth'),
        defaultValue: 'motivation'
      },
      isFavorite: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('quotes', ['userId'], {
      name: 'idx_user_quotes'
    });

    await queryInterface.addIndex('quotes', ['isFavorite'], {
      name: 'idx_favorite_quotes'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('quotes');
  }
};