export const convertLocalTimeToUTC = (currentTime: Date) => {
  const offsetMinutes = currentTime.getTimezoneOffset();
  const utcTime = new Date(currentTime.getTime() + offsetMinutes * 60 * 1000);

  return utcTime;
};

export const convertUTCToLocalTime = (utc_time: Date | string) => {
  return new Date(utc_time);
};

export const convertHourToDayLeft = (hours: number) => {
  if (hours <= 0) {
    return 0;
  }

  const days = Math.ceil(hours / 24);
  return days;
};
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
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
export const getUserPrefix = (
  isTeacher: boolean,
  pageLink: { [key: string]: string },
) => (isTeacher ? pageLink.TEACHERS : "");

/**
 * @description Return number percent with type: 80
 * @param {number} num: number
 * @return {*}
 */
export const roundNumber = (num: number) => {
  return Math.round(num * 100) / 100;
};

export function formatDateToLongString(isoDateString: string): string {
  if (!isoDateString) return "";
  const date = new Date(isoDateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export * from "./timer";
export * from "./date";
export * from "./quiz-test";
export * from "./ValidateMessage";
