/* eslint-disable import/no-anonymous-default-export */
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

// eslint-disable-next-line import/no-unused-modules
export default {
  title: '',
  titleTemplate: '%s - Upbase',
  description: 'Upbase description',
  canonical: publicRuntimeConfig.hostURL,
  defaultOpenGraphImageHeight: 1200,
  defaultOpenGraphImageWidth: 630,
  languageAlternates: ['en', 'vi'],

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: publicRuntimeConfig.hostURL,
    title: 'Upbase',
    description: 'Upbase descrtiption',

    images: [
      {
        url: 'https://d3s1adm34w18qs.cloudfront.net/assets/home.webp',
        width: 1200,
        height: 630,
        alt: 'Upbase',
      },
    ],
    site_name: 'Upbase',
  },
  twitter: {
    handle: '@sapp',
    site: '@sapp',
    cardType: 'summary_large_image',
  },
}
