const cron = require('node-cron');

const generateSitemap = require('../helpers/generateSitemap');

// every day update sitemap.xml
cron.schedule('0 4 * * *', generateSitemap);
