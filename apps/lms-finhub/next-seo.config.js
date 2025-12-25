/* eslint-disable import/no-anonymous-default-export */
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

// eslint-disable-next-line import/no-unused-modules
export default {
  title: '',
  titleTemplate: '%s - SAPP',
  description: 'SAPP description',
  canonical: publicRuntimeConfig.hostURL,
  defaultOpenGraphImageHeight: 1200,
  defaultOpenGraphImageWidth: 630,
  languageAlternates: ['en', 'vi'],

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: publicRuntimeConfig.hostURL,
    title: 'SAPP',
    description: 'SAPP descrtiption',

    images: [
      {
        url: 'https://d3s1adm34w18qs.cloudfront.net/assets/home.webp',
        width: 1200,
        height: 630,
        alt: 'SAPP',
      },
    ],
    site_name: 'SAPP',
  },
  twitter: {
    handle: '@sapp',
    site: '@sapp',
    cardType: 'summary_large_image',
  },
}
