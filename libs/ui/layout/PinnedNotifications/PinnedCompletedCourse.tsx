import { ArrowRightV2Icon } from "@lms/assets";
import PinnedNotificationsV2 from "./PinnedNotificationsV2";
import { formatDateToLongString } from "@lms/utils";
import Image from "next/image";
import React from "react";
import { useFeature, useAppSelector, userReducer } from "@lms/contexts";
import clsx from "clsx";
import ImageRenderFromHtml from "../../components/base/image/ImageRenderFromHtml";

interface PinnedCompletedCourseData {
  isOpen: boolean;
  passedAt: string;
  userCertificateId: string;
  courseName: string;
  userCertificateHtml: string;
}

interface IProps {
  pinnedCompletedCourse: PinnedCompletedCourseData;
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
);
NotificationMessage.displayName = "NotificationMessage";

const CertificateImage = React.memo(({ html_template, id, name }: { html_template: string, id: string, name: string }) => (
  <div className="hidden h-[50px] w-[77px] md:block">
    <ImageRenderFromHtml id={`pinned-${id}`} html={html_template} previewWidth={77} previewHeight={50} name={name || ''}/>
  </div>
));
CertificateImage.displayName = "CertificateImage";

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
);
SeeCertificateButton.displayName = "SeeCertificateButton";

const PinnedCompletedCourse: React.FC<IProps> = React.memo(
  ({ pinnedCompletedCourse }) => {
    const { detail } = useAppSelector(userReducer).user;
    const {router} = useFeature();
    const {
      isOpen,
      passedAt,
      userCertificateHtml,
      userCertificateId,
      courseName,
    } = pinnedCompletedCourse;

    const onSeeCertificate = React.useCallback(() => {
      router.push(`/certificates/${userCertificateId}`);
    }, [router, userCertificateId]);

    if (!isOpen) return null;

    return (
      <PinnedNotificationsV2
        bgColor="bg-primary-200"
        borderColor="border-primary"
        classPinned={clsx(
          "fixed left-1/2 bottom-6 z-[1000]",
          "-translate-x-1/2",
          "w-[calc(100%-2rem)] max-w-[720px]",
          "lg:flex-row lg:justify-between lg:items-center flex-col gap-2 md:gap-4",
          "pinned-toast-enter",
        )}
      >
        <div className="flex items-center gap-4">
          <CertificateImage id={userCertificateId} html_template={userCertificateHtml} name={detail?.full_name}/>
          <NotificationMessage courseName={courseName} passedAt={passedAt} />
        </div>
        <SeeCertificateButton onClick={onSeeCertificate} />
      </PinnedNotificationsV2>
    );
  },
);

PinnedCompletedCourse.displayName = "PinnedCompletedCourse";

export default PinnedCompletedCourse;
