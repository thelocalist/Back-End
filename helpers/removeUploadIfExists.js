const fs = require('fs');
const { UPLOAD_SERVER_PATH, UPLOAD_UI_PATH } = require('../config/constants');

const removeUploadIfExists = (uiPath) => {
  if (!uiPath) {
    return Promise.resolve();
  }

  return new Promise((resolve) =>
    fs.unlink(
      uiPath.replace(UPLOAD_UI_PATH, UPLOAD_SERVER_PATH),
      (err, res) => {
        if (err) {
          console.error(err);
        }
        resolve(res);
      }
    )
  );
};

module.exports = removeUploadIfExists;
