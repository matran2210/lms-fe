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
export const formatDate = (
  dateString: string,
  withoutTime?: boolean,
): string => {
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
  if (withoutTime === true) {
    return `${dayStr}/${monthStr}/${year}`
  }
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

/**
 * Hàm này tính thời gian chênh lệch giữa thời gian hiện tại và một dấu thời gian cho trước,
 * và trả về một chuỗi định dạng người đọc có thể hiểu được, thể hiện khoảng thời gian trước đó.
 * @param {string} date - Dấu thời gian cần so sánh với thời gian hiện tại
 * @return {string} - Một chuỗi đã định dạng thể hiện sự chênh lệch thời gian
 */
export const calculateTimeAgo = (date: string): string => {
  if (!date) {
    return ''
  }

  const currentDateTime: Date = new Date()
  const updatedDateTime: Date = new Date(date)

  const currentUtcTime: number = Date.UTC(
    currentDateTime.getUTCFullYear(),
    currentDateTime.getUTCMonth(),
    currentDateTime.getUTCDate(),
    currentDateTime.getUTCHours(),
    currentDateTime.getUTCMinutes(),
    currentDateTime.getUTCSeconds(),
    currentDateTime.getUTCMilliseconds(),
  )

  const timeDifference: number = currentUtcTime - updatedDateTime.getTime()

  const secondsAgo = Math.floor(timeDifference / 1000)
  if (secondsAgo < 60) {
    return secondsAgo <= 0 ? 'just now' : `${secondsAgo} seconds ago`
  }

  const minutesAgo = Math.floor(secondsAgo / 60)
  if (minutesAgo < 60) {
    return minutesAgo === 1 ? '1 min ago' : `${minutesAgo} mins ago`
  }

  const hoursAgo = Math.floor(minutesAgo / 60)
  if (hoursAgo < 24) {
    return hoursAgo === 1 ? '1 hour ago' : `${hoursAgo} hours ago`
  }

  const daysAgo = Math.floor(hoursAgo / 24)
  if (daysAgo >= 1) {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    })
    return `${formatter.format(updatedDateTime)}`
  }
  return ''
}

/**
 * Hàm debounce giúp trì hoãn thực thi một hàm cho đến khi không có lời gọi mới sau một khoảng thời gian.
 *
 * @template T Loại hàm cần debounce.
 * @param {T} func Hàm cần được debounce.
 * @param {number} delay Thời gian trễ (milliseconds) trước khi hàm được thực thi sau lời gọi cuối cùng.
 * @returns {(...args: Parameters<T>) => void} Hàm debounce đã được tạo ra.
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * @description Return number percent with type: 80.99
 * @param {number} num: number
 * @return {*}
 */
export const percentConversion = (num: number) => {
  return Math.round(num * 10000) / 100
}

/**
 * @description Return number percent with type: 80
 * @param {number} num: number
 * @return {*}
 */
export const roundNumber = (num: number) => {
  return Math.round(num * 100) / 100
}

/**
 * @description Return number mm:ss
 * @param {number} num: number
 * @return {*}
 */
export const convertSecondsToMinutesSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(remainingSeconds).padStart(2, '0')
  return `${formattedMinutes}:${formattedSeconds}`
}

export const convertLocalTimeToUTC = (currentTime: Date) => {
  const offsetMinutes = currentTime.getTimezoneOffset()
  const utcTime = new Date(currentTime.getTime() + offsetMinutes * 60 * 1000)

  return utcTime
}

export const convertUTCToLocalTime = (utc_time: Date | string) => {
  return new Date(utc_time)
}

export const convertHourToDayLeft = (hours: number) => {
  if (hours <= 0) {
    return 0
  }

  const days = Math.ceil(hours / 24)
  return days
}

// formatTime takes a time length in seconds and returns the time in
// minutes and seconds
export const formatTimeToHourMinuteSecond = (timeInSeconds: number) => {
  const hours = Math.floor(timeInSeconds / 3600)
  const minutes = Math.floor((timeInSeconds % 3600) / 60)
  const seconds = Math.floor(timeInSeconds % 60)

  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')

  return {
    hours: formattedHours,
    minutes: formattedMinutes,
    seconds: formattedSeconds,
  }
}

export const getResolution = (bitrate: number) => {
  switch (true) {
    case bitrate <= 135440:
      return '144p'
    case bitrate <= 200792:
      return '240p'
    case bitrate <= 282126:
      return '360p'
    case bitrate <= 400000:
      return '480p'
    case bitrate <= 700000:
      return '720p'
    case bitrate <= 1000000:
      return '900p'
    case bitrate <= 1500000:
      return '1080p'
    case bitrate <= 2000000:
      return '1440p'
    case bitrate <= 3000000:
      return '2k'
    case bitrate <= 4000000:
      return '2k+'
    case bitrate <= 6000000:
      return '4k'
    default:
      return '4k+'
  }
}

export const isAppleDevice = () => {
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform)
}

export const isSafari = () => {
  const userAgent = navigator.userAgent
  const vendor = navigator.vendor
  return (
    /Safari/.test(userAgent) &&
    /Apple Computer/.test(vendor) &&
    !/Chrome/.test(userAgent)
  )
}

export const isMobileOrTablet = () => {
  return /Mobi|Tablet|iPad|iPhone/.test(navigator.userAgent);
}
