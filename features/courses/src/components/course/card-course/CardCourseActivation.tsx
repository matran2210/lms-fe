import { ANIMATION, EAttemptStatus } from "@lms/core";
import { Tooltip } from "@lms/ui";
import { truncateString } from "@lms/utils";
import clsx from "clsx";
import React, { forwardRef } from "react";

const CardCourseActivation = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    title: string;
    attemptStatus?: EAttemptStatus;
    footer?: React.ReactNode;
    disabledTitle?: boolean;
    hideBadge?: boolean;
    badgeCode?: {
      className: string;
    };
    classNameTitle?: string;
    classNameCard?: string;
    isLock?: boolean;
    onClick?: () => void;
  }
>(
  (
    {
      children,
      title,
      footer,
      disabledTitle = false,
      classNameTitle = "mt-2 mb-4 md:mb-6 md:mt-3",
      classNameCard = "",
      onClick,
    },
    ref,
  ) => {
    return (
      <div data-aos={ANIMATION.DATA_AOS}>
        <div
          className={clsx(
            "border-transparent relative flex flex-col rounded-xl border border-white bg-white p-4 shadow-card transition-colors duration-300 ease-in-out hover:border-primary hover:shadow-md md:p-6 lg:rounded-2xl lg:p-8",
            classNameCard,
          )}
          ref={ref}
        >
          <div className={clsx("flex justify-between", classNameTitle)}>
            <h2
              className={clsx(
                "line-clamp-2 cursor-pointer text-base font-semibold md:text-xl",
                {
                  "text-gray-300": disabledTitle,
                  "text-gray-800": !disabledTitle,
                },
              )}
              onClick={onClick}
            >
              <Tooltip
                title={title}
                showTooltip={(title as string)?.length > 60}
              >
                {truncateString(title, 60)}
              </Tooltip>
            </h2>
          </div>

          {children}
          {/* card footer */}
          {footer}
          {/* card footer */}
        </div>
      </div>
    );
  },
);

CardCourseActivation.displayName = "CardCourseActivation";
export default CardCourseActivation;
