module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Stories',
      'neighborhood',
      Sequelize.STRING()
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('Stories', 'neighborhood');
  },
};
