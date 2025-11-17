import React from "react";
import CalcButton from "./calcButton";
import clsx from "clsx";

interface IProps {
  click: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  keyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  isMobileCalc?: boolean;
}

const ButtonsContainer = (props: IProps) => {
  const { click, keyDown, isMobileCalc = false } = props;

  const btnClassName = isMobileCalc ? "w-[48px] h-[48px]" : "";
  return (
    <div
      className={clsx("calc__btns-container", {
        "!p-4": isMobileCalc,
      })}
      onClick={click}
      onKeyDown={keyDown}
      aria-hidden="true"
    >
      <CalcButton value="AC" className={btnClassName} />
      <CalcButton value="+/-" className={btnClassName} />
      <CalcButton value="%" className={btnClassName} />
      <CalcButton value="÷" className={btnClassName} colored />

      <CalcButton value="7" className={btnClassName} />
      <CalcButton value="8" className={btnClassName} />
      <CalcButton value="9" className={btnClassName} />
      <CalcButton value="x" className={btnClassName} colored />

      <CalcButton value="4" className={btnClassName} />
      <CalcButton value="5" className={btnClassName} />
      <CalcButton value="6" className={btnClassName} />
      <CalcButton value="-" className={btnClassName} colored />

      <CalcButton value="1" className={btnClassName} />
      <CalcButton value="2" className={btnClassName} />
      <CalcButton value="3" className={btnClassName} />
      <CalcButton value="+" className={btnClassName} colored />

      <CalcButton value="." className={btnClassName} />
      <CalcButton value="0" className={btnClassName} />
      <CalcButton value="delete" className={btnClassName} />
      <CalcButton value="=" className={btnClassName} colored />
    </div>
  );
};

export { ButtonsContainer as default };
