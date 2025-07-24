import { useRouter } from 'next/router'
import Image from 'next/image'
import SAPP_Logo from '@assets/images/sapp_logo.svg'
import SAPPButtonV2 from '@components/base/button/SAPPButtonV2'
import { useStaticModalContext } from '@contexts/StaticModalContext'
import BaseStaticModal from '@components/base/modal/BaseStaticModal'
import clsx from 'clsx'

const destinations = [
  {
    image: SAPP_Logo,
    title: 'General Course',
    path: undefined,
  },
]

export default function RedirectModal() {
  const { isVisibleRedirectModal, setVisibleRedirectModal } =
    useStaticModalContext()

  const router = useRouter()

  const handleRedirect = () => {
    setVisibleRedirectModal(false)

    router.push('/courses')
  }

  const handleCancel = () => {
    setVisibleRedirectModal(false)
  }

  return (
    <BaseStaticModal visible={isVisibleRedirectModal} title="Redirect to">
      <div className="mb-4 mt-4 md:mb-6 md:mt-10">
        {destinations.map((destination, index) => (
          <div
            key={index}
            className={clsx('flex items-center justify-center gap-6 py-4', {
              'cursor-pointer': destination.path,
            })}
          >
            <div className="relative h-[50px] w-[120px] md:w-[150px]">
              <Image
                src={destination.image}
                objectFit="contain"
                layout="fill"
                alt={destination.title}
              />
            </div>
            <div className="border-bw-15 h-[27px] border-r border-solid" />
            <div className="text-base font-semibold md:text-lg">
              {destination.title}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-y-4 text-center">
        <div>
          <SAPPButtonV2
            title="Confirm"
            onClick={handleRedirect}
            className="w-full"
          />
        </div>
        <div
          className="cursor-pointer hover:text-primary"
          onClick={handleCancel}
        >
          Stay at Master Finance
        </div>
      </div>
    </BaseStaticModal>
  )
}
