import { FlagIcon } from "@lms/assets";
import clsx from "clsx";
import React, { useEffect } from "react";

interface PageLinkProps extends React.LiHTMLAttributes<HTMLLIElement> {
  active?: boolean;
  disabled?: boolean;
  arrow?: boolean;
  type?: string;
  isViewedProp?: boolean;
  isFlagedProp?: boolean;
  children?: React.ReactNode;
}

const PageLinkPagination = ({
  active,
  disabled,
  arrow,
  type,
  children,
  isViewedProp,
  isFlagedProp,
  ...otherProps
}: PageLinkProps) => {
  function usePrevious<T>(value: T) {
    const ref = React.useRef<T | undefined>(undefined);
    React.useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  const prevIsFlagged = usePrevious(isFlagedProp);

  const shouldAnimate =
    prevIsFlagged !== undefined && prevIsFlagged !== isFlagedProp;

  if (arrow && disabled) {
    return (
      <li
        className={`flex cursor-not-allowed items-center justify-center ${
          type === "table"
            ? "min-h-8 min-w-8 text-[#D8D8E5]"
            : "min-h-9 text-[#A1A1A1] opacity-50"
        }`}
      >
        {children}
      </li>
    );
  }

  if (arrow) {
    return (
      <li
        className={`${
          type === "table"
            ? "min-h-8 min-w-8 text-[#7E8299]"
            : "min-h-10 cursor-pointer"
        } flex cursor-pointer items-center justify-center`}
        {...otherProps}
      >
        {children}
      </li>
    );
  }

  if (disabled) {
    return (
      <li
        className={`flex items-center justify-center ${
          type === "table"
            ? "min-h-8 min-w-8 text-[#7E8299]"
            : "min-h-10 text-3xl font-thin leading-[33px] text-[#A1A1A1]"
        }`}
      >
        {children}
      </li>
    );
  }

  return (
    <li
      className={`${
        type === "table"
          ? "min-h-8 min-w-8 rounded-md text-sm font-semibold leading-[18px]"
          : "min-h-[38px] max-h-10 min-w-[38px] text-sm font-normal leading-[22px]"
      } relative flex cursor-pointer items-center justify-center rounded p-2 ${isViewedProp && type !== "row" ? "bg-gray-400 text-white" : ""} ${
        active
          ? "border-primary bg-primary text-white"
          : !isViewedProp
            ? "bg-gray-100 text-gray-800 hover:border-primary hover:bg-primary hover:text-white"
            : "text-gray-100 hover:bg-primary hover:text-white"
      }`}
      aria-current={active ? "page" : undefined}
      {...otherProps}
    >
      <span className="h-[22px] w-4 text-center">{children}</span>
      <div
        className={clsx(
          "absolute -right-1 -top-[5px] z-[99]",
          isFlagedProp ? "flag-static-on" : "flag-static-off",
          shouldAnimate && (isFlagedProp ? "flag-enter" : "flag-exit"),
        )}
      >
        <FlagIcon width="16" height="16" />
      </div>
    </li>
  );
};

export default PageLinkPagination;
