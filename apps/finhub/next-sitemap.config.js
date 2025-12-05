/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_HOST_URL,
  generateRobotsTxt: true,
  exclude: ['/api/*', '/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      process.env.NEXT_PUBLIC_HOST_URL + '/server-sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        disallow: '/api/*',
      },
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}
