"use client";
import React, { useEffect, useState } from "react";
import { calculate, isNumber } from "./logic/calculate";

import ButtonsContainer from "./ButtonsContainer";
import Display from "./display";
import Warning from "./warning";
import clsx from "clsx";

interface IProps {
  isMobileCalc?: boolean;
  isShortScreen?: boolean;
}
const Calculator = ({
  isMobileCalc = false,
  isShortScreen = false,
}: IProps) => {
  const [lastExpression, setLastExpression] = useState("");
  const [calc, setCalc] = useState({
    total: null,
    next: null,
    operation: null,
  });

  const [badDivision, setBadDivision] = useState(false);

  useEffect(() => {
    if (badDivision) {
      setTimeout(() => {
        setBadDivision(false);
      }, 3000);
    }
  }, [badDivision]);

  const maxLength = 20;

  const updateState = (obj: any, key: any) => {
    if (obj.next !== null && obj.next.length >= maxLength && isNumber(key)) {
      return;
    }

    // Lưu biểu thức trước khi state bị xóa sau khi bấm "="
    if (key === "=" && obj.total && obj.operation && obj.next) {
      setLastExpression(`${obj.total} ${obj.operation} ${obj.next}`);
    }
    if (key === "AC") {
      setLastExpression("");
    }

    const newObj = calculate(obj, key);

    if (newObj.total === "Undefined") {
      setBadDivision(true);
      setCalc({ total: null, next: null, operation: null });
    } else {
      setCalc((preObj: any) => ({ ...preObj, ...newObj }));
    }
  };

  const handleClick = (obj: any, e: React.MouseEvent) => {
    const button = (e.target as HTMLElement).closest("button[data-name]");
    if (!button) return;

    const value = button.getAttribute("data-name");
    updateState(obj, value);
  };

  const handleKeyDown = (e: any) => {
    e.preventDefault();
  };

  const { total, next, operation } = calc;

  return (
    <div
      className={clsx("calc", {
        "!w-64": isMobileCalc || isShortScreen,
      })}
      style={{
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <Display
        total={total ?? ""}
        next={next ?? ""}
        operation={operation ?? ""}
        lastExpression={lastExpression}
      />
      <ButtonsContainer
        click={(e) => handleClick(calc, e)}
        keyDown={handleKeyDown}
        isMobileCalc={isMobileCalc}
        isShortScreen={isShortScreen}
      />
      <Warning warning={badDivision} />
    </div>
  );
};

export default Calculator;
