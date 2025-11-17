const displayLogic = (total, next, operation) => {
  let expression = "";
  let result = "0";

  if (total && operation && next) {
    expression = `${total} ${operation} ${next}`;
    result = next;
  } else if (total && operation) {
    expression = `${total} ${operation}`;
    result = total;
  } else if (next) {
    expression = "";
    result = next;
  } else if (total) {
    result = total;
  }

  return { expression, result };
};

export const formatNumberWithDot = (value) => {
  if (!value) return "";

  // Nếu chuỗi không đúng định dạng số (vd: có chữ), trả về nguyên bản
  if (!/^(\d+)(\.\d*)?$/.test(value)) return value;

  const match = value.match(/^(\d+)(\.\d*)?$/);
  if (!match) return value;

  const integerPart = match[1];
  const decimalPart = match[2] || "";

  // Format phần nguyên với dấu phẩy, rồi thay dấu phẩy thành ' ,'
  const formattedInteger = Number(integerPart)
    .toLocaleString("en-US")
    .replace(/,/g, " ,");

  // Trả về phần nguyên + phần thập phân giữ nguyên
  return formattedInteger + decimalPart;
};

// Format biểu thức, thay thế từng số trong chuỗi
export const formatExpression = (expression) => {
  if (!expression) return "";

  return expression.replace(/\d+(\.\d*)?/g, (num) => formatNumberWithDot(num));
};

// Format result
export const formatResult = (value) => {
  if (!value) return "";

  // Nếu value không phải số hợp lệ, trả về nguyên bản
  if (isNaN(Number(value))) return value;

  return formatNumberWithDot(value);
};

export default displayLogic;
