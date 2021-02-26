module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Stories',
      'isMainStory',
      Sequelize.BOOLEAN,
      {
        allowNull: false,
        defaultValue: false,
      }
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('Stories', 'isMainStory');
  },
};
