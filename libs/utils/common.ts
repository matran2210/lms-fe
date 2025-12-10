
import DOMPurify from "dompurify";
import { isEmpty, isNull, isUndefined } from "lodash";
import { useQuery } from "react-query";
import dayjs, { Dayjs } from "dayjs";
import { DATE_FORMAT, DAYS_IN_WEEK, GRADE_STATUS } from '@lms/core';
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import { deserializeHighlights, doHighlight, optionsImpl, removeHighlights, serializeHighlights } from "@funktechno/texthighlighter/lib";

dayjs.extend(utc);
dayjs.extend(weekday);

export const formatDate = (
  date: Dayjs | Date | string,
  formatStr: string = "DD/MM/YYYY",
) => {
  return dayjs(date).format(formatStr);
};

export const formatTime = (
  date: Dayjs | Date | string,
  formatStr: string = "HH:mm",
) => {
  return dayjs(date).format(formatStr);
};

export const cleanParams = <T extends Record<string, any>>(
  params: T,
): {
  [K in keyof T]: NonNullable<T[K]>;
} => {
  const result: any = {};
  for (const [key, value] of Object.entries(params)) {
    if (
      ![null, undefined, ""].includes(value) ||
      (Array.isArray(value) && value.length)
    ) {
      result[key] = value;
    }
  }
  return result;
};

/**
 * Returns the index of the weekday for a given date, adjusted for UTC.
 *
 * @param {Date} startDate - The date for which the weekday index is calculated.
 * @param {boolean} isUTC - Whether to use UTC time.
 * @returns {number} - The index of the weekday, where 0 is Monday and 6 is Sunday.
 */
export const getDayIndex = (startDate: Date, isUTC = true) => {
  const day = isUTC ? dayjs(startDate).utc().day() : dayjs(startDate).day();

  return (day + DAYS_IN_WEEK - 1) % DAYS_IN_WEEK;
};

export const reverseDaysOfWeek = (startDate: Date, daysOfWeek: number[]) => {
  const dayOfWeek = getDayIndex(startDate) + 1; // Convert start day of week from 0 to 1
  const dayIndex = daysOfWeek.indexOf(dayOfWeek);
  return [...daysOfWeek.slice(dayIndex), ...daysOfWeek.slice(0, dayIndex)];
};

export const convertLocalWeekDaysToUTC = (
  startDate: Date,
  localDaysOfWeek: number[],
) => {
  // start of week with startDate hour and minute
  const startOfWeek = dayjs(startDate)
    .startOf("week")
    .hour(startDate.getHours())
    .minute(startDate.getMinutes());

  return localDaysOfWeek.map(
    (num) => getDayIndex(startOfWeek.add(num, "day").toDate()) + 1,
  ); // Convert start day of week from 0 to 1
};

/**
 *
 * @param date - Don't use formatDateTimeWithTimeZone(new Date('DD/MM/YYYY'), 'HH:mm') instead of formatDateTimeWithTimeZone('DD/MM/YYYY', 'HH:mm')
 * @param time
 * @returns
 */
export const formatDateTimeWithTimeZone = (
  date: Date | string | undefined,
  time: string,
): Date => {
  if (typeof date === "string") {
    return new Date(`${date}T${time}Z`);
  }

  const startDayjs = dayjs(date).startOf("day");
  const formattedDate = startDayjs.format("YYYY-MM-DD");
  const tmpStartDate = dayjs(formattedDate + "T" + time + "Z");
  return startDayjs
    .set("hour", tmpStartDate.get("hour")) // Avoid time has UTC issue
    .set("minute", tmpStartDate.get("minute"))
    .toDate();
};

export const buildQueryString = (params: Object) => {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== "" && value !== undefined) // Exclude empty parameters
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

  return queryParams ? `&${queryParams}` : "";
};

export const handleReplaceText = (html: string = "") => {
  if (!html) return "";
  // Thay tất cả font-size
  html = html.replace(/font-size:\s*[^;"]+/gi, "font-size: 16px");

  // Thay tất cả color
  html = html.replace(/color:\s*[^;"]+/gi, "color: white");

  // Thay tất cả font-weight
  html = html.replace(/font-weight:\s*[^;"]+/gi, "font-weight: normal");
  return html;
};

export function convertSlugToTitle(slug: string): string {
  if (!slug) return "";

  return slug
    .replace(/-/g, " ") // thay dấu - thành dấu cách
    .replace(/\s+/g, " ") // gộp các khoảng trắng thừa
    .trim() // xoá khoảng trắng 2 đầu
    .split(" ") // tách từ
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // viết hoa chữ cái đầu
    .join(" "); // ghép lại
}
export const getLocalStorgeActToken = (): string => {
  return "";
};

export const getLocalStorgeRefreshToken = (): string => {
  return localStorage.getItem("refreshToken") || "";
};

export function truncateString(str: string, maxLength: number) {
  if (str?.length <= maxLength) {
    return str;
  } else {
    return str?.slice(0, maxLength) + " ..."; // Add ellipsis to indicate truncation
  }
}
export function runHighlight(
  handleSaveHighLight: any,
  allowHighLight: boolean,
  elementID = "hightlight_area",
  options?: optionsImpl,
) {
  // run mobile a bit
  const domEle = document.getElementById(elementID);

  if (domEle && allowHighLight) {
    doHighlight(domEle, false, options);
    handleSaveHighLight(serializeHighlights(domEle));
  }
}

export function DeserializeHighlight(
  highlighted: any,
  elementID = "hightlight_area",
) {
  const domEle = document.getElementById(elementID);
  removeHighlights(domEle as any);
  deserializeHighlights(domEle as any, highlighted);
}

export const formatTimeMinToHhMm = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const formattedHours = hours > 0 ? `${hours}h` : "";
  const formattedMinutes = remainingMinutes > 0 ? `${remainingMinutes}m` : "";

  return formattedHours + formattedMinutes || "0h0m";
};

/**
 * Convert millisecond/seconds to readable hh:mm:ss
 *
 * @param   totalTime  time in milliseconds/seconds
 * @param   unit       'milliseconds'(default) | 'seconds'
 * @returns hh:mm:ss
 */
export const getTimeFromInput = (
  totalTime: number,
  unit: "milliseconds" | "seconds" = "milliseconds",
) => {
  if (totalTime || totalTime === 0) {
    let totalSeconds;

    if (unit === "milliseconds") {
      totalSeconds = Math.floor(totalTime / 1000);
    } else {
      totalSeconds = totalTime;
    }

    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);

    const formattedHours =
      totalHours > 0 ? ("0" + totalHours).slice(-2) + ":" : "";
    const formattedMinutes = ("0" + (totalMinutes % 60)).slice(-2);
    const formattedSeconds = ("0" + (totalSeconds % 60)).slice(-2);

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
  }
  return "-";
};

export const countWords = (text: string) => {
  const words = text.trim().split(/\s+/);
  return words.length;
};

export const convertSnakeCaseToHumanReadable = (str: string) => {
  if (!str || str.trim() === "") return "-";

  const words = str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  if (words.length === 0) return "-";

  return words.join(" ");
};

export const convertHumanReadableToSnakeCase = (str: string) => {
  if (!str || str.trim() === "") return "";

  const words = str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  return words.join("_");
};

// Chuyển bytes thành đơn vị phù hợp: < 1MB -> Kb, < 1GB -> Mb, còn lại -> Gb
export const formatBytes = (bytes: number) => {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (bytes >= GB) return `${(bytes / GB).toFixed(2)}Gb`;
  if (bytes >= MB) return `${(bytes / MB).toFixed(2)}Mb`;
  return `${(bytes / KB).toFixed(2)}Kb`;
};

export const cleanParamsAPI = (params: Object) => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null && value !== "",
    ),
  );
};

export const buildOneChoiceQueryString = (params: Object) => {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== "" && value !== undefined) // Exclude empty parameters
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

  return queryParams ? `${queryParams}` : "";
};

export const parseHTMLToString = (htmlContent: string) => {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = DOMPurify.sanitize(htmlContent);
  return tempElement.textContent || tempElement.innerText;
};

// Hàm thay thế style text-align: center thành style text-align: -webkit-center trong chuỗi HTML
export const replaceTextAlignCenterToWebKitCenter = (htmlString: string) => {
  // Sử dụng biểu thức chính quy để thay thế
  return htmlString.replace(
    /text-align:\s*center/g,
    "text-align: -webkit-center",
  );
};
// Hàm thay thế style white-space: pre-wrap thành style white-space: normal trong chuỗi HTML
export const replaceWhiteSpacePreWrapToNormal = (htmlString: string) => {
  // Sử dụng biểu thức chính quy để thay thế
  return htmlString.replace(/white-space:\s*pre-wrap/g, "white-space: normal");
};
export const useGetData = (
  queryKey: string,
  params: Object,
  fetchData: any,
) => {
  return useQuery([queryKey, params], () => fetchData(params), {
    retry: false,
  });
};

export const useGetDataQuery = (
  queryKey: string,
  params: Object,
  fetchFunction: () => Promise<any>,
  enabled?: boolean,
  onError?: ((err: unknown) => void) | undefined,
) => {
  const fetchData = async () => {
    const { data } = await fetchFunction();
    return data;
  };

  return useQuery([queryKey, params], fetchData, {
    enabled: enabled,
    onError: onError,
    retry: false,
  });
};

export const convertFractionToPercentage = (fraction: string) => {
  const [numerator, denominator] = fraction.split("/").map(Number);
  if (denominator === 0) return 0; // Tránh chia cho 0
  const percentage = (numerator / denominator) * 100;
  return percentage;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  // @ts-ignore: Unreachable code error
  window.gtag(
    "config",
    `${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}` as string,
    {
      page_path: url,
    },
  );
};

/**
 * @description function này để link social
 */
export const onLinkSocial = (link: string) => {
  window.open(link, "_blank");
};

export const getUppercaseByNumber = (num: number): string => {
  let result = "";
  while (num > 0) {
    let remainder = num % 26;
    if (remainder === 0) {
      remainder = 26;
      num--;
    }
    let char = String.fromCharCode(remainder + 64);
    result = char + result;
    num = Math.floor(num / 26);
  }
  return result;
};

export const removeLocalStorageItem = (item: string) => {
  localStorage.removeItem(item);
};

export const getLocalStorageItem = (name: string) => {
  return localStorage.getItem(name) || "";
};

export const setLocalStorageItem = (name: string, value: string) => {
  localStorage.setItem(name, value);
};

export const removeStyleAttributes = (htmlString?: string) => {
  if (!htmlString) return;
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const elementsWithStyle = doc.querySelectorAll("[style]");
  elementsWithStyle.forEach((element) => {
    element.removeAttribute("style");
  });
  return doc.body.innerHTML;
};

export const capitalizeFirstLetter = (str?: string) => {
  if (!str) return;
  str = str?.toLocaleLowerCase();
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const truncateBySpace = (
  text: string,
  maxWords: number,
  isSlash: boolean = false,
): string => {
  if (isEmpty(text) || isUndefined(text) || isNull(text)) return "";
  const words = text?.split(" ");
  if (words?.length <= maxWords) {
    return text + (isSlash ? " /" : "");
  }
  return words?.slice(0, maxWords).join(" ") + `...${isSlash ? "/" : ""}`;
};

export const truncateTextOnly = (htmlString: string, limit: number) => {
  if (isEmpty(htmlString) || isUndefined(htmlString) || isNull(htmlString))
    return;
  const div = document.createElement("div");
  div.innerHTML = htmlString;

  let totalTextLength = 0;
  let truncatedText = "";
  let lastSpacePosition = -1;
  function walkNodes(node: any) {
    if (totalTextLength >= limit) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      for (let i = 0; i < text.length; i++) {
        if (totalTextLength >= limit) break;
        truncatedText += text[i];
        totalTextLength++;
        if (text[i] === " ") {
          lastSpacePosition = truncatedText.length;
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      truncatedText += `<${node.nodeName.toLowerCase()}>`;
      for (let i = 0; i < node.childNodes.length; i++) {
        walkNodes(node.childNodes[i]);
        if (totalTextLength >= limit) break;
      }
      truncatedText += `</${node.nodeName.toLowerCase()}>`;
    }
  }
  walkNodes(div);
  if (lastSpacePosition !== -1) {
    truncatedText = truncatedText.substring(0, lastSpacePosition) + "...";
  }
  return truncatedText;
};

export const truncateHTML = (limit: number, html?: string) => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  let wordCount = 0;
  function traverse(node: any): string {
    const nodeType = node.nodeType;

    if (wordCount >= limit) {
      return "";
    }

    if (nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      const words = text.split(/(\s+)/);
      let truncatedText = "";
      for (let i = 0; i < words.length && wordCount < limit; i++) {
        if (/\S/.test(words[i])) {
          truncatedText += words[i];
          wordCount++;
        } else {
          truncatedText += words[i];
        }
      }

      return truncatedText + (wordCount >= limit ? "..." : "");
    } else if (nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      const attributes = Array.from(node.attributes)
        .map((attr: any) => `${attr.name}="${attr.value}"`)
        .join(" ");

      const openTag = `<${tagName}${attributes ? " " + attributes : ""}>`;
      const closeTag = `</${tagName}>`;

      const childNodes = Array.from(node.childNodes);
      let innerHTML = "";
      childNodes.forEach((child: any) => {
        if (wordCount < limit) {
          const childContent = traverse(child);
          if (
            child?.nodeType === Node.ELEMENT_NODE &&
            innerHTML &&
            !/\s$/.test(innerHTML)
          ) {
            innerHTML += " " + childContent;
          } else {
            innerHTML += childContent;
          }
        }
      });
      return `${openTag}${innerHTML}${closeTag}`;
    }
    return "";
  }
  return traverse(div);
};

export const removeHtmlTags = (htmlString?: string) => {
  if (!htmlString) return "";
  return htmlString.replace(/<[^>]*>/g, ""); // Xóa tất cả thẻ HTML
};

/**
 * @description Chuyển đổi một chuỗi ngày thành chuỗi ngày được định dạng.
 * @param {string} date - Chuỗi ngày cần chuyển đổi.
 * @param {string} [format='DD/MM/YYYY'] - Định dạng của chuỗi ngày trả về.
 * @return {string} - Chuỗi ngày đã được định dạng.
 */
export const sappFormatDate = (date?: string, format = "DD/MM/YYYY") =>
  date ? dayjs(date).format(format) : undefined;

/**
 * @description Chuyển đổi một chuỗi ngày UTC thành chuỗi ngày địa phương được định dạng.
 * @param {string} date - Chuỗi ngày UTC cần chuyển đổi.
 * @param {string} [format='DD/MM/YYYY'] - Định dạng của chuỗi ngày địa phương trả về.
 * @return {string} - Chuỗi ngày địa phương đã được định dạng.
 */
export const formatDateFromUTC = (date: string, format = DATE_FORMAT.DATE) => {
  if (date && dayjs.utc(date).isValid()) {
    return dayjs.utc(date).local().format(format);
  }
  return "-";
};

/**
 * Trả về chuỗi thời gian biểu diễn khoảng thời gian từ lúc bắt đầu đến lúc kết thúc.
 *
 * @param started_at - Thời gian bắt đầu (UTC dạng string, ví dụ: '2025-06-27T03:00:00Z')
 * @param finished_at - Thời gian kết thúc (UTC dạng string)
 * @returns Chuỗi dạng "start - end", hoặc "-" nếu không có dữ liệu
 *
 * @example
 * getDuration('2025-06-26T03:00:00Z', '2025-06-27T05:00:00Z')
 * // 👉 "26/06/2025 - 27/06/2025"
 *
 * getDuration('', '')
 * // 👉 "-"
 */
export const getDuration = (started_at: string, finished_at: string) => {
  const start = started_at ? formatDateFromUTC(started_at) : "";
  const end = finished_at ? formatDateFromUTC(finished_at) : "";
  const duration = [start, end].filter(Boolean).join(" - ") || "-";
  return duration;
};

/**
 * @description Chuyển đổi giá trị enum của loại bài kiểm tra thành chuỗi dễ đọc.
 * @param {string} quizType - Giá trị enum của loại bài kiểm tra.
 * @return {string} - Chuỗi mô tả loại bài kiểm tra dễ đọc.
 */
export const convertQuizType = (quizType: string) => {
  return quizType
    .split("_")
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(" ");
};

export const containsKeyword = (input: unknown, keyword?: string): boolean => {
  if (typeof input !== "string") return false;
  return input.includes(keyword ?? "data-time=");
};

/**
 * @description Chuyển đổi chuỗi HTML chứa thẻ <strong> với thuộc tính data-time thành định dạng ngày tháng có thể đọc được.
 * @param {string} input - Chuỗi HTML đầu vào.
 * @return {string} - Chuỗi HTML đã được định dạng lại với ngày tháng hiển thị theo định dạng DD/MM/YYYY.
 */

export const formatNotificationHTML = (input: string): string => {
  return input.replace(
    /<strong\s+data-time\s*=\s*["']([^"']+)["']\s*><\/strong>/g,
    (match, dateTime) => {
      const formattedDate = dayjs
        .utc(dateTime)
        .local()
        .format(DATE_FORMAT.DATE);
      return `<strong>${formattedDate}</strong>`;
    },
  );
};

export const clearStylesHtml = (htmlContent: string) => {
  if (htmlContent) {
    // Loại bỏ các thẻ <style> và thuộc tính style inline
    return htmlContent
      .replace(/<style.*?>.*?<\/style>/gi, "") // Xóa các thẻ style
      .replace(/\sstyle=".*?"/gi, ""); // Xóa các thuộc tính inline style
  }
  return "";
};

export function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export function getCookie(name: string): string | null {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1] || null
  );
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

function parseJwt<T extends object = Record<string, unknown>>(
  token: string,
): T | null {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload); // decode base64
    return JSON.parse(payload) as T;
  } catch (error) {
    return null;
  }
}

export function getSessionIdFromToken(token: string): string | null {
  const decoded = parseJwt(token);
  return typeof decoded?.session_state === "string"
    ? decoded.session_state
    : null;
}

export function convertMinutesToHourFormat(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const hourStr = hrs > 0 ? `${hrs} hour${hrs > 1 ? "s" : ""}` : "";
  const minStr = mins > 0 ? `${mins} min${mins > 1 ? "s" : ""}` : "";

  if (hourStr && minStr) return `${hourStr} ${minStr}`;
  return hourStr || minStr || "0 min";
}

export const formatPathWithQueryParams = (
  pathname: string,
  params: Record<string, string>,
): string => {
  const cleanedParams = cleanParams(params);
  const queryString = new URLSearchParams(cleanedParams).toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
};

export const isEmptyParagraph = (html: string) => {
  // Loại bỏ thẻ <p> và </p>
  const content = html.replace(/<\/?p>/g, "");

  // Decode &nbsp; thành ký tự U+00A0
  const normalized = content.replace(/&nbsp;/g, "\u00A0");

  // Trim cả space thường và nbsp
  const cleaned = normalized.replace(/[\s\u00A0]+/g, "");

  return cleaned.length === 0;
};

export const getGradingStatusLabel = (status: string) => {
  switch (status) {
    case GRADE_STATUS.AWAITING_GRADING:
      return "Awaiting Grading";
    case GRADE_STATUS.FINISHED_GRADING:
      return "Finished Grading";
    case GRADE_STATUS.IN_REVIEW:
      return "In Review";
    default:
      return "Awaiting Grading";
  }
};
