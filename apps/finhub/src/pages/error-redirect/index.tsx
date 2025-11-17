import SappButton from '@components/base/button/SappButton'
import { LAYOUT } from '@lms/core'
import SAPP_OOps from '@assets/images/Oops.svg'
import Image from 'next/image'

const ErrorRedirectPage = () => {
  return (
    <div className="flex h-screen flex-col flex-nowrap items-center justify-center gap-6 p-4 text-center">
      <Image
        src={SAPP_OOps}
        alt="SAPP Oops"
        width={321}
        height={142}
        priority
      />
      <h1 className="text-center font-inter text-3xl font-semibold text-bw-11">
        Oops!
      </h1>
      <p className="text-center font-inter text-lg font-normal text-gray-9">
        Something went wrong. Please try again.
      </p>
      <SappButton
        title="Back to Home Page"
        full={false}
        className="rounded-2.5 !px-6 py-4 font-inter text-sm !leading-4"
        size="large"
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/'
          }
        }}
      />
    </div>
  )
}

export default ErrorRedirectPage
ErrorRedirectPage.layout = LAYOUT.ERROR_LAYOUT
