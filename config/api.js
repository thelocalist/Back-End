const morganLogger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
// const range = require('../middleware/range');

module.exports = (app) => {
  app.use(morganLogger('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: process.env.MAX_BODY_LIMIT }));
  app.use(cors());
};
