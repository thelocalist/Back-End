const crypto = require('crypto');
const { ROLES } = require('../config/constants');

const encrypt = (data, encryptionHash) =>
  crypto.pbkdf2Sync(data, encryptionHash, 1, 128, 'sha1').toString('base64');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING(50),
        validate: {
          isEmail: true,
        },
      },
      role: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: ROLES.CUSTOMER,
        validate: {
          isIn: {
            args: [Object.values(ROLES)],
          },
        },
      },
      refreshToken: {
        type: DataTypes.STRING,
        unique: true,
      },
      encryptionHash: {
        type: DataTypes.STRING,
      },
      encryptedPassword: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.VIRTUAL,
        set(password) {
          const encryptionHash = crypto.randomBytes(128).toString('base64');
          this.setDataValue('password', password);
          this.setDataValue('encryptionHash', encryptionHash);
          this.setDataValue(
            'encryptedPassword',
            encrypt(password, encryptionHash)
          );
        },
      },
    },
    {
      indexes: [
        {
          unique: true,
          name: 'user_unique_email',
          fields: [sequelize.fn('lower', sequelize.col('email'))],
        },
      ],
    }
  );

  // TODO uncomment when will be ready to add users
  // User.associate = function(models) {
  //   User.hasMany(models.Story);
  // };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());

    delete values.password;
    delete values.encryptionHash;
    delete values.encryptedPassword;
    delete values.refreshToken;
    return values;
  };

  User.prototype.isEqualPassword = function(password) {
    return encrypt(password, this.encryptionHash) === this.encryptedPassword;
  };

  return User;
};
