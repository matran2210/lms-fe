import SappButton from '@components/base/button/SappButton'
import { LAYOUT } from '@utils/constants'
import Link from 'next/link'
import { PageLink } from 'src/constants'

const ErrorPage = () => {
  return (
    <div className="flex h-screen flex-col flex-nowrap items-center justify-center overflow-y-auto p-4 text-center">
      <img
        className="h-max"
        src="/assets/images/image_404.jpg"
        loading="lazy"
        alt="Image_404"
        width="320"
        height="260"
      />
      <h1 className="mt-10 text-2xl font-bold text-bw-1 md:text-4xl">
        PAGE NOT FOUND
      </h1>
      <span className="mt-3 max-w-dl px-4 text-base text-gray-1">
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
