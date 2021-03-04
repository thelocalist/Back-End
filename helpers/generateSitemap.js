const fs = require('fs');
const { SitemapStream } = require('sitemap');

const { Community, Story } = require('../models');
const { FRONT_APP_URL } = require('../config/constants');

const SITEMAP_FILE_PATH = 'public/sitemap.xml';
const SITEMAP_STATIC_PATHS = ['/', '/home'];

const withFileStreamPromise = (filePath, callback) =>
  new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(filePath, { flags: 'w+' });

    const startTime = new Date();
    const resolveWithTimeSpent = () => resolve(new Date() - startTime);

    fileStream.on('finish', resolveWithTimeSpent);
    fileStream.on('end', resolveWithTimeSpent);
    fileStream.on('error', reject);

    callback(fileStream, resolveWithTimeSpent, reject);
  });

const generateSitemapXml = () =>
  withFileStreamPromise(
    SITEMAP_FILE_PATH,
    async (fileStream, resolve, reject) => {
      const sitemapStream = new SitemapStream({ hostname: FRONT_APP_URL });
      sitemapStream.pipe(fileStream);
      sitemapStream.on('error', reject);

      SITEMAP_STATIC_PATHS.forEach((path) => sitemapStream.write(`${path}\n`));

      // Stories
      Story.findAll()
        .then((stories) =>
          stories.forEach(({ id }) => {
            sitemapStream.write(`/story/${id}\n`);
          })
        )
        .then(() =>
          // Communities
          Community.findAll().then((communities) =>
            communities.forEach(({ id }) => {
              sitemapStream.write(`/community/${id}\n`);
            })
          )
        )
        .then(() => sitemapStream.end())
        .catch(reject);
    }
  );

module.exports = generateSitemapXml;
