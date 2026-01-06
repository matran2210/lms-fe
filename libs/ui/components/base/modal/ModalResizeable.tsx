import { CloseIcon } from "@lms/assets";
import clsx from "clsx";
import React, { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Rnd } from "react-rnd";

interface ModalResizeableProps {
  title?: string | ReactNode;
  children: ReactNode | ((helpers: { requestClose: () => void }) => ReactNode); // requestClose dùng để close modal mà vẫn giữ được animation khi đóng modal
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  dragHandleClassName?: string;
  header?: ReactNode | ((actions: { requestClose: () => void }) => ReactNode); // requestClose dùng để close modal mà vẫn giữ được animation khi đóng modal
  handleCloseScratchPad?: (pad: any) => void;
  position?:
    | "top left"
    | "top middle"
    | "top right"
    | "bottom left"
    | "bottom middle"
    | "bottom right"
    | "center left"
    | "center right"
    | "center";
  className?: string;
  draggableFull?: boolean;
  modalIndex?: number;
  rootClassName?: string;
  bodyClassName?: string;
  contentClassName?: string;
  isInBody?: boolean;
  onClick?: () => void;
}

const ModalResizeable: React.FC<ModalResizeableProps> = ({
  title = "Title",
  children,
  width = 600,
  height = 400,
  minWidth = 200,
  minHeight = 200,
  header,
  dragHandleClassName, //Determine the drag handle class name
  handleCloseScratchPad,
  position = "center",
  className,
  draggableFull = false,
  modalIndex = 0,
  rootClassName,
  bodyClassName,
  contentClassName,
  isInBody = false,
  onClick = () => {},
}) => {
  const [size, setSize] = useState({ width, height });
  const [closing, setClosing] = useState(false);
  const EXIT_DURATION = 300;

  const requestClose = () => {
    if (closing) return;

    setClosing(true);

    setTimeout(() => {
      handleCloseScratchPad?.(null);
    }, EXIT_DURATION);
  };
  //Hàm tính vị trí của Modal
  const calculatePosition = (
    pos: string,
    modalWidth: number,
    modalHeight: number,
    offset = 0,
  ) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const shift = offset * 20; // mỗi modal lệch 20px
    // const positions = {
    //   'top left': { x: 0, y: 0 },
    //   'top middle': { x: (windowWidth - modalWidth) / 2, y: 0 },
    //   'bottom left': { x: 0, y: windowHeight - modalHeight },
    //   'bottom middle': {
    //     x: (windowWidth - modalWidth) / 2,
    //     y: windowHeight - modalHeight,
    //   },
    //   'bottom right': {
    //     x: windowWidth - modalWidth,
    //     y: windowHeight - modalHeight,
    //   },
    //   'top right': { x: windowWidth - modalWidth, y: 0 },
    //   'center left': { x: 0, y: (windowHeight - modalHeight) / 2 },
    //   'center right': {
    //     x: windowWidth - modalWidth,
    //     y: (windowHeight - modalHeight) / 2,
    //   },
    //   center: {
    //     x: (windowWidth - modalWidth) / 2,
    //     y: (windowHeight - modalHeight) / 2,
    //   },
    // }
    const positions = {
      "top left": { x: shift, y: shift },
      "top middle": {
        x: (windowWidth - modalWidth) / 2 + shift,
        y: shift,
      },
      "top right": {
        x: windowWidth - modalWidth - shift,
        y: shift,
      },

      "center left": {
        x: shift,
        y: (windowHeight - modalHeight) / 2 + shift,
      },
      center: {
        x: (windowWidth - modalWidth) / 2 + shift,
        y: (windowHeight - modalHeight) / 2 + shift,
      },
      "center right": {
        x: windowWidth - modalWidth - shift,
        y: (windowHeight - modalHeight) / 2 + shift,
      },

      "bottom left": {
        x: shift,
        y: windowHeight - modalHeight - shift,
      },
      "bottom middle": {
        x: (windowWidth - modalWidth) / 2 + shift,
        y: windowHeight - modalHeight - shift,
      },
      "bottom right": {
        x: windowWidth - modalWidth - shift,
        y: windowHeight - modalHeight - shift,
      },
    };

    return positions[pos as keyof typeof positions] || positions.center;
  };

  const [modalPosition, setModalPosition] = useState(() =>
    calculatePosition(position, width, height, modalIndex),
  );

  useEffect(() => {
    setModalPosition(
      calculatePosition(position, size.width, size.height, modalIndex),
    );
  }, []);

  useEffect(() => {
    setClosing(false);
  }, [width, height]);

  const renderContent = () => {
    return (
      <div
        className={clsx(
          "pointer-events-none fixed inset-0 z-[1000] overflow-hidden modal-overlay",
          closing ? "modal-zoom-out" : "modal-zoom-in",
        )}
      >
        <Rnd
          size={{ width: size.width, height: size.height }}
          position={modalPosition}
          onDragStop={(e, d) => {
            const maxX = window.innerWidth - size.width;
            const maxY = window.innerHeight - size.height;
            setModalPosition({
              x: Math.min(Math.max(0, d.x), maxX),
              y: Math.min(Math.max(0, d.y), maxY),
            });
          }}
          onResizeStop={(e, direction, ref, delta, newPos) => {
            const newWidth = parseInt(ref.style.width);
            const newHeight = parseInt(ref.style.height);
            const maxX = window.innerWidth - newWidth;
            const maxY = window.innerHeight - newHeight;

            setSize({ width: newWidth, height: newHeight });
            setModalPosition({
              x: Math.min(Math.max(0, newPos.x), maxX),
              y: Math.min(Math.max(0, newPos.y), maxY),
            });
          }}
          minWidth={minWidth}
          minHeight={minHeight}
          bounds="window"
          style={{
            background: "white",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            border: "1px solid #DCDDDD",
            position: "fixed",
            pointerEvents: "auto",
          }}
          dragHandleClassName={
            draggableFull
              ? undefined
              : dragHandleClassName
                ? dragHandleClassName
                : "modal-dragger"
          }
          className={clsx(
            "modalResizeable",
            "overflow-hidden rounded-xl",
            className,
            rootClassName,
          )}
          onMouseDown={onClick}
          onTouchStart={onClick}
        >
          <div
            className={clsx(
              "absolute left-0 top-0 h-full w-full",
              bodyClassName,
            )}
          >
            {header ? (
              typeof header === "function" ? (
                header({ requestClose })
              ) : (
                header
              )
            ) : (
              <div className={"modalHeader"}>
                <div className="modal-header modal-dragger flex h-10 w-full cursor-move items-center justify-between px-5">
                  <div className="truncate">{title}</div>
                </div>
                <button
                  className="absolute right-3 top-2"
                  onClick={requestClose}
                >
                  <CloseIcon />
                </button>
              </div>
            )}
            <div className={clsx("modalContent", contentClassName)}>
              {typeof children === "function"
                ? children({ requestClose })
                : children}
            </div>
          </div>
        </Rnd>
      </div>
    );
  };
  return isInBody
    ? createPortal(renderContent(), document.body)
    : renderContent();
};

export default ModalResizeable;
