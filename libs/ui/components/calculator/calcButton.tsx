import DeleteIcon from "@assets/icons/CalculatorIcons/DeleteIcon";
import MinusIcon from "@assets/icons/CalculatorIcons/MinusIcon";
import MultiplyIcon from "@assets/icons/CalculatorIcons/MultiplyIcon";
import PlusIcon from "@assets/icons/CalculatorIcons/PlusIcon";
import DivideIcon from "@assets/icons/CalculatorIcons/DivideIcon";
import React from "react";
import PlusMinusIcon from "@assets/icons/CalculatorIcons/PlusMinusIcon";
import PercentageIcon from "@assets/icons/CalculatorIcons/PercentageIcon";
import EqualIcon from "@assets/icons/CalculatorIcons/EqualIcon";

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
