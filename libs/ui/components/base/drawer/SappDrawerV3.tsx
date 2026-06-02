"use client";
import { Drawer, DrawerProps } from "antd";
import React, { ReactNode, useEffect } from "react";
import clsx from "clsx";
import { CollapseArrowIcon, CloseIcon } from "@lms/assets";
import { ButtonPrimary, ButtonText } from "../button";

interface IProps extends DrawerProps {
  open: boolean;
  handleCancel?: () => void;
  handleBack?: () => void;
  width?: string | number;
  title: React.ReactNode;
  isShowBtnClose?: boolean;
  isShowFooter?: boolean;
  isShowHeader?: boolean;
  children: ReactNode;
  loading?: boolean;
  btnSubmitTile?: string;
  handleSubmit?: () => void;
  sizeTextBtn?: "small" | "medium" | "large" | "extra";
  submitButtonClassName?: string;
  classNameBody?: string;
  classNameHeader?: string;
  cancelButtonCaption?: string;
  cancelButtonClassName?: string;
  isShowBtnBack?: boolean;
  titleClassName?: string;
  disabledSubmitButton?: boolean;
}

const SappDrawerV3: React.FC<IProps> = ({
  open,
  handleCancel,
  handleBack,
  width = "33%",
  title,
  children,
  isShowBtnClose = true,
  isShowFooter = false,
  isShowHeader = true,
  loading = false,
  className,
  btnSubmitTile,
  handleSubmit,
  sizeTextBtn = "medium",
  submitButtonClassName,
  classNameBody,
  classNameHeader = "mb-4 md:mb-6",
  cancelButtonCaption,
  cancelButtonClassName,
  closable,
  isShowBtnBack = false,
  titleClassName,
  disabledSubmitButton = false,
  ...props
}) => {
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
  }, [open]);

  return (
    <Drawer
      open={open}
      onClose={handleCancel}
      width={width}
      title={undefined}
      closeIcon={false}
      {...props}
    >
      <div
        className={clsx(
          "relative h-full w-full bg-white p-4 md:p-6 lg:p-8",
          classNameBody,
        )}
      >
        {/* Header */}
        {isShowHeader && (
          <div
            className={clsx(
              "flex items-center justify-between lg:mb-8",
              classNameHeader,
            )}
          >
            <div className="flex w-full items-center">
              {(!isShowBtnClose || isShowBtnBack) && (
                <div
                  onClick={handleBack}
                  className="cursor-pointer"
                  aria-label="Go back"
                >
                  <CollapseArrowIcon className="rotate-90" />
                </div>
              )}
              <span
                className={clsx(
                  "ml-2 text-xl font-semibold leading-loose text-gray-800 md:text-2xl",
                  titleClassName,
                )}
              >
                {title}
              </span>
            </div>
            {closable && isShowBtnClose && (
              <button
                onClick={handleCancel}
                className="cursor-pointer"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <>{children}</>

        {/* Footer */}
        {isShowFooter && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-end gap-4 px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8">
            {cancelButtonCaption && (
              <ButtonText
                title={cancelButtonCaption}
                className={cancelButtonClassName}
                onClick={handleCancel}
                size={sizeTextBtn}
              />
            )}
            <ButtonPrimary
              title={btnSubmitTile ?? ""}
              className={submitButtonClassName}
              onClick={handleSubmit}
              size={sizeTextBtn}
              loading={loading}
              disabled={disabledSubmitButton}
            />
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default SappDrawerV3;
