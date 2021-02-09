const router = require('express').Router();
const passport = require('passport');
const { crud, sequelizeCrud } = require('express-sequelize-crud');

const { imageUpload } = require('../../config/base64Upload');
const { ROLES } = require('../../config/constants');
const { Contact, Community, Story } = require('../../models');
const { requireRole } = require('../../middleware/roles');
const removeUploadIfExists = require('../../helpers/removeUploadIfExists');

router.all('*', passport.authenticate('jwt'), requireRole(ROLES.ADMIN));

router.use(crud('/contacts', sequelizeCrud(Contact)));

router.use(
  crud('/communities', {
    ...sequelizeCrud(Community),
    create: (body) =>
      imageUpload(body.image).then((uiPath) =>
        Community.create({
          ...body,
          imagePath: uiPath,
        })
      ),
    update: (id, body) => {
      Community.findOne({ where: { id } }).then((community) => {
        if (!community) {
          return Promise.reject();
        }

        if (!body.image) {
          community.title = body.title;
          return community.save();
        }

        return imageUpload(body.image)
          .then((uiPath) =>
            removeUploadIfExists(community.imagePath).then(() => uiPath)
          )
          .then((uiPath) => {
            community.imagePath = uiPath;
            community.title = body.title;
            return community.save();
          })
          .catch((error) => console.log(error));
      });
    },
  })
);

router.use(
  crud('/stories', {
    ...sequelizeCrud(Story),
    create: (body) =>
      Promise.all([
        imageUpload(body.headerImage),
        imageUpload(body.authorImage),
      ]).then(([headerImageUiPath, authorImageUiPath]) =>
        Story.create({
          ...body,
          headerImagePath: headerImageUiPath,
          authorImagePath: authorImageUiPath,
        })
      ),
    update: (id, body) => {
      Story.findOne({ where: { id } }).then((story) => {
        if (!story) {
          return Promise.reject();
        }

        if (!body.headerImage && !body.authorImage) {
          story.content = body.content;
          story.title = body.title;
          story.communityId = body.communityId;
          story.isFeatured = body.isFeatured;
          story.authorName = body.authorName;
          return story.save();
        }

        return Promise.all([
          imageUpload(body.headerImage),
          imageUpload(body.authorImage),
        ])
          .then((newImagePaths) =>
            Promise.all([
              removeUploadIfExists(story.imagePath),
              removeUploadIfExists(story.imagePath),
            ]).then(() => newImagePaths)
          )
          .then(([headerImageUiPath, authorImageUiPath]) => {
            console.log('IMAGES', headerImageUiPath, authorImageUiPath);
            if (headerImageUiPath) {
              story.headerImagePath = headerImageUiPath;
            }
            if (authorImageUiPath) {
              story.authorImagePath = authorImageUiPath;
            }
            story.content = body.content;
            story.title = body.title;
            story.communityId = body.communityId;
            story.isFeatured = body.isFeatured;
            story.authorName = body.authorName;
            return story.save();
          })
          .catch((error) => console.log(error));
      });
    },
  })
);

module.exports = router;
