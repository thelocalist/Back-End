const router = require('express').Router();
const { pick } = require('lodash');
const { Contact } = require('../models');

/**
 * @typedef ContactCreationData
 * @property {string} email
 */

/**
 * Create new Contact
 * @route POST /contacts
 * @group Contacts
 * @param {ContactCreationData.model} .body.required - Contact data
 * @returns {Contact.model} 200 - Created Contact
 */
router.post('/', (req, res, next) => {
  Contact.create(pick(req.body, ['email']))
    .then((contact) => res.json(contact))
    .catch(next);
});

module.exports = router;
