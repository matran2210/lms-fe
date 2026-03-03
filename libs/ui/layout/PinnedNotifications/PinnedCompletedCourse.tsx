import { ArrowRightIcon } from "@lms/assets";
import { IUser, useFeature, userReducer } from "@lms/contexts";
import { formatDateToLongString } from "@lms/utils";
import clsx from "clsx";
import React from "react";
import ImageRenderFromHtml from "../../components/base/image/ImageRenderFromHtml";
import PinnedNotificationWrapper from "./PinnedNotificationWrapper";

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
        <ArrowRightIcon />
      </div>
    </div>
  ),
);
SeeCertificateButton.displayName = "SeeCertificateButton";

const PinnedCompletedCourse: React.FC<IProps> = React.memo(
  ({ pinnedCompletedCourse }) => {
    const {router, useAppSelector} = useFeature();
    const { detail } = useAppSelector?.(userReducer).user as IUser;
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
      <PinnedNotificationWrapper
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
      </PinnedNotificationWrapper>
    );
  },
);

PinnedCompletedCourse.displayName = "PinnedCompletedCourse";

export default PinnedCompletedCourse;
