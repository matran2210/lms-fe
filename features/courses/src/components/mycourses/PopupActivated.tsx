import { ActiveIcon } from "@lms/assets";
import { useFeature } from "@lms/contexts";
import {
  activeCourseThunk,
  hidePopupActivatedCourse,
} from "@lms/contexts/redux/slice/Popup/ActivatedCourse";
import { SappModalV3 } from "@lms/ui";
import React, { Dispatch, SetStateAction } from "react";

const PopupActivated = () => {
  const { dispatch, useAppSelector, courseApi } = useFeature();
  const selector = useAppSelector?.((state) => state.popupActivateCourse);
  const handleCancel = () => {
    dispatch?.({ type: hidePopupActivatedCourse });
  };
  console.log("selector", selector);
  const onOk = () => {
    dispatch?.(
      activeCourseThunk({
        courseType: selector.courseType,
        timeActive: selector.timeActive,
        classId: selector.classId,
        courseApi: courseApi,
      }),
    );
  };
  const ContentActiveCourse = () => {
    return (
      <div className="justify-center self-stretch text-center">
        <span className="text-base font-normal leading-normal text-gray-800">
          You will have{" "}
        </span>
        <span className="text-base font-bold leading-normal text-primary">
          {selector.timeActive} {selector.timeActive > 1 ? "days" : "day"}
        </span>
        <span className="text-base font-normal leading-normal text-gray-800">
          {" "}
          from the activation date to study this course
        </span>
      </div>
    );
  };

  return (
    <SappModalV3
      handleClose={handleCancel}
      open={selector.openActive}
      handleCancel={handleCancel}
      onOk={onOk}
      icon={<ActiveIcon />}
      header="Active Course?"
      content={<ContentActiveCourse />}
      showFooter
      okButtonCaption="Confirm"
      fullWidthBtn
      buttonSize="medium"
      cancelButtonCaption="I will begin later"
      isUnderLine
    />
  );
};

export default PopupActivated;
