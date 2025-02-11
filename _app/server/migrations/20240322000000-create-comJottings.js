module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('comJottings', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			content: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			jottingId: {
				type: Sequelize.UUID,
				references: {
					model: 'jottings',
					key: 'id'
				},
				onDelete: 'CASCADE'
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
			},
		});

		await queryInterface.addIndex('comJottings', ['jottingId'], {
			name: 'idx_jotting_comments_jotting'
		});

		await queryInterface.addIndex('comJottings', ['userId'], {
			name: 'idx_jotting_comments_user'
		});

		await queryInterface.addIndex('comJottings', ['createdAt'], {
			name: 'idx_jotting_comments_created'
		});

		await queryInterface.addIndex('comJottings', ['updatedAt'], {
			name: 'idx_jotting_comments_updated'
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('comJottings');
	}
};