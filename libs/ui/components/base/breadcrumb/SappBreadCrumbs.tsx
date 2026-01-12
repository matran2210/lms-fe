import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ITabs } from "@lms/core";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "../../common";

const SappBreadCrumbs = ({
  breadcrumbs = [],
  isTeacher = false,
  className,
}: {
  breadcrumbs?: ITabs[];
  isTeacher?: boolean;
  className?: string;
}) => {
  const [isLastTakesFullWidth, setIsLastTakesFullWidth] = useState(false);
  const [isDisplayFull, setIsDisplayFull] = useState(false);
  const lastIndex = breadcrumbs.length - 1;
  const isHideItemBreadcrumb = breadcrumbs.length > 3;

  const handleTitleDisplay = (title: string, length: number) => {
    const isLong = title?.length > length;
    return isLong ? title.slice(0, length) + "..." : title;
  };

  const checkIsLastTakesFullWidth = () => {
    const element = document.querySelector(".breadcrumb-last") as HTMLElement;
    if (!element) return false;
    const computedStyle = window.getComputedStyle(element);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const elementHeight = element.offsetHeight;
    const numberOfLines = Math.round(elementHeight / lineHeight);
    return numberOfLines >= 2;
  };

  useEffect(() => {
    setIsLastTakesFullWidth(checkIsLastTakesFullWidth());
  }, []);

  return (
    <nav aria-label="breadcrumb" className={clsx("hidden lg:block", className)}>
      <ul className="flex items-center overflow-hidden text-sm font-normal text-zinc-400">
        <AnimatePresence initial={false}>
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === lastIndex;

            if (isHideItemBreadcrumb && index > 1 && !isDisplayFull) {
              if (index === lastIndex - 1) {
                return (
                  <motion.div
                    key="dots"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0 }}
                    className="mr-2 cursor-pointer text-[1.125rem] text-gray-800"
                    onClick={() => setIsDisplayFull(true)}
                  >
                    ...&nbsp;&nbsp;/
                  </motion.div>
                );
              }
              if (!isLast) return null;
            }

            const titleDisplay = handleTitleDisplay(
              breadcrumb.title,
              isLast ? 20 : 30,
            );
            const isLong = breadcrumb.title?.length > 30;

            return (
              <motion.li
                layout
                key={breadcrumb.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  layout: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
                  duration: 0.3,
                }}
                className={clsx(
                  "flex items-center text-base",
                  isLast ? "font-medium text-gray-400" : "text-gray-800",
                )}
              >
                {/* Nội dung breadcrumb */}
                {isLast ? (
                  isLastTakesFullWidth ? (
                    <Tooltip
                      title={breadcrumb.title}
                      showTooltip={isLong}
                      placement="bottomLeft"
                    >
                      <span className="breadcrumb-last cursor-pointer">
                        {titleDisplay}
                      </span>
                    </Tooltip>
                  ) : (
                    <span className="breadcrumb-last">{breadcrumb.title}</span>
                  )
                ) : (
                  <Link href={breadcrumb.link}>
                    <div>
                      <Tooltip
                        title={breadcrumb.title}
                        showTooltip={isLong}
                        placement="bottomLeft"
                      >
                        <span
                          className={clsx(
                            "transition-all duration-300",
                            !breadcrumb?.disable &&
                              "cursor-pointer hover:text-primary",
                          )}
                        >
                          {titleDisplay}
                        </span>
                      </Tooltip>
                    </div>
                  </Link>
                )}

                {/* Dấu phân cách — gộp chung trong cùng motion */}
                {!isLast && (
                  <span
                    className={clsx(
                      "mx-2 text-[1.125rem]",
                      isTeacher && "text-tiny",
                      index === lastIndex - 1
                        ? "text-gray-800"
                        : "text-gray-400",
                    )}
                  >
                    {isTeacher ? "▶" : "/"}
                  </span>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </nav>
  );
};

export default SappBreadCrumbs;
