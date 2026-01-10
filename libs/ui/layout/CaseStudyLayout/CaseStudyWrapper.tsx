import { CloseIconV2, NextIcon, PreviousIcon } from "@lms/assets";
import { disableUnsavedChange, useFeature } from "@lms/contexts";
import { Layout } from "antd";
import clsx from "clsx";
import React, { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { ButtonSecondary } from "../../components";

const { Header, Content, Footer } = Layout;

interface IProps {
  title: string;
  headerClass?: string;
  contentClass?: string;
  footerClass?: string;
  setOpenSubmit?: Dispatch<SetStateAction<boolean>>;
  onSubmitAnswer?: (action?: string) => void;
  setOpenQuit?: Dispatch<SetStateAction<boolean>>;
  setUnSubmitAnswer?: Dispatch<SetStateAction<boolean>>;
  checkUnSubmitAnswer?: () => number[];
  footer?: React.ReactNode;
  onNextQuestion?: () => void;
  onPrevQuestion?: () => void;
  currentQuestion?: number;
  totalQuestions?: number;
  isResult?: boolean;
  onQuit?: () => void;
}
const CaseStudyWrapper = ({
  isResult = false,
  title,
  children,
  headerClass,
  contentClass,
  footerClass,
  setOpenSubmit,
  setOpenQuit,
  setUnSubmitAnswer,
  checkUnSubmitAnswer,
  footer,
  onSubmitAnswer,
  onNextQuestion,
  onPrevQuestion,
  currentQuestion,
  totalQuestions,
  onQuit,
}: PropsWithChildren<IProps>) => {
  const {dispatch} = useFeature();

  return (
    <Layout className="flex h-screen flex-col">
      <Header
        className={clsx(
          "sticky top-0 z-10 flex w-full items-center bg-white px-8 py-3 shadow-sm",
          headerClass,
        )}
      >
        <div className="flex w-full items-center justify-between">
          {/* Bên trái */}
          <div>
            <div
              className="w-fit cursor-pointer rounded bg-[#E5E7EB] p-2 duration-300 hover:bg-gray-300"
              onClick={() => {
                onQuit && onQuit();
              }}
            >
              <CloseIconV2 />
            </div>
          </div>

          <div className="absolute left-1/2 max-w-[448px] -translate-x-1/2  text-gray-800">
            <div className="flex flex-col justify-center">
              <div className="truncate text-center text-base">{title}</div>
              <div className="flex justify-center gap-3">
                <button
                  disabled={(currentQuestion ?? 0) <= 0}
                  className={clsx({
                    "cursor-not-allowed opacity-50":
                      (currentQuestion ?? 0) <= 0,
                  })}
                  onClick={() => {
                    if ((currentQuestion ?? 0) <= 0) return;
                    if (onPrevQuestion) {
                      onPrevQuestion();
                    } else {
                      setOpenQuit?.(true);
                    }
                  }}
                >
                  <PreviousIcon />
                </button>
                <div className="text-base">
                  {`${(currentQuestion ?? 0) + 1} of ${totalQuestions ?? 0}`}
                </div>
                <button
                  disabled={
                    (currentQuestion ?? 0) >= (totalQuestions ?? 0) - 1 ||
                    (totalQuestions ?? 0) === 0
                  }
                  className={clsx({
                    "cursor-not-allowed opacity-50":
                      (currentQuestion ?? 0) >= (totalQuestions ?? 0) - 1 ||
                      (totalQuestions ?? 0) === 0,
                  })}
                  onClick={() => {
                    if (
                      (currentQuestion ?? 0) >= (totalQuestions ?? 0) - 1 ||
                      (totalQuestions ?? 0) === 0
                    )
                      return;
                    if (onNextQuestion) {
                      onNextQuestion();
                    } else {
                      setOpenSubmit && setOpenSubmit(true);
                      dispatch?.(disableUnsavedChange());
                    }
                  }}
                >
                  <NextIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Bên phải */}
          <div>
            <ButtonSecondary
              title={isResult ? "Quit" : "Finish"}
              size="small"
              className="!bg-white !px-4 !py-2 font-semibold"
              onClick={() => {
                if (isResult) {
                  onQuit && onQuit();
                }
                if (
                  !onSubmitAnswer ||
                  !checkUnSubmitAnswer ||
                  !setUnSubmitAnswer ||
                  !setOpenSubmit
                )
                  return;
                onSubmitAnswer();
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

export default CaseStudyWrapper;
