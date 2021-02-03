const router = require('express').Router();
const { pick } = require('lodash');
const passport = require('passport');
const { Sequelize } = require('sequelize');
const { Story, Community } = require('../models');

const { Op } = Sequelize;

/**
 * Get Stories list
 * @route GET /stories
 * @group Stories
 * @param {string} isFeatured.query - e.g. true
 * @param {number} pageIndex.query - e.g. 0
 * @param {number} pageSize.query - e.g. 20
 * @param {number} sortField.query - e.g. updatedAt
 * @param {number} sortOrder.query - e.g. desc
 * @returns {Array.<Story>} 200 - Stories list
 */
router.get('/', (req, res, next) => {
  const {
    isFeatured,
    pageIndex = 0,
    pageSize = 20,
    sortField = 'updatedAt',
    sortOrder = 'desc',
  } = req.query;

  const dbQuery = {
    where: {},
    // include: [User],
    limit: +pageSize,
    offset: +pageIndex * +pageSize,
    order: [[sortField, sortOrder]],
  };

  if (isFeatured) {
    dbQuery.where.isFeatured = isFeatured === 'true';
  }

  Story.findAndCountAll(dbQuery)
    .then(({ count, rows }) =>
      res.json({ totalItemsCount: count, pageIndex: +pageIndex, data: rows })
    )
    .catch(next);
});

/**
 * @typedef StoryCreationData
 * @property {string} title
 * @property {string} headerImagePath
 * @property {string} authorName
 * @property {integer} communityId
 * @property {boolean} isFeatured
 * @property {string} content
 */

/**
 * Create new Story
 * @route POST /stories
 * @group Stories
 * @security JWT
 * @param {StoryCreationData.model} .body.required - Story data
 * @returns {Story.model} 200 - Created Story
 */
router.post('/', passport.authenticate('jwt'), (req, res, next) => {
  Story.create({
    ...pick(req.body, [
      'title',
      'headerImagePath',
      'authorName',
      'communityId',
      'isFeatured',
      'content',
    ]),
    userId: req.user.id,
  })
    .then((story) => res.json(story))
    .catch(next);
});

/**
 * Search Stories
 * @route GET /stories/search
 * @group Stories
 * @param {string} filterType.query
 * @param {string} filterValue.query
 * @param {string} keywords.query
 * @param {number} pageIndex.query - e.g. 0
 * @param {number} pageSize.query - e.g. 20
 * @returns {Array.<Story>} 200 - Stories list
 */
router.get('/search', async (req, res, next) => {
  const {
    pageSize,
    pageIndex,
    filterType,
    filterValue,
    keywords,
    sortField = 'updatedAt',
    sortOrder = 'desc',
  } = req.query;

  let dbQuery = {};

  if (filterType === 'authorName') {
    dbQuery = {
      where: { authorName: { [Op.iLike]: `%${keywords}%` } },
      // include: [User],
      limit: +pageSize,
      offset: +pageIndex * +pageSize,
      order: [[sortField, sortOrder]],
    };
  }

  if (filterType === 'keywords') {
    dbQuery = {
      where: { title: { [Op.iLike]: `%${keywords}%` } },
      limit: +pageSize,
      offset: +pageIndex * +pageSize,
      order: [[sortField, sortOrder]],
    };
  }

  if (filterType === 'communityId') {
    const community = await Community.findOne({
      where: { title: filterValue },
    });
    dbQuery = {
      where: {
        title: { [Op.iLike]: `%${keywords}%` },
        communityId: community.id,
      },
      limit: +pageSize,
      offset: +pageIndex * +pageSize,
      order: [[sortField, sortOrder]],
    };
  }

  if (filterType === 'location') {
    dbQuery = {
      where: {},
      limit: +pageSize,
      offset: +pageIndex * +pageSize,
      order: [[sortField, sortOrder]],
    };
  }

  Story.findAndCountAll(dbQuery)
    .then((stories) => res.json(stories))
    .catch(next);
});

/**
 * Get single Story
 * @route GET /stories/{id}
 * @group Stories
 * @param {integer} id.path.required
 * @returns {Story.model} 200 - Story
 */
router.get('/:id', (req, res, next) =>
  Story.findByPk(req.params.id)
    .then((story) => res.json(story))
    .catch(next)
);

/**
 * Update single Story
 * @route PATCH /stories/{id}
 * @group Stories
 * @security JWT
 * @param {integer} id.path.required
 * @param {StoryCreationData.model} .body.required
 * @returns {Story.model} 200 - Updated Story
 */
router.patch('/:id', (req, res, next) =>
  Story.update(
    pick(req.body, [
      'title',
      'headerImagePath',
      'authorName',
      'communityId',
      'isFeatured',
      'content',
    ]),
    {
      where: { id: req.params.id, userId: req.user.id },
      returning: true,
    }
  )
    .then((story) => res.json(story))
    .catch(next)
);

/**
 * Delete single Story
 * @route DELETE /stories/{id}
 * @group Stories
 * @security JWT
 * @param {integer} id.path.required
 * @returns {integer} 200 - Deleted count
 */
router.delete('/:id', passport.authenticate('jwt'), (req, res, next) =>
  Story.destroy({
    where: { id: req.params.id, userId: req.user.id },
  })
    .then((story) => res.json(story))
    .catch(next)
);

module.exports = router;
