import React, { memo } from "react";
import Link from "next/link";
import { IButtonProps } from "@lms/core";
import {
  ButtonSize,
  getPaddingHorizontalClass,
  getPaddingVerticalClass,
  getTextSizeClass,
} from "@lms/utils";

const ButtonOutlined = ({
  title,
  onClick,
  className = "",
  link,
  size = "small",
  full = false,
}: IButtonProps) => {
  const textSizeClass = getTextSizeClass(size as ButtonSize);
  const paddingVerticalClass = getPaddingVerticalClass(size as ButtonSize);
  const paddingHorizontalClass = getPaddingHorizontalClass(size as ButtonSize);
  const fullWidthClass = full ? "block w-full" : "inline-block w-fit";

  const componentClass = [
    className,
    "text-center",
    fullWidthClass,
    paddingVerticalClass,
    paddingHorizontalClass,
    "text-gray-800",
    textSizeClass,
    "font-medium bg-white border border-gray-800 border-solid cursor-pointer hover:border-gray hover:text-gray",
  ].join(" ");

  if (link) {
    return (
      <Link href={link} className={componentClass}>
        <span>{title}</span>
      </Link>
    );
  }

  return (
    <button className={componentClass} onClick={onClick} type="button">
      <span>{title}</span>
    </button>
  );
};

export default memo(ButtonOutlined);
