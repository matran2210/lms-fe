import React, {
  Dispatch,
  ForwardedRef,
  PropsWithChildren,
  SetStateAction,
} from "react";
import { Layout } from "antd";
import clsx from "clsx";
import { Icon } from "@lms/assets";
import { disableUnsavedChange, useFeature } from "@lms/contexts";
import dayjs from "dayjs";
import { ButtonSecondary } from "../../components";
import CountDown from "../../components/count-down";

const { Header, Content, Footer } = Layout;

interface IProps {
  headerClass?: string;
  contentClass?: string;
  footerClass?: string;
  quizDetail: {
    name: string;
    quiz_timed?: number | null;
    quiz_type: string;
    is_limited: boolean;
    limit_count: string;
  };
  quizAttempt: {
    id: string;
    number_of_attempts: number;
    is_limited: boolean;
    created_at?: string;
    quiz_timed?: number;
  };
  timeRef: ForwardedRef<any>;
  setOpenSubmit: Dispatch<SetStateAction<boolean>>;
  handleTimeoutSubmit: () => void;
  onSubmitAnswer: (action?: string) => void;
  setOpenQuit: Dispatch<SetStateAction<boolean>>;
  type: string | string[] | undefined;
  setSubmitEventTest: Dispatch<SetStateAction<boolean>>;
  setUnSubmitAnswer: Dispatch<SetStateAction<boolean>>;
  checkUnSubmitAnswer: () => number[];
  footer?: React.ReactNode;
  resetWordBeforeAction?: () => Promise<void>;
}
const TestWrapper = ({
  children,
  headerClass,
  contentClass,
  footerClass,
  quizDetail,
  timeRef,
  setOpenSubmit,
  setOpenQuit,
  type,
  setSubmitEventTest,
  setUnSubmitAnswer,
  checkUnSubmitAnswer,
  footer,
  quizAttempt,
  handleTimeoutSubmit,
  onSubmitAnswer,
  resetWordBeforeAction,
}: PropsWithChildren<IProps>) => {
  const {dispatch} = useFeature();
  const startTime = dayjs(quizAttempt.created_at);
  const isValidStart = startTime.isValid();
  const duration = quizDetail?.quiz_timed;

  const remainingTimeinSeconds =
    duration && isValidStart
      ? startTime.add(duration, "minutes").diff(dayjs(), "seconds")
      : null;

  const remainingTimeAttempt =
    (remainingTimeinSeconds ?? 0) > 0 ? (remainingTimeinSeconds ?? 0) : 0;

  return (
    <Layout className="flex h-screen flex-col">
      <Header
        className={clsx(
          "sticky top-0 z-10 flex w-full items-center bg-white px-8 py-3 shadow-header",
          headerClass,
        )}
      >
        <div className="flex w-full items-center justify-between">
          {/* Bên trái */}
          <div>
            <div
              className="w-fit cursor-pointer rounded bg-gray-200 p-2 duration-300 hover:bg-gray-300"
              onClick={async () => {
                await resetWordBeforeAction?.();
                setOpenQuit(true);
                dispatch?.(disableUnsavedChange());
              }}
            >
              <Icon type="close" />
            </div>
          </div>

          <div className="absolute left-1/2 max-w-[448px] -translate-x-1/2 text-gray-800">
            <div className="truncate text-center text-base">
              {quizDetail?.name}
            </div>
            {quizDetail?.quiz_timed && (
              <CountDown
                remainTime={remainingTimeAttempt}
                onTimeOut={handleTimeoutSubmit}
                ref={timeRef}
              />
            )}
          </div>

          {/* Bên phải */}
          <div>
            <ButtonSecondary
              title="Finish"
              size="small"
              className="!bg-white !px-4 !py-2 font-semibold"
              onClick={async () => {
                await resetWordBeforeAction?.();
                onSubmitAnswer("finish");
                if (checkUnSubmitAnswer()?.length > 0) {
                  setUnSubmitAnswer(true);
                } else {
                  setOpenSubmit(true);
                }
                dispatch?.(disableUnsavedChange());
              }}
            />
          </div>
        </div>
      </Header>

      <Content className={clsx("flex-grow overflow-auto p-0", contentClass)}>
        {children}
      </Content>
      <Footer
        className={clsx(
          "shadow-t-sm relative z-50 w-full border-t border-gray-300 bg-white p-0",
          footerClass,
          "h-auto",
        )}
      >
        {footer}
      </Footer>
    </Layout>
  );
};

export default TestWrapper;
