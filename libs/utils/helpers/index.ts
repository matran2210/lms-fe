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
  pageLink?: { [key: string]: string },
) => (isTeacher ? pageLink?.TEACHERS : "");

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
export const isMobileOrTablet = () => {
  return /Mobi|Tablet|iPad|iPhone/.test(navigator.userAgent);
};

export const getResolution = (bitrate: number) => {
  switch (true) {
    case bitrate <= 135440:
      return "144p";
    case bitrate <= 200792:
      return "240p";
    case bitrate <= 282126:
      return "360p";
    case bitrate <= 400000:
      return "480p";
    case bitrate <= 700000:
      return "720p";
    case bitrate <= 1000000:
      return "900p";
    case bitrate <= 1500000:
      return "1080p";
    case bitrate <= 2000000:
      return "1440p";
    case bitrate <= 3000000:
      return "2k";
    case bitrate <= 4000000:
      return "2k+";
    case bitrate <= 6000000:
      return "4k";
    default:
      return "4k+";
  }
};

export const normalizeToArray = (
  value?: string | string[],
): string[] | undefined => {
  if (!value) return undefined;
  return Array.isArray(value) ? value : [value];
};

export const normalizeStringQuery = (value: any) => {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
};

export const cleanArray = (arr?: (string | undefined)[]) =>
  arr?.filter((v): v is string => typeof v === "string");

export * from "./timer";
export * from "./date";
export * from "./quiz-test";
export * from "./ValidateMessage";
export * from "./tiptap";
export * from "./upload";
