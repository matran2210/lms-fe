import { useRouter } from 'next/router'
import Image from 'next/image'
import GotoImage from '@assets/images/goto-image.png'
import SAPPButtonV2 from '@components/base/button/SAPPButtonV2'
import { useStaticModalContext } from '@contexts/StaticModalContext'
import BaseStaticModal from '@components/base/modal/BaseStaticModal'
import clsx from 'clsx'
import { ECourseType, PageLink } from 'src/constants'
import { useCourseContext } from '@contexts/index'
import SappModalV3 from '@components/base/modal/SappModalV3'
import ButtonPrimary from '@components/base/button/ButtonPrimary'

const destinations = [
  {
    image: GotoImage,
    title: 'Master Finance',
    path: undefined,
  },
]

export default function RedirectToMasterModal() {
  const { isVisibleRedirectToMasterModal, setVisibleRedirectToMasterModal } =
    useStaticModalContext()
  const { setGeneralOrMasterCourse } = useCourseContext()
  const router = useRouter()

  const handleRedirect = () => {
    setVisibleRedirectToMasterModal(false)
    setGeneralOrMasterCourse(ECourseType.MASTER)
    router.push(PageLink.SHORT_COURSE)
  }

  const handleCancel = () => {
    setVisibleRedirectToMasterModal(false)
    setGeneralOrMasterCourse(ECourseType.GENERAL)
  }

  return (
    <SappModalV3
      visible={isVisibleRedirectToMasterModal}
      onOk={() => {}}
      handleCancel={() => {}}
      showFooter={false}
    >
      <div className="flex flex-col gap-6 md:gap-10">
        <div className="text-3xl font-semibold">Redirect to</div>
        <div className="p-4">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className={clsx('flex items-center justify-center gap-6', {
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
              <div className="text-base font-semibold md:text-xl">
                {destination.title}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-y-3 text-center">
          <div>
            <ButtonPrimary
              title="Confirm"
              onClick={handleRedirect}
              className="w-full"
              size="medium"
            />
          </div>
          <div
            className="cursor-pointer text-base font-semibold text-gray-800 underline"
            onClick={handleCancel}
          >
            Stay at General Course
          </div>
        </div>
      </div>
    </SappModalV3>
  )
}
