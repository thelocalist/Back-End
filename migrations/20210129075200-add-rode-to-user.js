module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'role', Sequelize.STRING(15));
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('Users', 'role');
  },
};
