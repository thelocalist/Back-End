const router = require('express').Router();
const passport = require('passport');
const { crud, sequelizeCrud } = require('express-sequelize-crud');
const { ROLES } = require('../../config/constants');
const { Contact, Community, Story } = require('../../models');
const { requireRole } = require('../../middleware/roles');

router.all('*', passport.authenticate('jwt'), requireRole(ROLES.ADMIN));

router.use(crud('/contacts', sequelizeCrud(Contact)));
router.use(
  crud('/communities', {
    ...sequelizeCrud(Community),
    create: (body) => {
      return Community.create({
        ...body,
        imagePath: '/uploads/community.jpg',
      });
    },
    update: (id, body) => {
      return Community.update(
        { ...body, headerImagePath: '/uploads/story.jpg' },
        { where: { id } }
      );
    },
  })
);

router.use(
  crud('/stories', {
    ...sequelizeCrud(Story),
    create: (body) => {
      console.log(body);
      return Story.create({
        ...body,
        headerImagePath: '/uploads/story.jpg',
        authorImagePath: '/uploads/author.jpg',
      });
    },
    update: (id, body) => {
      return Story.update(
        {
          ...body,
          headerImagePath: '/uploads/story.jpg',
          authorImagePath: '/uploads/author.jpg',
        },
        { where: { id } }
      );
    },
  })
);

module.exports = router;
