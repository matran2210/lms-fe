import { AccessIcon } from "@lms/assets";
import {
  closeShowRemindEntrance,
  entranceTestReducer,
  useAppDispatch,
  useAppSelector,
} from "@lms/contexts";
import { SappModalV3 } from "@lms/ui";
import { Dispatch, SetStateAction, useMemo } from "react";

const PopUpRemindEntrance = ({
  setOpenTest,
}: {
  setOpenFillForm: Dispatch<SetStateAction<boolean>>;
  setOpenTest: Dispatch<SetStateAction<boolean>>;
}) => {
  const { shouldShowRemind, count } = useAppSelector(entranceTestReducer);
  const dispatch = useAppDispatch();
  const getEntranceTest = localStorage.getItem("enstranceTest");
  const openModal =  useMemo(() => shouldShowRemind && getEntranceTest === "true", [shouldShowRemind]);
  const onCancel = () => {
    dispatch(closeShowRemindEntrance());
    localStorage.setItem("enstranceTest", "false");
  };

  const onOk = () => {
    count === 1 ? setOpenTest(true) : dispatch(closeShowRemindEntrance());
    localStorage.setItem("enstranceTest", "false");
  };

  return (
    <SappModalV3
      handleClose={onCancel}
      open={openModal}
      cancelButtonCaption="Close"
      okButtonCaption="Take Your Test"
      handleCancel={onCancel}
      onOk={onOk}
      //   showCancelButton={true}
      fullWidthBtn={true}
      icon={
        <AccessIcon className="h-12 w-12 md:h-auto md:w-auto" fill="#FFB700" />
      }
      header="Take Your Test"
      buttonSize="medium"
    >
      <div className="text-center text-sm font-normal text-gray-800 md:text-base">
        <span>
          You have
          <span className="font-semibold text-primary"> {count}</span>
        </span>
        <span>
          {" "}
          entrance tests that haven&rsquo;t been taken,{" "}
          <br className="hidden md:block" />
          complete them now.
        </span>
      </div>
    </SappModalV3>
  );
};
export default PopUpRemindEntrance;
