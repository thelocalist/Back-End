module.exports = {
  up: (queryInterface) =>
    queryInterface.addConstraint('Communities', ['title'], {
      type: 'UNIQUE',
      name: 'unique_community_title',
    }),
  down: (queryInterface) =>
    queryInterface.removeConstraint('Communities', 'unique_community_title'),
};
