import { ArrowRightV2Icon } from '@assets/icons'
import PinnedNotificationsV2 from '@components/layout/PinnedNotifications/PinnedNotificationsV2'
import { formatDateToLongString } from '@utils/helpers'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'

interface PinnedCompletedCourseData {
  isOpen: boolean
  passedAt: string
  userCertificateId: string
  courseName: string
  userCertificateUrl: string
}

interface IProps {
  pinnedCompletedCourse: PinnedCompletedCourseData
}

const NotificationMessage = React.memo(
  ({ courseName, passedAt }: { courseName: string; passedAt: string }) => (
    <div className="flex flex-col">
      <div className="text-base font-semibold text-gray-800 md:text-xl">
        Congratulations on getting your certificate!
      </div>
      <div className="text-sm font-normal text-gray-800">
        You completed course&nbsp;{courseName}
        &nbsp;on&nbsp;
        {formatDateToLongString(passedAt)}
      </div>
    </div>
  ),
)
NotificationMessage.displayName = 'NotificationMessage'

const CertificateImage = React.memo(({ url }: { url: string }) => (
  <div className="hidden h-[50px] w-[77px] md:block">
    <Image src={url} alt="pinned-completed-course" width={77} height={50} />
  </div>
))
CertificateImage.displayName = 'CertificateImage'

const SeeCertificateButton = React.memo(
  ({ onClick }: { onClick: () => void }) => (
    <div
      className="flex cursor-pointer items-center justify-start gap-2 md:justify-end"
      onClick={onClick}
    >
      <div className="text-sm font-semibold text-gray-800 underline md:text-base">
        See Certificate
      </div>
      <div>
        <ArrowRightV2Icon />
      </div>
    </div>
  ),
)
SeeCertificateButton.displayName = 'SeeCertificateButton'

const PinnedCompletedCourse: React.FC<IProps> = React.memo(
  ({ pinnedCompletedCourse }) => {
    const router = useRouter()
    const {
      isOpen,
      passedAt,
      userCertificateUrl,
      userCertificateId,
      courseName,
    } = pinnedCompletedCourse

    const onSeeCertificate = React.useCallback(() => {
      router.push(`/certificates/${userCertificateId}`)
    }, [router, userCertificateId])

    if (isOpen) return null

    return (
      <PinnedNotificationsV2
        bgColor="bg-primary-200"
        borderColor="border-primary"
        classPinned="lg:flex-row lg:justify-between lg:items-center flex-col gap-2 md:gap-4"
      >
        <div className="flex items-center gap-4">
          <CertificateImage url={userCertificateUrl} />
          <NotificationMessage courseName={courseName} passedAt={passedAt} />
        </div>
        <SeeCertificateButton onClick={onSeeCertificate} />
      </PinnedNotificationsV2>
    )
  },
)
PinnedCompletedCourse.displayName = 'PinnedCompletedCourse'

export default PinnedCompletedCourse
