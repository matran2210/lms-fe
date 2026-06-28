import { LoadingButtonAnimation } from "@lms/assets";
import { IButtonProps } from "@lms/core";
import Link from "next/link";
import { Tooltip } from "../../common";

const SIZES = {
  small: "text-[0.875rem] leading-4",
  medium: "text-[1rem] leading-6",
  large: "text-lg leading-[27px]",
  extra: "text-lg leading-[27px]",
};

const COLORS = {
  primary:
    "bg-black text-white rounded-lg hover:bg-[#404041] disabled:text-gray-300 disabled:bg-accent",
  info: "bg-info hover:bg-info-2 disabled:bg-info-2 text-white",
  success: "bg-success hover:bg-success-2 disabled:bg-success-2 text-white",
  secondary:
    "bg-gray-200 hover:bg-secondary-4 disabled:bg-secondary-4 text-gray-800",
  danger: "bg-error-300 hover:bg-[#dd4339] disabled:bg-[#dd4339] text-white",
  warning: "bg-warning hover:bg-warning-2 disabled:bg-warning-2 text-white",
  light: "bg-light hover:bg-light-2 disabled:bg-light-2 text-white",
  dark: "bg-dark hover:bg-dark-2 disabled:bg-dark-2 text-white",
  white:
    "bg-white hover:bg-[#F26E56] disabled:bg-white text-gray-400 hover:text-white",
  outline:
    "bg-white border-gray-800 hover:border-gray-400 hover:text-gray-400 text-gray-800",
  text: "bg-none text-gray-800 hover:text-gray-400 disabled:text-divider underline-offset-2 font-medium",
  textUnderline:
    "bg-none text-gray-800 hover:text-gray disabled:text-secondary-100 underline-offset-2 underline font-medium",
  quizActivity:
    "bg-gray hover:bg-secondary-100 disabled:bg-secondary-100 text-white",
  okPopup: "bg-accent-error text-white",
  cancelPopup: "bg-gray-100 text-accent-default",
  "light-dark":
    "bg-secondary-600 hover:bg-secondary disabled:bg-gray-100 text-white",
  gray: "bg-white hover:bg-primary-400 disabled:bg-white text-gray-800 hover:text-white",
};

const PADDINGS = {
  small: "px-4 py-2",
  medium: "px-6 py-3",
  large: "px-9 py-3",
  extra: "px-[70px] py-3",
  none: "",
};

const SappButton = ({
  title,
  onClick,
  className = "",
  link,
  size = "small",
  full = false,
  disabled = false,
  loading = false,
  type = "button",
  color = "primary",
  isUnderLine,
  isPadding = true,
  childClass = "",
  classNameLoading = "",
  showTooltip = false,
  toolTipTitle = "",
}: IButtonProps) => {
  // const isDisabled = disabled || loading
  const isDisabled = disabled;
  const paddingClass = isPadding ? PADDINGS[size] : PADDINGS.none;
  const fullWidthClass = full ? "block w-full" : "inline-block w-fit";

  const underlineClass =
    isUnderLine !== undefined
      ? isUnderLine
        ? "hover:underline"
        : ""
      : color === "text"
        ? "hover:underline"
        : "";

  const componentClass = `
    ${className}
    ${COLORS[color]}
    ${SIZES[size]}
    ${paddingClass}
    ${fullWidthClass}
    ${underlineClass}
    relative text-center font-medium
    ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
  `.trim();

  const loadingIndicator = <LoadingButtonAnimation className="!size-[18px]" />;

  const buttonContent = (
    <Tooltip title={toolTipTitle} showTooltip={showTooltip}>
      <span className={`${loading ? "invisible" : ""} ${childClass}`}>
        {title}
      </span>
    </Tooltip>
  );

  // Use Next.js Link for better routing
  if (link) {
    return (
      <Link href={link} className={componentClass} aria-disabled={isDisabled}>
        {loading ? loadingIndicator : buttonContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={`${componentClass} ${classNameLoading}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {loading ? loadingIndicator : buttonContent}
    </button>
  );
};

export default SappButton;
