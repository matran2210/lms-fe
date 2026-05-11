"use client"
import { CloseIcon } from "@lms/assets";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ResizeDirection } from "re-resizable";
import { DraggableData, Rnd, RndDragEvent } from "react-rnd";
import useFocusTrap from "./useFocusTrap";

// ── Constants ──────────────────────────────────────────────────────────
const MODAL_OFFSET_PX = 20;
const EDGE_SNAP_PX = 0; // Disable edge snapping

const RND_BASE_STYLE: React.CSSProperties = {
  background: "white",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  border: "1px solid #DCDDDD",
  position: "absolute",
  pointerEvents: "auto",
};

// ── Framer Motion Variants ─────────────────────────────────────────────
const modalVariants = {
  initial: { scale: 0.92, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
};

const modalTransition = {
  duration: 0.3,
  ease: "easeOut",
};

// ── Types ──────────────────────────────────────────────────────────────
export type ModalPosition =
  | "top left"
  | "top middle"
  | "top right"
  | "bottom left"
  | "bottom middle"
  | "bottom right"
  | "center left"
  | "center right"
  | "center";

export interface ModalResizeableProps {
  // ── Content ──
  title?: string | ReactNode;
  children:
    | ReactNode
    | ((helpers: { requestClose: () => void }) => ReactNode);
  header?:
    | ReactNode
    | ((actions: { requestClose: () => void }) => ReactNode);

  // ── Size ──
  width?: number; // default: 600
  height?: number; // default: 400
  minWidth?: number; // default: 200
  minHeight?: number; // default: 200
  maxWidth?: number;
  maxHeight?: number;

  // ── Position & Drag ──
  position?: ModalPosition; // default: "center"
  modalIndex?: number; // default: 0
  draggableFull?: boolean; // default: false
  dragHandleClassName?: string;

  // ── CSS Classes ──
  className?: string;
  rootClassName?: string;
  bodyClassName?: string;
  contentClassName?: string;

  // ── Callbacks ──
  onClose?: () => void;
  onModalFocus?: () => void;
  onResizeStopDone?: (size: { width: number; height: number }) => void;

  // ── Portal ──
  isInBody?: boolean; // default: false

  // ── Focus Trap ──
  /**
   * When multiple modals are open simultaneously, only the top-most modal
   * (highest modalIndex) should have the focus trap active.
   * - `undefined` (default): focus trap is enabled (backward-compatible default).
   * - `true`: focus trap is explicitly enabled.
   * - `false`: focus trap is disabled (modal is not the top-most one).
   */
  isTopModal?: boolean;
}

// ── Pure Utility Functions ─────────────────────────────────────────────

/**
 * Ensures a value is >= 0 to prevent invalid positions.
 */
const clampPositive = (value: number): number => Math.max(0, value);

/**
 * Calculates the initial modal position based on the `position` prop,
 * modal dimensions, and an optional stacking offset.
 *
 * Pure function — no side effects, safe to unit test in isolation.
 */
export const calculatePosition = (
  pos: ModalPosition,
  modalWidth: number,
  modalHeight: number,
  offset = 0,
): { x: number; y: number } => {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const shift = offset * MODAL_OFFSET_PX;

  const positions: Record<ModalPosition, { x: number; y: number }> = {
    "top left": {
      x: clampPositive(shift),
      y: clampPositive(shift),
    },
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

  return positions[pos] ?? positions.center;
};

/**
 * Clamps modal position so it stays within the visible viewport.
 * Ensures x >= 0, y >= 0, and the modal doesn't overflow the right/bottom edge.
 *
 * Pure function — no side effects, safe to unit test in isolation.
 */
export const clampPosition = (
  x: number,
  y: number,
  modalWidth: number,
  modalHeight: number,
): { x: number; y: number } => {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  const maxX = Math.max(0, vw - modalWidth);
  const maxY = Math.max(0, vh - modalHeight);
  const nextX = Math.min(Math.max(0, x), maxX);
  const nextY = Math.min(Math.max(0, y), maxY);

  return {
    x:
      nextX <= EDGE_SNAP_PX
        ? 0
        : maxX - nextX <= EDGE_SNAP_PX
          ? maxX
          : nextX,
    y:
      nextY <= EDGE_SNAP_PX
        ? 0
        : maxY - nextY <= EDGE_SNAP_PX
          ? maxY
          : nextY,
  };
};

// ── Hook: useModalPosition ─────────────────────────────────────────────

interface UseModalPositionOptions {
  position: ModalPosition;
  width: number;
  height: number;
  modalIndex: number;
}

function useModalPosition({
  position,
  width,
  height,
  modalIndex,
}: UseModalPositionOptions): {
  modalPosition: { x: number; y: number };
  setModalPosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
} {
  // Use ref to store initial position calculation
  const initialPositionRef = useRef<{ x: number; y: number } | null>(null);
  
  if (initialPositionRef.current === null) {
    initialPositionRef.current = calculatePosition(position, width, height, modalIndex);
  }

  // Use the ref value as initial state
  const [modalPosition, setModalPosition] = useState(initialPositionRef.current);

  // No useEffect - position never auto-updates after initial render
  // This prevents the modal from jumping to center on any interaction

  return { modalPosition, setModalPosition };
}

//   return { modalPosition, setModalPosition: setModalPositionWithFlag };
// }

// ── Component ──────────────────────────────────────────────────────────

const ModalResizeable: React.FC<ModalResizeableProps> = ({
  title = "Title",
  children,
  width = 600,
  height = 400,
  minWidth = 200,
  minHeight = 200,
  maxWidth,
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
  isTopModal,
}) => {
  // ── Internal state ──
  const [size, setSize] = useState({ width, height });

  // `closing` drives the exit animation and guards against double-trigger.
  // When true: focus trap is disabled, aria-hidden is set, exit animation plays.
  const [closing, setClosing] = useState(false);

  // `visible` controls AnimatePresence mount/unmount.
  // It stays true until the exit animation completes, then flips to false
  // which triggers onClose via onExitComplete.
  const [visible, setVisible] = useState(true);

  // Track dragging/resizing state to disable pointer events on content
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const getRenderedModalRect = useCallback(() => {
    if (isDragging) return null;
    const rect = containerRef.current?.parentElement?.getBoundingClientRect();

    if (!rect) {
      return null;
    }

    return rect;
  }, [isDragging]);

  const getRenderedModalSize = useCallback(() => {
    if (isDragging) return null;
    const rect = getRenderedModalRect();

    if (!rect) {
      return null;
    }

    return {
      width: clampPositive(rect.width),
      height: clampPositive(rect.height),
    };
  }, [getRenderedModalRect, isDragging]);

  // Unique id for aria-labelledby — stable across renders
  const titleId = useRef(
    `modal-title-${Math.random().toString(36).slice(2, 9)}`,
  ).current;

  const { modalPosition, setModalPosition } = useModalPosition({
    position,
    width: size.width,
    height: size.height,
    modalIndex,
  });

  useEffect(() => {
    if (closing) return; // Don't update size when closing
    setSize({ width, height });
  }, [width, height, closing]);

  useEffect(() => {
    if (!visible || isDragging || closing) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const renderedSize = getRenderedModalSize();

      if (!renderedSize) {
        return;
      }

      setSize((prev) => {
        if (
          Math.abs(prev.width - renderedSize.width) < 0.5 &&
          Math.abs(prev.height - renderedSize.height) < 0.5
        ) {
          return prev;
        }

        return renderedSize;
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [getRenderedModalSize, visible, width, height, isDragging, closing]);

  // ── Focus Trap ──
  // Disabled while closing so focus is released before the modal unmounts.
  // When isTopModal is explicitly false, the focus trap is also disabled —
  // this allows consumers to enable the trap only for the top-most modal
  // when multiple modals are open simultaneously.
  // When isTopModal is undefined (default), the trap is enabled for
  // backward compatibility.
  useFocusTrap({ enabled: !closing && isTopModal !== false, containerRef });

  // ── requestClose — guard against double-trigger ──
  const requestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    // Trigger AnimatePresence exit by removing the child from the tree
    setVisible(false);
  }, [closing]);

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

  // ── Drag handler — clamp position to viewport on drag end ──
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragStop = useCallback(
    (_e: RndDragEvent, d: DraggableData) => {
      if (closing) return; // Don't update position when closing
      
      const renderedRect = getRenderedModalRect();
      const renderedSize = getRenderedModalSize();
      const modalWidth = renderedRect?.width ?? renderedSize?.width ?? size.width;
      const modalHeight =
        renderedRect?.height ?? renderedSize?.height ?? size.height;
      const modalX = renderedRect?.left ?? d.x;
      const modalY = renderedRect?.top ?? d.y;

      if (renderedSize) {
        setSize((prev) => {
          if (
            Math.abs(prev.width - renderedSize.width) < 0.5 &&
            Math.abs(prev.height - renderedSize.height) < 0.5
          ) {
            return prev;
          }

          return renderedSize;
        });
      }

      setModalPosition({ x: modalX, y: modalY }); // Don't clamp, allow modal at edges
      document.body.style.cursor = "";
      setIsDragging(false);
    },
    [
      getRenderedModalRect,
      getRenderedModalSize,
      size.width,
      size.height,
      setModalPosition,
      closing,
    ],
  );

  // ── Resize handler — update size and clamp position on resize end ──
  const handleResizeStart = useCallback(() => {
    document.body.style.cursor = "grabbing";
    setIsDragging(true);
  }, []);

  const handleResizeStop = useCallback(
    (
      _e: MouseEvent | TouchEvent,
      _direction: ResizeDirection,
      ref: HTMLElement,
      _delta: { height: number; width: number },
      _newPos: { x: number; y: number },
    ) => {
      if (closing) return; // Don't update size/position when closing
      
      const rect = ref.getBoundingClientRect();
      const newWidth = rect.width;
      const newHeight = rect.height;
      const nextX = rect.left;
      const nextY = rect.top;

      setSize({
        width: clampPositive(newWidth),
        height: clampPositive(newHeight),
      });

      setModalPosition({ x: nextX, y: nextY }); // Don't clamp, allow modal at edges
      onResizeStopDone?.({ width: newWidth, height: newHeight });
      document.body.style.cursor = "";
      setIsDragging(false);
    },
    [onResizeStopDone, setModalPosition, closing],
  );

  // ── Exit animation complete → call onClose exactly once ──
  // AnimatePresence calls onExitComplete after the exit animation finishes.
  const handleExitComplete = useCallback(() => {    
    onClose?.();
  }, [onClose]);

  // ── Computed values ──
  const dragHandleClass = draggableFull
    ? undefined
    : dragHandleClassName || "modal-dragger";

  const rndClass = clsx(
    "modalResizeable",
    "overflow-hidden rounded-xl",
    className,
    rootClassName,
  );

  // ── renderHeader — default header or custom (ReactNode / function) ──
  const renderHeader = () => {
    if (!header) {
      return (
        <div className="modalHeader relative">
          {/*
           * The `modal-dragger` class on this div is the drag handle.
           * When draggableFull=false, react-rnd restricts dragging to this element.
           */}
          <div className="modal-header modal-dragger flex h-10 w-full cursor-move items-center justify-between px-5">
            {typeof title === "string" ? (
              // Assign the stable titleId so aria-labelledby can reference it
              <div id={titleId} className="truncate">
                {title}
              </div>
            ) : (
              <div className="truncate">{title}</div>
            )}
          </div>
          <button
            className="absolute right-3 top-2"
            onClick={requestClose}
            aria-label="Đóng"
            type="button"
          >
            <CloseIcon />
          </button>
        </div>
      );
    }

    // Custom header: function receives requestClose so it can trigger close
    return typeof header === "function" ? header({ requestClose }) : header;
  };

  // ── renderChildren — function-as-child or plain ReactNode ──
  const renderChildren = () => {
    return typeof children === "function"
      ? children({ requestClose })
      : children;
  };

  // Track if this is the first render to control animations
  const isInitialRenderRef = useRef(true);
  
  useEffect(() => {
    isInitialRenderRef.current = false;
  }, []);

  // ── Main render ──
  // Calculate z-index: base 1000 + modalIndex * 10 + (isTopModal ? 100 : 0)
  // This ensures the focused modal is always on top
  const zIndex = 1000 + (modalIndex || 0) * 10 + (isTopModal ? 100 : 0);
  
  const content = (
    <div 
      className="pointer-events-none fixed inset-0 overflow-hidden modal-overlay"
      style={{ zIndex }}
    >
      {/*
       * AnimatePresence manages the mount/unmount lifecycle of the modal.
       * `onExitComplete` fires after the exit animation finishes — this is
       * where we call onClose, ensuring it's called exactly once.
       */}
      <AnimatePresence onExitComplete={handleExitComplete}>
        {visible && (
          <motion.div
            key="modal"
            variants={modalVariants}
            initial={isInitialRenderRef.current ? "initial" : false}
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            aria-hidden={closing || undefined}
            style={{ 
              pointerEvents: "none", // Changed from "auto" to "none"
              position: "absolute", 
              inset: 0 
            }}
          >
            <Rnd
              size={size}
              position={modalPosition}
              onDragStart={handleDragStart}
              onDragStop={handleDragStop}
              onResizeStart={handleResizeStart}
              onResizeStop={handleResizeStop}
              minWidth={minWidth}
              minHeight={minHeight}
              maxWidth={maxWidth}
              maxHeight={maxHeight}
              bounds="window"
              dragHandleClassName={dragHandleClass}
              className={rndClass}
              style={RND_BASE_STYLE}
              disableDragging={false}
              enableResizing={true}
              onMouseDown={onModalFocus}
              onTouchStart={onModalFocus}
            >
              {/*
               * This div is the focus trap container and the ARIA dialog root.
               * tabIndex={-1} allows it to receive programmatic focus as a
               * fallback when no focusable children exist.
               */}
              <div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={
                  typeof title === "string" ? titleId : undefined
                }
                aria-label={typeof title !== "string" ? "Modal" : undefined}
                tabIndex={-1}
                className={clsx(
                  "absolute left-0 top-0 flex h-full min-h-0 w-full flex-col",
                  bodyClassName,
                )}
              >
                {renderHeader()}
                <div 
                  className={clsx("modalContent flex-1 min-h-0", contentClassName)}
                  style={{
                    height: "auto",
                    minHeight: 0,
                    pointerEvents: isDragging ? "none" : "auto",
                  }}
                >
                  {renderChildren()}
                </div>
              </div>
            </Rnd>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ── Portal support ──
  // SSR-safe: check for document before calling createPortal
  const portalTarget =
    isInBody && typeof document !== "undefined" ? document.body : null;

  return portalTarget ? createPortal(content, portalTarget) : content;
};

export default ModalResizeable;
