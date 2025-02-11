module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('comArticles', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			content: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			articleId: {
				type: Sequelize.UUID,
				references: {
					model: 'articles',
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

		await queryInterface.addIndex('comArticles', ['articleId'], {
			name: 'idx_article_comments_article'
		});

		await queryInterface.addIndex('comArticles', ['userId'], {
			name: 'idx_article_comments_user'
		});

		await queryInterface.addIndex('comArticles', ['createdAt'], {
			name: 'idx_article_comments_created'
		});

		await queryInterface.addIndex('comArticles', ['updatedAt'], {
			name: 'idx_article_comments_updated'
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('comArticles');
	}
};