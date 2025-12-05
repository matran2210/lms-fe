import { LoadingButtonAnimation } from "@lms/assets";
import { IButtonBaseProps } from "@lms/core";
import BaseButton from "./BaseButton";

const ButtonText = ({
  title,
  onClick,
  className = "",
  link,
  size = "small",
  disabled = false,
  startIcon,
  endIcon,
  full = false,
  isUnderLine = true,
  loading,
  children,
  ...props
}: IButtonBaseProps) => {
  const textSizeClass =
    size === "small"
      ? "text-sm"
      : size === "medium"
        ? "text-sm md:text-base"
        : "text-sm md:text-lg";

  const fullWidthClass = full ? "block w-full" : "inline-block w-fit";
  const disabledClass = disabled
    ? "cursor-not-allowed !text-secondary-100 hover:!text-secondary-100"
    : "cursor-pointer";

  const isUnderline = isUnderLine ? "underline" : "";

  const componentClass = `
    p-0
    text-center 
    font-medium
    !border-none
    text-gray-800
    !bg-transparent
    hover:text-primary
    ${isUnderline}
    ${fullWidthClass} 
    ${disabledClass} 
    ${textSizeClass} 
    ${className} 
  `;

  return (
    <BaseButton
      className={componentClass}
      onClick={onClick}
      disabled={disabled}
      link={link}
      {...props}
    >
      <div className="flex items-center gap-2">
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

export default ButtonText;
