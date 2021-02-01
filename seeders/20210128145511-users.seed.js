const randToken = require('rand-token');
const crypto = require('crypto');

const encrypt = (data, encryptionHash) =>
  crypto.pbkdf2Sync(data, encryptionHash, 1, 128, 'sha1').toString('base64');
const encryptionHash = crypto.randomBytes(128).toString('base64');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          email: process.env.ADMIN_EMAIL,
          role: 'ADMIN',
          createdAt: new Date(),
          updatedAt: new Date(),
          encryptionHash,
          encryptedPassword: encrypt(
            process.env.ADMIN_PASSWORD,
            encryptionHash
          ),
          refreshToken: randToken.uid(255),
        },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
