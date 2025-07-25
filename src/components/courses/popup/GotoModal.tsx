import { useRouter } from 'next/router'
import Image from 'next/image'
import SAPP_Logo from '@assets/images/sapp_logo.svg'
import GotoImage from '@assets/images/goto-image.png'
import { useStaticModalContext } from '@contexts/StaticModalContext'
import BaseStaticModal from '@components/base/modal/BaseStaticModal'
import { PageLink } from 'src/constants'
import clsx from 'clsx'

const destinations = [
  {
    image: GotoImage,
    title: 'Master Finance',
    path: PageLink.SHORT_COURSE,
  },
  {
    image: SAPP_Logo,
    title: 'General Course',
    path: PageLink.COURSES,
    classNameHeight: 'h-[50px]',
  },
]

export default function GotoModal() {
  const { isVisibleGotoModal, setVisibleGotoModal } = useStaticModalContext()
  const router = useRouter()

  const handleRedirect = (path: string) => {
    setVisibleGotoModal(false)
    router.push(path)
  }

  return (
    <BaseStaticModal visible={isVisibleGotoModal} title="Where you want to go?">
      <div className="mt-6 flex flex-col gap-y-4 md:mt-10 md:gap-y-6">
        {destinations.map((destination, index) => (
          <div
            key={index}
            className="flex cursor-pointer items-center justify-center gap-6 rounded-lg border border-solid border-white py-2 hover:border-primary md:py-4"
            onClick={() => handleRedirect(destination.path)}
          >
            <div
              className={clsx(
                'relative h-[40px] w-[120px] md:h-[50px] md:w-[150px]',
                destination.classNameHeight,
              )}
            >
              <Image
                src={destination.image}
                objectFit="contain"
                layout="fill"
                alt={destination.title}
              />
            </div>
            <div className="border-bw-15 h-[27px] border border-solid" />
            <div className="text-base font-semibold md:text-xl">
              {destination.title}
            </div>
          </div>
        ))}
      </div>
    </BaseStaticModal>
  )
}
