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
