const router = require('express').Router();
const { Sequelize } = require('sequelize');

const { Op } = Sequelize;

const { Community, Story } = require('../models');

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

/**
 * Search Communities
 * @route GET /stories/search
 * @group Stories
 * @param {string} filterType.query
 * @param {string} filterValue.query
 * @param {string} keywords.query
 * @param {number} pageIndex.query - e.g. 0
 * @param {number} pageSize.query - e.g. 20
 * @returns {Array.<Community>} 200 - Communities list
 */

router.get('/search', async (req, res, next) => {
  const {
    pageSize = 10,
    pageIndex = 0,
    filterType,
    filterValue,
    keywords = '',
    sortField = 'updatedAt',
    sortOrder = 'desc',
  } = req.query;

  const dbQuery = {
    limit: +pageSize,
    offset: +pageIndex * +pageSize,
    order: [[sortField, sortOrder]],
  };

  if (filterType === 'keywords') {
    dbQuery.where = {
      title: { [Op.iLike]: `%${keywords}%` },
    };
  }

  if (filterType === 'neighborhood') {
    dbQuery.include = [
      {
        model: Story,
        attributes: [],
        where: { neighborhood: filterValue.toLowerCase() },
      },
    ];
    dbQuery.where = {
      title: { [Op.iLike]: `%${keywords}%` },
    };
  }

  Community.findAndCountAll(dbQuery)
    .then((communities) => res.json(communities))
    .catch(next);
});

module.exports = router;
