module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Stories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      headerImagePath: Sequelize.STRING,
      authorImagePath: Sequelize.STRING,
      authorName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      communityId: Sequelize.INTEGER,
      isFeatured: Sequelize.BOOLEAN,
      content: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('Stories');
  },
};
