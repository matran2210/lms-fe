import Big from 'big.js'

export default function operate(
  numberOne: string | null,
  numberTwo: string | null,
  operation: "+" | "-" | "x" | "÷" | "%" | null,
) {
  const one = Big(numberOne ?? "0");
  const two = Big(numberTwo ?? "0");
  if (operation === "+") {
    return one.plus(two).toString();
  }
  if (operation === "-") {
    return one.minus(two).toString();
  }
  if (operation === "x") {
    return one.times(two).toString();
  }
  try {
    if (operation === "÷") {
      return one.div(two).toString();
    }
  } catch {
    return "Undefined";
  }
  try {
    if (operation === "%") {
      return one.mod(two).toString();
    }
  } catch {
    return "Undefined";
  }
  throw Error(`Unknown operation '${operation}'`);
}
