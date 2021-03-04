const api = require('./api');
const debug = require('./debug');
const passport = require('./passport');
const swagger = require('./swagger');
const seeds = require('./seeds');
require('./cron');

module.exports = (app) => {
  debug(app);
  api(app);
  passport(app);
  swagger(app);
  seeds(app);
};
