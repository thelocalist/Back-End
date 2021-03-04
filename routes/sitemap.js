const router = require('express').Router();
const generateSitemap = require('../helpers/generateSitemap');

/**
 * Generate sitemap
 * @route GET /sitemap/generate
 * @group Contacts
 * @returns {string} 200 - Result
 */
router.get('/generate', (req, res, next) =>
  generateSitemap()
    .then(() => res.send(`sitemap.xml generated ${new Date()}`))
    .catch(next)
);

module.exports = router;
