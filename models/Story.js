module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef Story
   * @property {integer} id
   * @property {string} title
   * @property {string} headerImagePath
   * @property {string} authorImagePath
   * @property {string} authorName
   * @property {integer} communityId
   * @property {boolean} isFeatured
   * @property {string} content
   * @property {string} neighborhood
   * @property {string} createdAt ISO format
   * @property {string} updatedAt ISO format
   */
  const Story = sequelize.define(
    'Story',
    {
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      headerImagePath: DataTypes.STRING,
      authorImagePath: DataTypes.STRING,
      authorName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      // TODO uncomment when will be ready to add users
      // userId: DataTypes.INTEGER,
      communityId: DataTypes.INTEGER,
      isFeatured: DataTypes.BOOLEAN,
      content: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      neighborhood: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      hooks: {
        beforeValidate: (story) => {
          if (story.neighborhood) {
            story.neighborhood = story.neighborhood.toLowerCase();
          }
          return story;
        },
      },
    }
  );

  // TODO uncomment when will be ready to add users
  // Story.associate = function(models) {
  //   Story.belongsTo(models.User);
  // };
  return Story;
};
