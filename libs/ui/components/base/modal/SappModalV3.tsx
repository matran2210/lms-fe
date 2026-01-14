import { Modal } from "antd";
import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";
import ButtonCancelSubmit from "../button/ButtonCancelSubmit";

interface IProps {
  open?: boolean;
  showFooter?: boolean;
  cancelButtonCaption?: any;
  okButtonCaption?: any;
  okButtonClass?: string;
  cancelButtonClass?: string;
  buttonSize?: "small" | "medium" | "large" | "extra";
  footerButtonClassName?: string;
  fullWidthBtn?: boolean;
  showOkButton?: boolean;
  showCancelButton?: boolean;
  scrollbale?: boolean;
  footerClassName?: string;
  externalLoading?: boolean;
  revertFunction?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onOk: () => void;
  handleCancel?: () => void;
  handleClose?: () => void;
  icon?: ReactNode;
  header?: ReactNode;
  content?: string | undefined | ReactNode;
  children?: ReactNode;
  headerClassName?: string;
  isClosable?: boolean;
  isUnderLine?: boolean;
  customFooter?:
    | ReactNode
    | ((helpers: { requestClose: () => void }) => ReactNode);
  className?: string;
  gapContent?: string;
  loadingBtnSubmit?: boolean;
  // Các props còn lại sẽ được gom vào otherProps
  [key: string]: any;
}

const SappModalV3 = ({
  open,
  showFooter = true,
  footerButtonClassName = "flex flex-col gap-3 items-center justify-between",
  color,
  colorCancel,
  showOkButton,
  showCancelButton,
  revertFunction,
  okButtonCaption,
  buttonSize = "small",
  externalLoading,
  loading,
  disabled,
  onOk,
  fullWidthBtn,
  okButtonClass,
  cancelButtonCaption,
  cancelButtonClass,
  handleCancel,
  handleClose,
  icon,
  header,
  content,
  children,
  headerClassName,
  isClosable = false,
  isUnderLine = false,
  className,
  customFooter,
  gapContent = "gap-4 md:gap-8",
  loadingBtnSubmit,
  ...otherProps
}: IProps) => {
  const [closing, setClosing] = useState(false);
  const EXIT_DURATION = 300;

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        setClosing(false);
      });
    }
  }, [open]);

  const requestClose = (callback?: () => void) => {
    if (closing) return;

    setClosing(true);

    setTimeout(() => {
      callback?.();
      handleClose?.();
    }, EXIT_DURATION_Test);
  };

  return (
    <Modal
      maskClosable
      open={open}
      className={clsx(
        "sapp-modal",
        closing ? "modal-slide-down" : "modal-slide-up",
        className,
      )}
      footer={false}
      centered
      closeIcon={false}
      maskTransitionName="mask-fade"
      transitionName=""
      onCancel={() => requestClose()}
      closable={isClosable}
      {...otherProps}
    >
      {icon && (
        <div className="mb-6 flex justify-center md:mb-10">
          <div className="w-fit">{icon}</div>
        </div>
      )}
      <div
        className={clsx(`flex flex-col ${gapContent}`, {
          "pb-6 md:pb-10": showFooter,
        })}
      >
        {header && (
          <div
            className={clsx(
              "flex justify-center text-2xl font-semibold text-gray-800 md:text-3xl",
              { "mb-4": !content && !children },
              headerClassName,
            )}
          >
            {header}
          </div>
        )}
        {(content || children) && (
          <div className="text-center text-sm text-gray-800 md:text-base">
            {content ?? children}
          </div>
        )}
      </div>
      {showFooter && (
        <div className="relative">
          <ButtonCancelSubmit
            revertFunction={revertFunction}
            className={footerButtonClassName}
            showOkButton={showOkButton}
            showCancelButton={showCancelButton}
            submit={{
              title: okButtonCaption,
              size: buttonSize,
              loading: loadingBtnSubmit ?? externalLoading ?? loading,
              disabled,
              onClick: () => requestClose(onOk),
              full: fullWidthBtn,
              className: okButtonClass,
            }}
            cancel={{
              title: cancelButtonCaption,
              size: buttonSize,
              onClick: () => requestClose(handleCancel),
              loading: externalLoading ?? loading,
              full: fullWidthBtn,
              className: cancelButtonClass,
              disabled: loadingBtnSubmit,
            }}
          />
        </div>
      )}
      {!showFooter && customFooter && (
        <div className={"relative flex justify-center"}>
          {typeof customFooter === "function"
            ? customFooter({ requestClose })
            : customFooter}
        </div>
      )}
    </Modal>
  );
};

export default SappModalV3;
