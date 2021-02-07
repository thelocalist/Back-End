const base64Img = require('base64-img');
const { UPLOAD_SERVER_PATH, UPLOAD_UI_PATH } = require('./constants');

const imageUpload = (image) => {
  console.log(UPLOAD_SERVER_PATH);

  return new Promise((resolve, reject) =>
    base64Img.img(
      image,
      UPLOAD_SERVER_PATH,
      Date.now(),
      (err, serverFilepath) => {
        if (err) {
          reject(err);
          return;
        }

        console.log({ serverFilepath });
        const uiPath = serverFilepath.replace(
          UPLOAD_SERVER_PATH,
          UPLOAD_UI_PATH
        );

        console.log({ uiPath });
        resolve(uiPath);
      }
    )
  );
};

module.exports = {
  imageUpload,
};
