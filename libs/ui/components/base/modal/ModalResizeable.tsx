import { CloseIcon } from "@lms/assets";
import clsx from "clsx";
import { ResizeDirection } from "re-resizable";
import React, { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { DraggableData, Rnd, RndDragEvent } from "react-rnd";

interface ModalResizeableProps {
  title?: string | ReactNode;
  children: ReactNode | ((helpers: { requestClose: () => void }) => ReactNode); // requestClose dùng để close modal mà vẫn giữ được animation khi đóng modal
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxHeight?: number;
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
  onResizeStopDone?: (size: { width: number; height: number }) => void;
}

const ModalResizeable: React.FC<ModalResizeableProps> = ({
  title = "Title",
  children,
  width = 600,
  height = 400,
  minWidth = 200,
  minHeight = 200,
  maxHeight,
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
  onResizeStopDone,
}) => {
  const [size, setSize] = useState({ width, height });
  const clamp = (value: number) => Math.abs(value); // Đảm bảo giá trị luôn dương để tránh lỗi khi tính toán vị trí modal
  const [closing, setClosing] = useState(false);
  const EXIT_DURATION = 300;

  const requestClose = () => {
    // Khi người dùng yêu cầu đóng modal, chúng ta sẽ kích hoạt animation đóng modal trước khi thực sự gỡ bỏ modal khỏi DOM
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
    const shift = offset * 20; // mỗi modal lệch 20px
    const positions = {
      "top left": { x: clamp(shift), y: clamp(shift) },
      "top middle": {
        x: clamp((windowWidth - modalWidth) / 2 + shift),
        y: clamp(shift),
      },
      "top right": {
        x: clamp(windowWidth - modalWidth - shift),
        y: clamp(shift),
      },

      "center left": {
        x: clamp(shift),
        y: clamp((windowHeight - modalHeight) / 2 + shift),
      },
      center: {
        x: clamp((windowWidth - modalWidth) / 2 + shift),
        y: clamp((windowHeight - modalHeight) / 2 + shift),
      },
      "center right": {
        x: clamp(windowWidth - modalWidth - shift),
        y: clamp((windowHeight - modalHeight) / 2 + shift),
      },

      "bottom left": {
        x: clamp(shift),
        y: clamp(windowHeight - modalHeight - shift),
      },
      "bottom middle": {
        x: clamp((windowWidth - modalWidth) / 2 + shift),
        y: clamp(windowHeight - modalHeight - shift),
      },
      "bottom right": {
        x: clamp(windowWidth - modalWidth - shift),
        y: clamp(windowHeight - modalHeight - shift),
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
    // ===== handlers =====
    const handleDragStop = (e: RndDragEvent, d: DraggableData) => {
      const maxX = clamp(window.innerWidth - size.width);
      const maxY = clamp(window.innerHeight - size.height);

      setModalPosition({
        x: Math.min(Math.max(0, d.x), maxX),
        y: Math.min(Math.max(0, d.y), maxY),
      });
    };

    const handleResizeStop = (
      e: MouseEvent | TouchEvent,
      direction: ResizeDirection,
      ref: HTMLElement,
      delta: {
        height: number;
        width: number;
      },
      newPos: { x: number; y: number },
    ) => {
      const newWidth = parseInt(ref.style.width);
      const newHeight = parseInt(ref.style.height);

      const maxX = window.innerWidth - newWidth;
      const maxY = window.innerHeight - newHeight;

      setSize({
        width: clamp(newWidth),
        height: clamp(newHeight),
      });

      setModalPosition({
        x: Math.min(Math.max(0, newPos.x), maxX),
        y: Math.min(Math.max(0, newPos.y), maxY),
      });

      onResizeStopDone?.({
        width: newWidth,
        height: newHeight,
      });
    };

    // ===== computed values =====
    const overlayClass = clsx(
      "pointer-events-none fixed inset-0 z-[1000] overflow-hidden modal-overlay",
      closing ? "modal-zoom-out" : "modal-zoom-in",
    );

    const dragHandleClass = draggableFull
      ? undefined
      : dragHandleClassName || "modal-dragger";

    const rndClass = clsx(
      "modalResizeable",
      "overflow-hidden rounded-xl",
      className,
      rootClassName,
    );

    // ===== render header =====
    const renderHeader = () => {
      if (!header) {
        return (
          <div className="modalHeader">
            <div className="modal-header modal-dragger flex h-10 w-full cursor-move items-center justify-between px-5">
              <div className="truncate">{title}</div>
            </div>
            <button className="absolute right-3 top-2" onClick={requestClose}>
              <CloseIcon />
            </button>
          </div>
        );
      }

      return typeof header === "function" ? header({ requestClose }) : header;
    };

    // ===== render content =====
    const renderChildren = () => {
      return typeof children === "function"
        ? children({ requestClose })
        : children;
    };
    const styleRnd: React.CSSProperties = {
      background: "white",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      border: "1px solid #DCDDDD",
      position: "fixed",
      pointerEvents: "auto",
    };
    // ===== JSX (clean) =====
    return (
      <div className={overlayClass}>
        <Rnd
          size={size}
          position={modalPosition}
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
          minWidth={minWidth}
          minHeight={minHeight}
          maxHeight={maxHeight}
          bounds="window"
          dragHandleClassName={dragHandleClass}
          className={rndClass}
          style={styleRnd}
          onMouseDown={onClick}
          onTouchStart={onClick}
        >
          <div
            className={clsx(
              "absolute left-0 top-0 h-full w-full",
              bodyClassName,
            )}
          >
            {renderHeader()}

            <div className={clsx("modalContent", contentClassName)}>
              {renderChildren()}
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
