const router = require('express').Router();
const { Community } = require('../models');

/**
 * Get Communities list
 * @route GET /communities
 * @group Communities
 * @returns {Array.<Community>} 200 - Communities list
 */
router.get('/', (req, res, next) => {
  Community.findAll()
    .then((communities) => res.json(communities))
    .catch(next);
});

module.exports = router;
