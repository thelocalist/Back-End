const path = require('path');

const IMAGE_SIZES = {
  LARGE: 1280,
  THUMBNAIL: 300,
};
const UPLOAD_SUB_PATH = path.resolve('/uploads');
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10M

const ROLES = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
};

module.exports = {
  SECRET_KEY: process.env.SECRET_KEY,
  FRONT_APP_URL: process.env.FRONT_APP_URL,
  AUTH_TOKEN_EXPIRATION_TIME: '30m',
  RESET_PASSWORD_TOKEN_EXPIRATION_TIME: '120m',
  EMAIL_FROM: `Support <support@${process.env.MAILGUN_DOMAIN}>`,
  UPLOAD_SUB_PATH,
  MAX_UPLOAD_SIZE,
  IMAGE_SIZES,
  ROLES,
};
