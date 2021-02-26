const router = require('express').Router();
const passport = require('passport');
const pick = require('lodash/pick');
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
          ...pick(body, ['title']),
          imagePath: uiPath,
        })
      ),
    update: (id, body) =>
      Community.findOne({ where: { id } }).then((community) => {
        if (!community) {
          return Promise.reject();
        }

        return (body.image
          ? imageUpload(body.image).then((imageUiPath) =>
              removeUploadIfExists(community.imagePath).then(() => imageUiPath)
            )
          : Promise.resolve()
        )
          .then((imageUiPath) =>
            community.update({
              ...pick(body, ['title']),
              imagePath: imageUiPath || community.imagePath,
            })
          )
          .catch((error) => console.log(error));
      }),
  })
);

router.use(
  crud('/stories', {
    ...sequelizeCrud(Story),
    create: (body) =>
      Promise.all([
        imageUpload(body.headerImage),
        imageUpload(body.authorImage),
      ]).then(([headerImageUiPath, authorImageUiPath]) => {
        if (body.isMainStory) {
          Story.findOne({ where: { isMainStory: true } })
            .then((mainStory) => {
              mainStory.update({ isMainStory: false });
            })
            .catch((error) => {
              console.log(error);
            });
        }

        return Story.create({
          ...pick(body, [
            'title',
            'authorName',
            'communityId',
            'isFeatured',
            'content',
            'neighborhood',
            'isMainStory',
          ]),
          headerImagePath: headerImageUiPath,
          authorImagePath: authorImageUiPath,
        });
      }),
    update: (id, body) =>
      Story.findOne({ where: { id } }).then((story) => {
        if (!story) {
          return Promise.reject();
        }

        if (body.isMainStory) {
          Story.findOne({ where: { isMainStory: true } })
            .then((mainStory) => {
              if (mainStory.id !== id) {
                mainStory.update({ isMainStory: false });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }

        return Promise.all([
          body.headerImage
            ? imageUpload(body.headerImage).then((headerImageUiPath) =>
                removeUploadIfExists(story.headerImagePath).then(
                  () => headerImageUiPath
                )
              )
            : Promise.resolve(),

          body.authorImage
            ? imageUpload(body.authorImage).then((authorImageUiPath) =>
                removeUploadIfExists(story.authorImagePath).then(
                  () => authorImageUiPath
                )
              )
            : Promise.resolve(),
        ])
          .then(([headerImageUiPath, authorImageUiPath]) =>
            story.update({
              ...pick(body, [
                'title',
                'authorName',
                'communityId',
                'isFeatured',
                'content',
                'neighborhood',
                'isMainStory',
              ]),
              headerImagePath: headerImageUiPath || story.headerImagePath,
              authorImagePath: authorImageUiPath || story.authorImagePath,
            })
          )
          .catch((error) => console.log(error));
      }),
  })
);

module.exports = router;
