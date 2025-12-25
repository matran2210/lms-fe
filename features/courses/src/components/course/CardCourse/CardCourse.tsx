import { LockClosedIcon } from "@lms/assets";
import { ANIMATION, EAttemptStatus } from "@lms/core";
import { Tooltip } from "@lms/ui";
import { truncateString } from "@lms/utils";
import clsx from "clsx";
import React, { forwardRef } from "react";
import Badge from "./CardCourseBadge";

const mappingBadgeFromStatus: Partial<
  Record<EAttemptStatus, { badge: string; className: string }>
> = {
  [EAttemptStatus.NOT_STARTED]: {
    badge: "Not started",
    className: "bg-info-50 text-info",
  },
  [EAttemptStatus.UN_SUBMITTED]: {
    badge: "Not started",
    className: "bg-info-50 text-info",
  },
  [EAttemptStatus.IN_PROGRESS]: {
    badge: "In Progress",
    className: "bg-warning-50 text-warning",
  },
  [EAttemptStatus.SUBMITTED]: {
    badge: "Submitted",
    className: "bg-success-50 text-success",
  },
  [EAttemptStatus.AWAITING_GRADING]: {
    badge: "Awaiting Grading",
    className: "bg-warning-50 text-warning",
  },
  [EAttemptStatus.REGRADING]: {
    badge: "Regrading",
    className: "bg-warning-50 text-warning",
  },
  [EAttemptStatus.IN_REVIEW]: {
    badge: "In Review",
    className: "bg-warning-50 text-warning",
  },
  [EAttemptStatus.FINISHED]: {
    badge: "Finished",
    className: "bg-success-50 text-success",
  },
  [EAttemptStatus.FINISHED_GRADING]: {
    badge: "Finished Grading",
    className: "bg-success-50 text-success",
  },
  [EAttemptStatus.EXPIRED]: {
    badge: "Expired",
    className: "bg-error-50 text-error",
  },
};

const CardCourse = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    title: string;
    attemptStatus?: EAttemptStatus;
    footer?: React.ReactNode;
    disabledTitle?: boolean;
    hideBadge?: boolean;
    badgeCode?: {
      badge: string;
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
      attemptStatus,
      footer,
      disabledTitle = false,
      hideBadge = false,
      badgeCode,
      classNameTitle = "mt-2 mb-4 md:mb-6 md:mt-3",
      classNameCard = "",
      isLock = false,
      onClick,
    },
    ref,
  ) => {
    return (
      <div data-aos={ANIMATION.DATA_AOS}>
        <div
          data-guide-id="courses-card"
          className={clsx(
            "border-transparent relative flex flex-col rounded-xl border border-white bg-white p-4 shadow-card transition-colors duration-300 ease-in-out hover:border-primary hover:shadow-md md:p-6 lg:rounded-2xl lg:p-8",
            classNameCard,
          )}
          ref={ref}
        >
          {!hideBadge && (
            <Badge
              {...(attemptStatus
                ? mappingBadgeFromStatus[attemptStatus]!
                : badgeCode
                  ? badgeCode
                  : {
                      badge: "Not started",
                      className: "bg-info-50 text-info",
                    })}
            />
          )}
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
            {isLock && (
              <div>
                <LockClosedIcon />
              </div>
            )}
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

CardCourse.displayName = "CardCourse";
export default CardCourse;
