// eslint-disable-next-line import/no-unused-modules
export function isMobile() {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ]

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem)
  })
}

/**
 * Hàm này định dạng một chuỗi ngày giờ theo định dạng dd/mm/yyyy hh:mm
 * Ví dụ: 2023-11-01T03:50:32.094Z -> 12/10/2023 11:04
 * @param {string} dateString - Chuỗi ngày giờ đầu vào
 * @return {string} - Chuỗi ngày giờ đã định dạng hoặc - nếu không hợp lệ
 */
export const formatDate = (dateString: string): string => {
  // Kiểm tra nếu dateString không có hoặc không phải date
  if (!dateString || isNaN(Date.parse(dateString))) {
    // Trả về -
    return '-'
  }
  // Tạo một đối tượng Date từ chuỗi đầu vào
  const date = new Date(dateString)
  // Lấy các thành phần ngày, tháng, năm, giờ và phút từ đối tượng Date
  const day = date.getDate()
  const month = date.getMonth() + 1 // Tháng bắt đầu từ 0
  const year = date.getFullYear()
  const hour = date.getHours()
  const minute = date.getMinutes()
  // Định dạng các thành phần thành chuỗi hai chữ số
  const dayStr = day < 10 ? '0' + day : day
  const monthStr = month < 10 ? '0' + month : month
  const hourStr = hour < 10 ? '0' + hour : hour
  const minuteStr = minute < 10 ? '0' + minute : minute
  // Trả về chuỗi định dạng mong muốn
  return `${dayStr}/${monthStr}/${year} ${hourStr}:${minuteStr}`
}

/**
 * Hàm này chuyển đổi một số điện thoại thành định dạng phù hợp với số lượng chữ số
 * Ví dụ: xxxxxxxxxx -> xxxx xxx xxx
 * @param {string} phoneNumber - Số điện thoại đầu vào
 * @return {string} - Số điện thoại đã chuyển đổi hoặc - nếu không hợp lệ
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Kiểm tra nếu phoneNumber không có hoặc không phải số
  if (!phoneNumber || isNaN(Number(phoneNumber))) {
    // Trả về -
    return '-'
  }
  // Loại bỏ các ký tự không phải số từ phoneNumber
  phoneNumber = phoneNumber.replace(/\D/g, '')
  // Cắt chuỗi từ cuối trước 3 số cho 1 group, 2 group 3 số và 1 group x số
  const part1 = phoneNumber.slice(-3) // Lấy 3 ký tự cuối cùng
  const part2 = phoneNumber.slice(-6, -3) // Lấy 3 ký tự trước đó
  const part3 = phoneNumber.slice(0, -6) // Lấy phần còn lại

  // Trả về số điện thoại đã định dạng
  return `${part3} ${part2} ${part1}`
}
