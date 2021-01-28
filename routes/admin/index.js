const router = require('express').Router();
const passport = require('passport');
const { crud, sequelizeCrud } = require('express-sequelize-crud');
const { ROLES } = require('../../config/constants');
const { Contact, Community, Story } = require('../../models');
const { requireRole } = require('../../middleware/roles');

router.all('*', passport.authenticate('jwt'), requireRole(ROLES.ADMIN));

router.use(crud('/contacts', sequelizeCrud(Contact)));
router.use(crud('/communities', sequelizeCrud(Community)));
router.use(crud('/stories', sequelizeCrud(Story)));

module.exports = router;
