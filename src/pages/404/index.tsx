import { LAYOUT } from '@utils/constants'
import React from 'react'
import SappButton from '@components/base/button/SappButton'
import Link from 'next/link'
import { PageLink } from 'src/constants'
import Luckysheet from '@components/base/spreadSheet/Luckysheet'

const ErrorPage = () => {
  return (
    <div className="h-screen flex items-center justify-center flex-col flex-nowrap overflow-y-auto p-4 text-center">
      <img
        className="h-max"
        src="/assets/images/image_404.jpg"
        loading="lazy"
        alt="Image_404"
        width="320"
        height="260"
      />
      <h1 className="text-2xl md:text-4xl text-bw-1 font-bold mt-10">
        PAGE NOT FOUND
      </h1>
      <span className="text-base text-gray-1 max-w-dl px-4 mt-3">
        We are very sorry for inconvenience. It looks like you’re trying to
        access a page that was has been deleted or never even existed.
      </span>
      <Link href={PageLink.DASHBOARD}>
        <div className="mt-8">
          <SappButton
            title="Back to Home"
            full={false}
            className="px-8 md:px-22"
            size="lager"
            type="submit"
          />
        </div>
      </Link>
      {/* <Luckysheet/> */}
    </div>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default ErrorPage
ErrorPage.layout = LAYOUT.ERROR_LAYOUT
