const router = require('express').Router();
const { pick } = require('lodash');
const passport = require('passport');
const { Sequelize } = require('sequelize');
const { Story } = require('../models');

const { Op } = Sequelize;

/**
 * Get Stories list
 * @route GET /stories
 * @group Stories
 * @param {string} isFeatured.query - e.g. true
 * @param {string} isMainStory.query - e.g. true
 * @param {number} pageIndex.query - e.g. 0
 * @param {number} pageSize.query - e.g. 20
 * @param {number} sortField.query - e.g. updatedAt
 * @param {number} sortOrder.query - e.g. desc
 * @returns {Array.<Story>} 200 - Stories list
 */
router.get('/', (req, res, next) => {
  const {
    isFeatured,
    isMainStory = false,
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

  if (isMainStory !== undefined) {
    dbQuery.where.isMainStory = isMainStory;
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
 * @property {string} neighborhood
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
      'neighborhood',
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
 * @param {string} isFeatured.query - e.g. true
 * @param {string} isMainStory.query - e.g. true
 * @param {string} filterType.query
 * @param {string} filterValue.query
 * @param {string} keywords.query
 * @param {number} pageIndex.query - e.g. 0
 * @param {number} pageSize.query - e.g. 20
 * @returns {Array.<Story>} 200 - Stories list
 */

/* eslint-disable */
router.get('/search', async (req, res, next) => {
  const {
    pageSize,
    pageIndex,
    filterType,
    filterValue,
    keywords,
    sortField = 'updatedAt',
    sortOrder = 'desc',
    isFeatured,
    isMainStory,
  } = req.query;

  console.log(req.query);

  const dbQuery = {
    limit: +pageSize,
    offset: +pageIndex * +pageSize,
    order: [[sortField, sortOrder]],
  };

  if (filterType === 'authorName') {
    dbQuery.where = {
      authorName: { [Op.iLike]: `%${keywords}%` },
    };
  }

  if (filterType === 'keywords') {
    dbQuery.where = {
      title: { [Op.iLike]: `%${keywords}%` },
    };
  }

  if (filterType === 'communityId') {
    dbQuery.where = {
      title: { [Op.iLike]: `%${keywords}%` },
      communityId: filterValue,
    };
  }

  if (filterType === 'neighborhood') {
    dbQuery.where = {
      neighborhood: filterValue.toLowerCase(),
      title: { [Op.iLike]: `%${keywords}%` },
    };
  }

  if (filterType === 'communityId,neighborhood') {
    const filterValues = filterValue.split(',');
    dbQuery.where = {
      communityId: filterValues[0],
      neighborhood: filterValues[1].toLowerCase(),
      title: { [Op.iLike]: `%${keywords}%` },
    };
  }

  if (isFeatured !== undefined) {
    if (!dbQuery.where) {
      dbQuery.where = {};
    }
    dbQuery.where.isFeatured = isFeatured;
  }

  if (isMainStory !== undefined) {
    if (!dbQuery.where) {
      dbQuery.where = {};
    }
    dbQuery.where.isMainStory = isMainStory;
  }

  Story.findAndCountAll(dbQuery)
    .then((stories) => res.json(stories))
    .catch(next);
});

/* eslint-disable */

/**
 * Get single Story
 * @route GET /stories/{id}
 * @group Stories
 * @param {integer} id.path.required
 * @returns {Story.model} 200 - Story
 */
router.get('/:id', (req, res, next) =>
  Story.findByPk(req.params.id)
    .then((story) => {
      if (story) {
        res.json(story);
      } else {
        res.status(404).json({ message: 'Nothing found' });
      }
    })
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
      'neighborhood',
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
