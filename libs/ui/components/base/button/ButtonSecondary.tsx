import React from "react";
import BaseButton from "./BaseButton";
import { IButtonBaseProps } from "@lms/core";
import clsx from "clsx";
import LoadingButtonAnimation from "./LoadingButtonAnimation";

const ButtonSecondary = ({
  title,
  onClick,
  className = "",
  link,
  size = "small",
  disabled = false,
  startIcon,
  endIcon,
  full = false,
  children,
  loading,
  ...props
}: IButtonBaseProps) => {
  const textSizeClass =
    size === "small"
      ? "text-sm"
      : size === "medium"
        ? "text-sm md:text-base"
        : "text-sm md:text-lg";
  const padding =
    size === "small"
      ? "py-[7px] px-[15px]"
      : size === "medium"
        ? "py-[7px] px-[15px] md:py-[11px] md:px-[23px]"
        : "py-[7px] px-[15px] md:py-[15px] md:px-[31px]";

  const fullWidthClass = full ? "block w-full" : "inline-block";

  const componentClass = clsx(
    `
    text-center
    bg-transparent
    rounded-lg
    border border-secondary
    box-border
    font-medium
    ${padding}
    ${textSizeClass}
    ${fullWidthClass}
     `,
    className,
    {
      " text-secondary hover:!text-secondary hover:!border-secondary hover:!bg-gray-100 cursor-pointer":
        !disabled,
      "cursor-not-allowed !bg-gray-100 !text-gray-400 !border !border-gray-200 hover:!bg-gray-100 hover:!text-gray-400 hover:!border-gray-200":
        disabled,
    },
  );

  return (
    <BaseButton
      className={`${componentClass}`}
      onClick={onClick}
      disabled={disabled}
      link={link}
      {...props}
    >
      <div className="flex items-center gap-2.5">
        {loading ? (
          <LoadingButtonAnimation />
        ) : (
          <>
            {startIcon && <div className="w-full">{startIcon}</div>}
            <div className="w-full">{title || children}</div>
            {endIcon && <div className="w-full">{endIcon}</div>}
          </>
        )}
      </div>
    </BaseButton>
  );
};

export default ButtonSecondary;
