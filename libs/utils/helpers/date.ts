export const formatDateToSlash = (
  dateString: string,
  withoutTime?: boolean,
): string => {
  // Kiểm tra nếu dateString không có hoặc không phải date
  if (!dateString || isNaN(Date.parse(dateString))) {
    // Trả về -
    return "-";
  }
  // Tạo một đối tượng Date từ chuỗi đầu vào
  const date = new Date(dateString);
  // Lấy các thành phần ngày, tháng, năm, giờ và phút từ đối tượng Date
  const day = date.getDate();
  const month = date.getMonth() + 1; // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  // Định dạng các thành phần thành chuỗi hai chữ số
  const dayStr = day < 10 ? "0" + day : day;
  const monthStr = month < 10 ? "0" + month : month;
  const hourStr = hour < 10 ? "0" + hour : hour;
  const minuteStr = minute < 10 ? "0" + minute : minute;
  // Trả về chuỗi định dạng mong muốn
  if (withoutTime === true) {
    return `${dayStr}/${monthStr}/${year}`;
  }
  return `${dayStr}/${monthStr}/${year} ${hourStr}:${minuteStr}`;
};
