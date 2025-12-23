import { AssistiveIcon } from "@lms/assets";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Draggable from "react-draggable";

interface AssistiveTouchProps {
  menuItems: {
    label: React.ReactNode;
    onClick: () => void;
  }[];
  className?: string;
}

export default function AssistiveTouch({
  menuItems,
  className,
}: AssistiveTouchProps) {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 50 });
  const [dragStartTime, setDragStartTime] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setDragStartTime(Date.now());
    setIsDragging(false);
  };

  const handleDrag = () => {
    setIsDragging(true);
  };

  const handleStop = (_: any, data: any) => {
    const dragDuration = Date.now() - dragStartTime;

    // Nếu kéo quá ngắn (< 100ms) thì coi như click
    if (dragDuration < 100) {
      setIsDragging(false);
    } else {
      // Delay để tránh trigger onClick ngay sau khi kéo
      setTimeout(() => setIsDragging(false), 150);
    }

    if (!wrapperRef.current) return;

    // Luôn hút về bên phải
    const targetY = data.y;
    setPosition({ x: 0, y: targetY });
  };

  const handleButtonClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    // Chỉ mở menu nếu không đang kéo
    if (!isDragging) {
      setOpen((prev) => !prev);
    }
  };

  // Detect click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {
        createPortal(
          <Draggable
            bounds="body"
            position={position}
            onStart={handleStart}
            onDrag={handleDrag}
            onStop={handleStop}
            defaultClassName={className}
            nodeRef={wrapperRef}
          >
            <div
              ref={wrapperRef}
              className="fixed bottom-[20%] right-5 z-[1101]"
              style={{ touchAction: "none" }}
            >
              {/* Main Button */}
              {!open && (
                <button
                  type="button"
                  onClick={handleButtonClick}
                  onTouchEnd={handleButtonClick}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-icon text-white shadow-lg backdrop-blur-sm transition-transform active:scale-95"
                  style={{
                    cursor: isDragging ? "grabbing" : "pointer",
                    pointerEvents: "auto",
                  }}
                >
                  <AssistiveIcon className="h-[28px] w-[28px]" />
                </button>
              )}

              {/* Menu */}
              {/* <AnimatePresence> */}
              <div
                // initial={{ opacity: 0, scale: 0.8, y: 10 }}
                // animate={{ opacity: 1, scale: 1, y: 0 }}
                // exit={{ opacity: 0, scale: 0.8, y: 10 }}
                // transition={{ duration: 0.2 }}
                // style={{
                //   // Fallback styles nếu Framer Motion fail
                //   opacity: open ? 1 : 0,
                //   display: open ? 'inline-flex' : 'none',
                //   position: 'absolute',
                //   bottom: 0,
                //   right: 0,
                //   backgroundColor: 'rgba(31, 41, 55, 0.8)',
                //   backdropFilter: 'blur(2px)',
                //   borderRadius: '20px',
                //   padding: '20px 24px',
                //   flexDirection: 'column',
                //   alignItems: 'center',
                //   justifyContent: 'center',
                //   gap: '20px',
                // }}
                className={clsx(
                  "absolute bottom-0 right-0 inline-flex flex-col items-center justify-center gap-[20px] rounded-[20px] bg-gray-800/80 px-6 py-5 backdrop-blur-[2px]",
                  "origin-bottom-right transform transition-all duration-200 ease-in-out",
                  {
                    "pointer-events-auto visible translate-y-0 scale-100 opacity-100":
                      open,
                    "pointer-events-none invisible translate-y-3 scale-75 opacity-0":
                      !open,
                  },
                )}
              >
                {menuItems.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      item.onClick();
                      setOpen(false);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      item.onClick();
                      setOpen(false);
                    }}
                    className="text-xs text-white transition hover:text-primary"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {/* </AnimatePresence> */}
            </div>
          </Draggable>, document.body
        )
      }
    </>
  );
}
