import { useAppSelector, userReducer } from '@lms/contexts'
import { LAYOUT } from '@lms/core'
import { SappButton } from '@lms/ui'
import Link from 'next/link'
import { PageLink } from 'src/constants/routes'

const ErrorPage = () => {
  const userSlice = useAppSelector(userReducer)

  const getRedirectPath = () => {
    if (userSlice.user.type === 'STUDENT') {
      return PageLink.SHORT_COURSE
    }
    if (userSlice.user.type === 'TEACHER') {
      return PageLink.TEACHERS
    }
    return '/'
  }

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
        We are very sorry for the inconvenience. It looks like you&apos;re trying to
        access a page that has been deleted or never even existed.
      </span>
      <Link href={getRedirectPath()}>
        <div className="mt-8">
          <SappButton
            title="Back to Home"
            full={false}
            className="px-8 md:px-22"
            size="large"
            type="submit"
          />
        </div>
      </Link>
    </div>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default ErrorPage
ErrorPage.layout = LAYOUT.ERROR_LAYOUT
