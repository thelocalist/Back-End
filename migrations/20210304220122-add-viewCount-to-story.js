module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Stories', 'viewCount', Sequelize.INTEGER, {
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('Stories', 'viewCount');
  },
};
