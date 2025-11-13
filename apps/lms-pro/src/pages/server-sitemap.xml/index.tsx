import getConfig from 'next/config'
const EXTERNAL_DATA_URL = 'https://jsonplaceholder.typicode.com/posts'

const { publicRuntimeConfig } = getConfig()
const { hostURL } = publicRuntimeConfig

function generateSiteMap(posts: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!--We manually set the two URLs we know already-->
      <url>
        <loc>${hostURL}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${hostURL + '/thank-you'}</loc> 
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${hostURL + '/guide-of-honor'}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${hostURL + '/past-winners'}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${hostURL + '/promotions'}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${hostURL + '/faqs'}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${hostURL + '/dont-forget'}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${hostURL + '/terms-and-conditions'}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      ${['sg', 'my', 'id', 'vn', 'th', 'ph', 'hk', 'tw']
        .map((location) => {
          return `
          <url>
            <loc>${hostURL + '/' + location}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
          </url>
      `
        })
        .join('')}
      ${posts
        .map(({ id }) => {
          return `
        <url>
            <loc>${`${EXTERNAL_DATA_URL}/${id}`}</loc>
        </url>
      `
        })
        .join('')}
    </urlset>
  `
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: any) {
  // We make an API call to gather the URLs for our site
  //   const request = await fetch(EXTERNAL_DATA_URL)
  //   const posts = await request.json()

  const sitemap = generateSiteMap([])

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
