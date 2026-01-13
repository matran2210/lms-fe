import { MenuItem, MenuOption, RouteContext } from "@lms/core";

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
export const isMobileExtensive = () => {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substring(0, 4),
      )
    )
      check = true;
  })(navigator.userAgent || window.opera);
  return check;
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

export function makeMenuLevel(options: MenuOption[], depth = 0): MenuItem[] {
  return options.map((option, idx) => ({
    ...option,
    id: depth === 0 ? idx.toString() : `${depth}.${idx}`,
    depth,
    subItems:
      option.subItems && option.subItems.length > 0
        ? makeMenuLevel(option.subItems, depth + 1)
        : undefined,
  }))
}
export function getRouteContext(pathname: string): RouteContext {
  // Learning flow
  if (/^\/courses\/[^/]+\/(section|activity)/.test(pathname)) {
    return "COURSE_LEARNING";
  }

  // Course management
  if (/^\/courses\/my-course\/[^/]+/.test(pathname)) {
    return "COURSE_MANAGEMENT";
  }

  return "GLOBAL";
}

export function getLearningSubContext(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 4) return "CONTENT";
  if (parts[2] === "section") return "CONTENT";
  if (parts[2] === "activity") return "CONTENT";
  return null;
}

export function getCourseContentSubContext(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);

  // /courses/my-course/:id
  if (parts.length === 3) return "CONTENT";

  // /courses/my-course/:id/dashboard
  if (parts[3] === "dashboard") return "DASHBOARD";

  // /courses/my-course/:id/results
  if (parts[3] === "results") return "RESULTS";

  // /courses/my-course/:id/class-resource
  if (parts[3] === "class-resource") return "CLASS_RESOURCE";

  // /courses/my-course/:id/section/:sectionId
  if (parts[3] === "section") return "CONTENT";

  // /courses/my-course/:id/activity/:activityId
  if (parts[3] === "activity") return "CONTENT";

  return null;
}
export * from "./timer";
export * from "./date";
export * from "./quiz-test";
export * from "./ValidateMessage";
export * from "./tiptap";
export * from "./upload";
export * from "./button";
