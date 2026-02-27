import { SappModalV3 } from "@lms/ui";
import dayjs from "dayjs";
import { Dispatch, FC, SetStateAction, useMemo } from "react";
import { useAppSelector, useFeature } from "@lms/contexts";
import { entranceTestReducer } from "@lms/contexts";
import EntrancePopupContent from "./EntrancePopupContent";

const calculateEndTime = (createdAt: Date, quizTimed: number): Date => {
  return dayjs(createdAt).add(quizTimed, "minutes").toDate();
};

export const isQuizExpired = (createdAt: Date, quizTimed: number): boolean => {
  const endTime = calculateEndTime(createdAt, quizTimed);
  return dayjs().isAfter(endTime);
};

// define the props for the confirm dialog component
export type EntrancePopupProps = {
  open: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  data?: any;
  setOpenFillForm: Dispatch<SetStateAction<boolean>>;
  openFillForn: boolean;
  entranceTest?: Record<any, any> | undefined;
};

// create the confirm dialog component
const EntrancePopup: FC<EntrancePopupProps> = ({
  open,
  setOpen,
  data,
  // openFillForn,
  // setOpenFillForm,
  entranceTest,
}) => {
  const handleOnClick = () => {
    setOpen && setOpen(false);
  };

  const { count } = useAppSelector(entranceTestReducer);
  const {router} = useFeature()

  const checkLimit = useMemo(() => {
    if (data?.is_limited) {
      if (data?.attempt_times === data?.limit_count) {
        return true;
      }
    }
    return false;
  }, [data]);

  return (
    <>
      <SappModalV3
        handleClose={() => setOpen && setOpen(false)}
        open={open}
        cancelButtonCaption="Back"
        okButtonCaption="Start"
        handleCancel={handleOnClick}
        onOk={() => router.push(`${process.env.NEXT_PUBLIC_SUB_DOMAIN_TEST}/test/${data?.id}?type=entrance`)}
        showOkButton={!checkLimit || count >= 1}
        showHeader={false}
        buttonSize="medium"
        title={undefined}
        fullWidthBtn={true}
      >
        <h2 className="mb-4 max-w-screen-sm text-2xl font-bold text-gray-800 md:text-4xl">
          Test Information
        </h2>
        <div className="text-sm text-gray-800">
          Cảm ơn bạn đã hoàn thiện đầy đủ thông tin! Đây là bước quan trọng để
          xác định lộ trình học tập cá nhân hóa dành riêng cho bạn. Hãy tin vào
          bản thân và bắt đầu ngay nhé!
        </div>
        <EntrancePopupContent
          name={count === 1 ? entranceTest?.name : data?.name || ""}
          timeAllow={count === 1 ? entranceTest?.quiz_timed : data?.quiz_timed}
          // attempts={`${count === 1 ? entranceTest?.attempt_times || 0 : data?.attempt_times || "0"}`}
          // limit_count={
          //   count === 1 ? entranceTest?.limit_count : data?.limit_count
          // }
          total_question={
            count === 1 ? entranceTest?.total_question : data?.total_question
          }
        />
      </SappModalV3>
      {/* <EntranceTestFillForm
        open={openFillForn}
        setOpen={setOpenFillForm}
        entrancePopupContent={data}
        setOpenTestInfo={setOpen}
      /> */}
    </>
  );
};

export default EntrancePopup;
