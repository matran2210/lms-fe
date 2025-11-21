/**
 * Format a duration in seconds to HH:mm:ss format.
 * If hours are zero, they are omitted.
 *
 * @param {string | number} input - The input duration in seconds.
 * @returns {string} The formatted time string.
 */
export const formatTimer = (input?: string | number): string => {
  if (input === undefined) {
    return "";
  }

  let seconds: number;
  if (typeof input === "string") {
    seconds = Number(input);
    if (isNaN(seconds)) {
      return "";
    }
  } else {
    seconds = input;
  }

  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const finalSeconds = remainingSeconds % 60;

  const formattedHours = String(hours).padStart(2, "0") + ":";
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(finalSeconds).padStart(2, "0");

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};

/**
 * Convert HTML string to raw text by removing HTML tags and decoding HTML entities.
 *
 * @param {string} html - The input HTML string.
 * @returns {string} The raw text extracted from the HTML.
 */
export const htmlToRaw = (html: string): string => {
  if (!html) {
    return "";
  }
  let result = "";
  let inTag = false;
  for (let i = 0; i < html.length; i++) {
    let char = html[i];
    if (char === "<") {
      inTag = true;
    } else if (char === ">") {
      inTag = false;
    } else if (!inTag) {
      result += char;
    }
  }
  result = result.replace(/&/g, "&");
  result = result.replace(/</g, "<");
  result = result.replace(/>/g, ">");
  result = result.replace(/"/g, '"');
  result = result.replace(/'/g, "'");
  return decodeHtml(result)?.trim();
};

/**
 * Decode HTML entities in a given HTML string.
 *
 * @param {string} html - The input HTML string.
 * @returns {string} The decoded text.
 */
const decodeHtml = (html: string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};
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