import { CloseIcon } from "@lms/assets";
import clsx from "clsx";
import { ResizeDirection } from "re-resizable";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { DraggableData, Rnd, RndDragEvent } from "react-rnd";

// ── Constants ──────────────────────────────────────────────────────────
const EXIT_DURATION = 300;
const MODAL_OFFSET_PX = 20;

const RND_BASE_STYLE: React.CSSProperties = {
  background: "white",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  border: "1px solid #DCDDDD",
  position: "fixed",
  pointerEvents: "auto",
};

// ── Types ──────────────────────────────────────────────────────────────
type ModalPosition =
  | "top left"
  | "top middle"
  | "top right"
  | "bottom left"
  | "bottom middle"
  | "bottom right"
  | "center left"
  | "center right"
  | "center";

interface ModalResizeableProps {
  title?: string | ReactNode;
  children:
    | ReactNode
    | ((helpers: { requestClose: () => void }) => ReactNode);
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  dragHandleClassName?: string;
  header?:
    | ReactNode
    | ((actions: { requestClose: () => void }) => ReactNode);
  onClose?: () => void;
  position?: ModalPosition;
  className?: string;
  draggableFull?: boolean;
  modalIndex?: number;
  rootClassName?: string;
  bodyClassName?: string;
  contentClassName?: string;
  isInBody?: boolean;
  onModalFocus?: () => void;
  onResizeStopDone?: (size: { width: number; height: number }) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────

/** Ensure a value is >= 0 to prevent invalid positions */
const clampPositive = (value: number): number => Math.max(0, value);

const calculatePosition = (
  pos: ModalPosition,
  modalWidth: number,
  modalHeight: number,
  offset = 0,
): { x: number; y: number } => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const shift = offset * MODAL_OFFSET_PX;

  const positions: Record<ModalPosition, { x: number; y: number }> = {
    "top left": { x: clampPositive(shift), y: clampPositive(shift) },
    "top middle": {
      x: clampPositive((vw - modalWidth) / 2 + shift),
      y: clampPositive(shift),
    },
    "top right": {
      x: clampPositive(vw - modalWidth - shift),
      y: clampPositive(shift),
    },
    "center left": {
      x: clampPositive(shift),
      y: clampPositive((vh - modalHeight) / 2 + shift),
    },
    center: {
      x: clampPositive((vw - modalWidth) / 2 + shift),
      y: clampPositive((vh - modalHeight) / 2 + shift),
    },
    "center right": {
      x: clampPositive(vw - modalWidth - shift),
      y: clampPositive((vh - modalHeight) / 2 + shift),
    },
    "bottom left": {
      x: clampPositive(shift),
      y: clampPositive(vh - modalHeight - shift),
    },
    "bottom middle": {
      x: clampPositive((vw - modalWidth) / 2 + shift),
      y: clampPositive(vh - modalHeight - shift),
    },
    "bottom right": {
      x: clampPositive(vw - modalWidth - shift),
      y: clampPositive(vh - modalHeight - shift),
    },
  };

  return positions[pos] || positions.center;
};

// ── Component ──────────────────────────────────────────────────────────

const ModalResizeable: React.FC<ModalResizeableProps> = ({
  title = "Title",
  children,
  width = 600,
  height = 400,
  minWidth = 200,
  minHeight = 200,
  maxHeight,
  header,
  dragHandleClassName,
  onClose,
  position = "center",
  className,
  draggableFull = false,
  modalIndex = 0,
  rootClassName,
  bodyClassName,
  contentClassName,
  isInBody = false,
  onModalFocus,
  onResizeStopDone,
}) => {
  const [size, setSize] = useState({ width, height });
  const [closing, setClosing] = useState(false);
  const [modalPosition, setModalPosition] = useState(() =>
    calculatePosition(position, width, height, modalIndex),
  );

  const closeTimeoutRef = useRef<number | null>(null);

  // ── requestClose with exit animation ──
  const requestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);

    closeTimeoutRef.current = window.setTimeout(() => {
      onClose?.();
    }, EXIT_DURATION);
  }, [closing, onClose]);

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Recalculate position when position prop or modalIndex changes + window resize
  useEffect(() => {
    const updatePosition = () => {
      setModalPosition(
        calculatePosition(position, size.width, size.height, modalIndex),
      );
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [position, modalIndex]);

  // Reset closing state when dimensions change
  useEffect(() => {
    setClosing(false);
  }, [width, height]);

  // ── ESC key handler ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        requestClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [requestClose]);

  // ── Drag / Resize handlers ──

  const handleDragStop = useCallback(
    (_e: RndDragEvent, d: DraggableData) => {
      const maxX = clampPositive(window.innerWidth - size.width);
      const maxY = clampPositive(window.innerHeight - size.height);

      setModalPosition({
        x: Math.min(Math.max(0, d.x), maxX),
        y: Math.min(Math.max(0, d.y), maxY),
      });
    },
    [size.width, size.height],
  );

  const handleResizeStop = useCallback(
    (
      _e: MouseEvent | TouchEvent,
      _direction: ResizeDirection,
      ref: HTMLElement,
      _delta: { height: number; width: number },
      newPos: { x: number; y: number },
    ) => {
      const rect = ref.getBoundingClientRect();
      const newWidth = rect.width;
      const newHeight = rect.height;

      const maxX = window.innerWidth - newWidth;
      const maxY = window.innerHeight - newHeight;

      setSize({
        width: clampPositive(newWidth),
        height: clampPositive(newHeight),
      });

      setModalPosition({
        x: Math.min(Math.max(0, newPos.x), maxX),
        y: Math.min(Math.max(0, newPos.y), maxY),
      });

      onResizeStopDone?.({ width: newWidth, height: newHeight });
    },
    [onResizeStopDone],
  );

  // ── Computed values ──

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

  // ── Render helpers ──

  const renderHeader = () => {
    if (!header) {
      return (
        <div className="modalHeader">
          <div className="modal-header modal-dragger flex h-10 w-full cursor-move items-center justify-between px-5">
            <div className="truncate">{title}</div>
          </div>
          <button
            className="absolute right-3 top-2"
            onClick={requestClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
      );
    }

    return typeof header === "function" ? header({ requestClose }) : header;
  };

  const renderChildren = () => {
    return typeof children === "function"
      ? children({ requestClose })
      : children;
  };

  // ── Main render ──

  const content = (
    <div className={overlayClass} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined}>
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
        style={RND_BASE_STYLE}
        onMouseDown={onModalFocus}
        onTouchStart={onModalFocus}
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

  return isInBody ? createPortal(content, document.body) : content;
};

export default ModalResizeable;
