import SappButton from '@components/base/button/SappButton'
import { LAYOUT } from '@utils/constants'
import Link from 'next/link'
import { PageLink } from 'src/constants'

const ErrorRedirectPage = () => {
  return (
    <div className="flex h-screen flex-col flex-nowrap items-center justify-center overflow-y-auto p-4 text-center">
      <img
        className="h-max"
        src="/assets/images/image_500.jpg"
        loading="lazy"
        alt="Error"
        width="320"
        height="260"
      />
      <h1 className="mt-10 text-2xl font-bold text-bw-1 md:text-4xl">
        SOMETHING WENT WRONG
      </h1>
      <span className="mt-3 max-w-dl px-4 text-base text-gray-1">
        An unexpected error occurred. Please try again or go back to the home
        page.
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
    </div>
  )
}

export default ErrorRedirectPage
ErrorRedirectPage.layout = LAYOUT.ERROR_LAYOUT
