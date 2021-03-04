const router = require('express').Router();
const auth = require('./auth');
const admin = require('./admin');
const users = require('./users');
const contacts = require('./contacts');
const stories = require('./stories');
const communities = require('./communities');
const sitemap = require('./sitemap');

router.use('/', auth);
router.use('/admin', admin);
router.use('/users', users);
router.use('/contacts', contacts);
router.use('/stories', stories);
router.use('/communities', communities);
router.use('/sitemap', sitemap);

module.exports = router;
