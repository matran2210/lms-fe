import operate from "./operate";
type Operator = "+" | "-" | "x" | "÷" | "%" | null;
  interface CalcState {
    total: string | null;
    next: string | null;
    operation: Operator;
  }
function isNumber(item: string) {
  return !!item.match(/[0-9]+/);
}

function calculate(obj: CalcState, buttonName: string) {
  if (buttonName === undefined) {
    return {};
  }

  if (buttonName === "delete") {
    if (obj.next) {
      const newNext = obj.next.slice(0, -1);
      return { next: newNext.length > 0 ? newNext : null };
    } else if (!obj.next && obj.operation && obj.total) {
      // Nếu đang nhập phép tính nhưng người dùng chưa nhập số tiếp theo, có thể xoá operation
      return { operation: null };
    } else if (obj.total && !obj.operation) {
      // Trường hợp vừa bấm "=" xong và muốn xoá lại total
      const newTotal = obj.total.slice(0, -1);
      return { total: newTotal.length > 0 ? newTotal : null };
    }
    return {};
  }

  if (buttonName === "AC") {
    return {
      total: null,
      next: null,
      operation: null,
    };
  }

  if (isNumber(buttonName)) {
    if (buttonName === "0" && obj.next === "0") {
      return {};
    }
    // If there is an operation, update next
    if (obj.operation) {
      if (obj.next) {
        return { next: obj.next + buttonName };
      }
      return { next: buttonName };
    }
    // If there is no operation, update next and clear the value
    if (obj.next) {
      return {
        next: obj.next + buttonName,
        total: null,
      };
    }
    return {
      next: buttonName,
      total: null,
    };
  }

  if (buttonName === ".") {
    if (obj.next) {
      if (obj.next.includes(".")) {
        return {};
      }
      return { next: `${obj.next}.` };
    }
    if (obj.operation) {
      return { next: "0." };
    }
    if (obj.total) {
      if (obj.total.includes(".")) {
        return {};
      }
      return { total: `${obj.next}.` };
    }
    return { total: "0." };
  }

  if (buttonName === "=") {
    if (obj.next && obj.operation) {
      return {
        total: operate(obj.total, obj.next, obj.operation),
        next: null,
        operation: null,
      };
    }
    // '=' with no operation, nothing to do
    return {};
  }

  if (buttonName === "+/-") {
    if (obj.next) {
      return { next: (-1 * parseFloat(obj.next)).toString() };
    }
    if (obj.total) {
      return { total: (-1 * parseFloat(obj.total)).toString() };
    }
    return {};
  }

  // Button must be an operation

  // When the user presses an operation button without having entered
  // a number first, do nothing.
  if (!obj.next && !obj.total) {
    return {};
  }

  // The user hasn't typed a number yet, just save the operation
  if (!obj.next) {
    return { operation: buttonName };
  }

  // User pressed an operation button and there is an existing operation
  if (obj.operation) {
    return {
      total: operate(obj.total, obj.next, obj.operation),
      next: null,
      operation: buttonName,
    };
  }

  // no operation yet, but the user typed one

  // save the operation and shift 'next' into 'total'
  return {
    total: obj.next,
    next: null,
    operation: buttonName,
  };
}

export { isNumber, calculate };
