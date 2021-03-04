const fs = require('fs');
const stream = require('stream');
const zlib = require('zlib');
const {
  SitemapAndIndexStream,
  lineSeparatedURLsToSitemapOptions,
  SitemapStream,
} = require('sitemap');

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
      const sitemapStream = new stream.PassThrough();
      sitemapStream.on('error', reject);

      const indexSitemapStream = new SitemapAndIndexStream({
        limit: 10000, // defaults to 45k
        getSitemapStream: (i) => {
          const innerSitemapStream = new SitemapStream({
            hostname: FRONT_APP_URL,
          });
          const path = `sitemap-${i}.xml.gz`;

          innerSitemapStream
            .pipe(zlib.createGzip())
            .pipe(fs.createWriteStream(`public/${path}`, { flags: 'w+' }));

          return [`${FRONT_APP_URL}/${path}`, innerSitemapStream];
        },
      });

      lineSeparatedURLsToSitemapOptions(sitemapStream)
        .pipe(indexSitemapStream)
        .pipe(fileStream);

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
