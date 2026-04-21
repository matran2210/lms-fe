'use client'
import { LAYOUT } from '@lms/core'
import Image from 'next/image'
import { OopsImage } from '@lms/assets'
import { SappButton } from '../components/base'
import clsx from 'clsx'

interface IRedirectNotBuyPage {
  isPage?: boolean
}
const RedirectNotBuyPage = ({ isPage = true }: IRedirectNotBuyPage) => {
  return (
    <div className={clsx("flex flex-col flex-nowrap items-center justify-center gap-6 p-4 text-center", {
      "h-screen": isPage
    })}>
      <Image
        src={OopsImage}
        alt="SAPP Oops"
        width={321}
        height={142}
        priority
      />
      <h1 className="text-center font-inter text-3xl font-semibold text-[#252F4A]">
        Oops!
      </h1>
      <p className="text-center font-inter text-lg font-normal text-gray-700">
        You have not purchased this feature
      </p>
      <SappButton
        title="Back to Home Page"
        full={false}
        className={clsx("rounded-2.5 !px-6 py-4 font-inter text-sm !leading-4", {
          hidden: !isPage
        })}
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

export default RedirectNotBuyPage
RedirectNotBuyPage.layout = LAYOUT.ERROR_LAYOUT
