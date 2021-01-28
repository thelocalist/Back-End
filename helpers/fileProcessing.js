const Jimp = require('jimp');
const crypto = require('crypto');
const fs = require('fs');

const { PUBLIC_PATH, IMAGE_SIZES } = require('../config/constants');

const createSecureFileName = (filename) =>
  crypto
    .createHash('md5')
    .update(filename)
    .digest('hex');

const resizeImageToFile = (file, destinationFolderPath) =>
  Jimp.read(file.buffer).then((image) => {
    const newFileName = createSecureFileName(file.filename);
    const largeImageFileName = `large-${newFileName}`;
    const thumbnailImageFileName = `thumbnail-${newFileName}`;

    image
      .resize(IMAGE_SIZES.LARGE, IMAGE_SIZES.LARGE)
      .write(`${PUBLIC_PATH}${destinationFolderPath}/${largeImageFileName}`);

    image
      .resize(IMAGE_SIZES.THUMBNAIL, IMAGE_SIZES.THUMBNAIL)
      .write(
        `${PUBLIC_PATH}${destinationFolderPath}/${thumbnailImageFileName}`
      );

    return {
      largeImageFileName,
      thumbnailImageFileName,
    };
  });

const writeFile = (file, destinationPath) =>
  new Promise((resolve, reject) => {
    const newFileName = createSecureFileName(file.filename);

    fs.writeFile(
      file.buffer,
      `${PUBLIC_PATH}${destinationPath}${newFileName}`,
      (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(newFileName);
      }
    );
  });

module.exports = {
  resizeImageToFile,
  writeFile,
};
