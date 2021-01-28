const router = require('express').Router();
const auth = require('./auth');
const admin = require('./admin');
const users = require('./users');
const contacts = require('./contacts');
const stories = require('./stories');
const communities = require('./communities');

router.use('/', auth);
router.use('/admin', admin);
router.use('/users', users);
router.use('/contacts', contacts);
router.use('/stories', stories);
router.use('/communities', communities);

module.exports = router;
