module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef Contact
   * @property {integer} id
   * @property {string} email
   * @property {string} createdAt ISO format
   * @property {string} updatedAt ISO format
   */
  const Contact = sequelize.define(
    'Contact',
    {
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: { isEmail: true },
      },
    },
    {
      indexes: [
        {
          unique: true,
          name: 'contact_unique_email',
          fields: [sequelize.fn('lower', sequelize.col('email'))],
        },
      ],
    }
  );
  return Contact;
};
