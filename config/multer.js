const multer = require('multer');
const { MAX_UPLOAD_SIZE } = require('./constants');

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_SIZE },
  fileFilter: (req, file, cb) => {
    if (!/^image\//.test(file.mimetype)) {
      cb(new Error('Wrong file type'));
      return;
    }

    cb(null, true);
  },
});

module.exports = {
  imageUpload,
};
