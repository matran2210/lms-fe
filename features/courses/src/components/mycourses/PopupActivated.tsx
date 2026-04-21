import { ActiveIcon } from "@lms/assets";
import { useFeature } from "@lms/contexts";
import {
  activeCourseThunk,
  selectPopupActivateCourse,
} from "@lms/contexts/redux/slice/Popup/ActivatedCourse";
import { SappModalV3 } from "@lms/ui";

const PopupActivated = () => {
  const { dispatch, useAppSelector, courseApi, router, pageLink } =
    useFeature();
  const selector = useAppSelector?.(selectPopupActivateCourse);
  const handleCancel = () => {
    router.push(pageLink.COURSES);
  };
  const onOk = async () => {
    try {
      const res = await dispatch?.(
        activeCourseThunk({
          courseType: selector?.courseType || "",
          timeActive: selector?.timeActive || 0,
          classId: selector?.classId || "",
          courseApi,
        }),
      ).unwrap();

      if (res) {
        window.location.reload();
      }
    } catch {
      router.push(pageLink.COURSES);
    }
  };
  const ContentActiveCourse = () => {
    return (
      <div className="justify-center self-stretch text-center">
        <span className="text-base font-normal leading-normal text-gray-800">
          You will have{" "}
        </span>
        <span className="text-base font-bold leading-normal text-primary">
          {selector?.timeActive}{" "}
          {selector?.timeActive && selector?.timeActive > 1 ? "days" : "day"}
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
      handleClose={() => {}}
      open={selector?.openActive}
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
      isValidated
      isOnCancel={false}
    />
  );
};

export default PopupActivated;
