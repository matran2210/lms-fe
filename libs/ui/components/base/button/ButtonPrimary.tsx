import React from 'react';
import { LoadingButtonAnimation } from "@lms/assets";
import { IButtonBaseProps } from "@lms/core";
import clsx from "clsx";
import BaseButton from "./BaseButton";

const ButtonPrimary = ({
  title,
  onClick,
  className = "",
  link,
  size = "small",
  disabled = false,
  startIcon,
  endIcon,
  full = false,
  loading,
  children,
  ...props
}: IButtonBaseProps) => {
  let textSizeClass =
    size === "small"
      ? "text-sm"
      : size === "medium"
        ? "text-sm md:text-base"
        : "text-sm md:text-lg";
  let padding =
    size === "small"
      ? "py-2 px-4"
      : size === "medium"
        ? "py-2 px-4 md:py-3 md:px-6"
        : "py-2 px-4 md:py-4 md:px-8";
  // let fullWidthClass = full ? 'block w-full' : 'inline-block'
  // let disabledClass = disabled
  //   ? 'cursor-not-allowed !bg-gray-100 !text-gray-400 hover:!bg-gray-100 hover:!text-gray-400 hover:!border-gray-100'
  //   : 'cursor-pointer'
  let componentClass = clsx(
    `text-center font-medium border-none ${padding} ${textSizeClass}`,
    className,
    {
      "cursor-not-allowed !bg-gray-100 !text-gray-400 hover:!bg-gray-100 hover:!text-gray-400 hover:!border-gray-100":
        disabled,
      "cursor-pointer text-white bg-secondary-600 hover:!text-white hover:!bg-secondary":
        !disabled,
      "block w-full": full,
      "inline-block": !full,
    },
  );

  return (
    <BaseButton
      className={componentClass}
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

export default ButtonPrimary;
