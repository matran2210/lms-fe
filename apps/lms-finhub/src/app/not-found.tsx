'use client'
import { SappButton } from '@lms/ui'
import Image from 'next/image'
import Link from 'next/link'
import { PageLink } from 'src/constants/routes'

const ErrorPage = () => {
  return (
    <div className="flex h-screen flex-col flex-nowrap items-center justify-center overflow-y-auto p-4 text-center">
      <Image
        className="h-auto w-80"
        src="/assets/images/image_404.jpg"
        alt="Page not found"
        width={320}
        height={260}
        priority
        sizes="320px"
      />
      <h1 className="mt-10 text-2xl font-bold text-[#050505] md:text-4xl">
        PAGE NOT FOUND
      </h1>
      <span className="mt-3 max-w-[646px] px-4 text-base text-[#A1A1A1]">
        We are very sorry for the inconvenience. It looks like you&apos;re
        trying to access a page that has been deleted or never even existed.
      </span>
      <Link href={PageLink.SHORT_COURSE}>
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

export default ErrorPage
