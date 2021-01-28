module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef Community
   * @property {integer} id
   * @property {string} title
   * @property {string} imagePath
   * @property {string} createdAt ISO format
   * @property {string} updatedAt ISO format
   */
  const Community = sequelize.define(
    'Community',
    {
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      imagePath: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {}
  );

  return Community;
};
