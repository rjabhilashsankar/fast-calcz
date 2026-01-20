/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.fastcalculator.app/',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.8,
  exclude: ['/404', '/_not-found'], // optional
};