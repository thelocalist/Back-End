const router = require('express').Router();
const passport = require('passport');
const { User } = require('../models');
const { createAndSaveAuthTokens } = require('../helpers/tokens');

/**
 * @typedef UserCreationData
 * @property {string} email
 * @property {string} password
 */

/**
 * @route POST /users
 * @group Users
 * @param {UserCreationData.model} .body.required - User registration data
 * @returns {User.model} 200 - Created User
 */
router.post('/', (req, res, next) => {
  User.findOne({ where: { email: req.body.email } }).then((user) => {
    if (user) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    return null;
  });
  User.create({
    email: req.body.email,
    password: req.body.password,
  })
    .then((user) => createAndSaveAuthTokens(user, req))
    .then((tokenData) => res.json(tokenData))
    .catch(next);
});

router.get('/', (req, res) => {
  User.findAll().then((users) =>
    res
      .header('Content-Range', `posts 0-${users.length}/${users.length}`)
      .header('Access-Control-Expose-Headers', 'Content-Range')
      .json(users)
  );
});

/**
 * @route GET /users
 * @group Users
 * @security JWT
 * @returns {Array.<User>} 200 - Users list
 */
router.get('/', passport.authenticate('jwt'), (req, res, next) => {
  User.findAll()
    .then((keys) => res.json(keys))
    .catch(next);
});

module.exports = router;
