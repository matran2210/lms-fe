import { ArrowRightV2Icon } from '@assets/icons'
import PinnedNotificationsV2 from '@components/layout/PinnedNotifications/PinnedNotificationsV2'
import { formatDateToLongString } from '@utils/helpers'
import Image from 'next/image'
import { useRouter } from 'next/router'

interface IProps {
  pinnedCompletedCourse: {
    isOpen: boolean
    passedAt: string
    userCertificateUrl: string
    userCertificateId: string
    courseName: string
  }
}
const PinnedCompletedCourse = ({ pinnedCompletedCourse }: IProps) => {
  const router = useRouter()
  const {
    isOpen,
    passedAt,
    userCertificateUrl,
    userCertificateId,
    courseName,
  } = pinnedCompletedCourse

  const onSeeCertificate = () => {
    router.push(`/certificates/${userCertificateId}`)
  }

  return (
    <>
      {isOpen && (
        <PinnedNotificationsV2
          bgColor="bg-primary-200"
          borderColor="border-primary"
          heightPinned="h-[86px]"
        >
          <div className="flex items-center gap-4">
            <div className="h-[50px] w-[77px]">
              <Image
                src={userCertificateUrl}
                alt="pinned-completed-course"
                width={77}
                height={50}
              />
            </div>
            <div className="flex flex-col">
              <div className="text-xl font-semibold text-gray-800">
                Congratulations on getting your certificate!
              </div>
              <div className="text-sm font-normal text-gray-800">
                You completed course&nbsp;{courseName}
                &nbsp;on&nbsp;
                {formatDateToLongString(passedAt)}
              </div>
            </div>
          </div>

          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={onSeeCertificate}
          >
            <div className="text-base font-semibold text-gray-800 underline">
              See Certificate
            </div>
            <div>
              <ArrowRightV2Icon />
            </div>
          </div>
        </PinnedNotificationsV2>
      )}
    </>
  )
}

export default PinnedCompletedCourse
