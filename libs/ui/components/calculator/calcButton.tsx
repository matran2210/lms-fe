import DeleteIcon from "@lms/assets/CalculatorIcons/DeleteIcon";
import MinusIcon from "@lms/assets/CalculatorIcons/MinusIcon";
import MultiplyIcon from "@lms/assets/CalculatorIcons/MultiplyIcon";
import PlusIcon from "@lms/assets/CalculatorIcons/PlusIcon";
import DivideIcon from "@lms/assets/CalculatorIcons/DivideIcon";
import React from "react";
import PlusMinusIcon from "@lms/assets/CalculatorIcons/PlusMinusIcon";
import PercentageIcon from "@lms/assets/CalculatorIcons/PercentageIcon";
import EqualIcon from "@lms/assets/CalculatorIcons/EqualIcon";

interface IProps {
  value?: string | React.ReactNode;
  colored?: boolean;
  span?: number;
  className?: string;
}

const CalcButton = (props: IProps) => {
  const { value, colored, span, className } = props;
  const classList = `calc__btn ${className}
      ${colored ? " btn--colored" : ""} 
      ${span !== 1 ? ` btn--span-${span}` : ""}`;

  const convertValueToIcon = (val: any) => {
    switch (val) {
      case "delete":
        return <DeleteIcon />;
      case "+":
        return <PlusIcon />;
      case "-":
        return <MinusIcon />;
      case "x":
        return <MultiplyIcon />;
      case "÷":
        return <DivideIcon />;
      case "+/-":
        return <PlusMinusIcon />;
      case "%":
        return <PercentageIcon />;
      case "=":
        return <EqualIcon />;
      default:
        return val;
    }
  };

  return (
    <button type="button" className={classList} data-name={value}>
      {convertValueToIcon(value)}
    </button>
  );
};

export { CalcButton as default };
