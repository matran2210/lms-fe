import { IEntranceTest, IEntranceTestAttempt, Sheet, TEST_TYPE } from "@lms/core";
import dayjs from "dayjs";

export const checkTypeAndRenderTitle = (type: string) => {
  let pageTitle = ''
  switch (type) {
    case TEST_TYPE.MID_TERM_TEST:
      return (pageTitle = 'Midterm Test')
    case TEST_TYPE.FINAL_TEST:
      return (pageTitle = 'Final Test')
    case TEST_TYPE.TOPIC_TEST:
      return (pageTitle = 'Topic Test')
    case TEST_TYPE.CHAPTER_TEST:
      return (pageTitle = 'Chapter Test')
    case TEST_TYPE.PART_TEST:
      return (pageTitle = 'Part Test')
    case TEST_TYPE.ENTRANCE_TEST:
      return (pageTitle = 'Entrance Test')
    case TEST_TYPE.EVENT_TEST:
      return (pageTitle = 'Event Test')
    default:
      return pageTitle
  }
}

const isHtmlEmpty = (s: string) =>
  s.replace(/<[^>]*>/g, "").trim().length === 0;

const isMeaningfulCell = (cell: any): boolean => {
  // Loại null/undefined
  if (cell === null || cell === undefined) return false;

  // Số (kể cả 0) → tính là có dữ liệu nếu không phải NaN
  if (typeof cell === "number") return !Number.isNaN(cell);

  // Boolean → cũng coi là có dữ liệu (người dùng đã nhập/chọn)
  if (typeof cell === "boolean") return true;

  // Chuỗi → khác rỗng/whitespace/HTML rỗng
  if (typeof cell === "string") {
    const trimmed = cell.trim();
    if (trimmed === "") return false;
    return !isHtmlEmpty(trimmed);
  }

  // Một số parser bọc giá trị trong object (vd: { v: 'abc' } hoặc { value: 123 } hoặc { text: '...' })
  if (typeof cell === "object") {
    const wrapped =
      (cell as any).v ?? (cell as any).value ?? (cell as any).text;
    if (wrapped !== undefined) return isMeaningfulCell(wrapped);
    // Nếu là mảng (ít gặp) → có phần tử “có ý nghĩa” là true
    if (Array.isArray(cell)) return cell.some(isMeaningfulCell);
    return false;
  }

  // Các kiểu khác coi như không có dữ liệu
  return false;
};

export const checkSheetAnswered = (data: string | Sheet[]): boolean => {
  try {
    const parsed: Sheet[] = typeof data === "string" ? JSON.parse(data) : data;
    if (!Array.isArray(parsed) || parsed.length === 0) return false;

    for (const sheet of parsed) {
      const grid = sheet?.data;
      if (!Array.isArray(grid)) continue;

      for (let r = 0; r < grid.length; r++) {
        const row = grid[r];
        if (!Array.isArray(row)) continue;

        // Duyệt theo index để cả “ô trống (hole)” cũng được xem là undefined
        for (let c = 0; c < row.length; c++) {
          const cell = row[c];
          if (isMeaningfulCell(cell)) return true;
        }
      }
    }

    return false;
  } catch {
    return false;
  }
};
export const getNoOfAttemptEntranceTest = ({
  data,
  currentAttempt,
}: {
  currentAttempt: IEntranceTestAttempt;
  data: IEntranceTest;
}) => {
  const attemptIndex = data?.attempts?.findIndex(
    (item) => item.id === currentAttempt.id,
  );
  let searchParams = "";
  if (data?.limit_count === 1) {
    searchParams = (attemptIndex ?? -1) > -1 ? `attempt=1/1` : "";
  } else if (data?.attempts?.length === 1) {
    searchParams =
      (attemptIndex ?? -1) > -1 ? `attempt=1/${data?.limit_count}` : "";
  } else {
    searchParams =
      data?.limit_count && (attemptIndex ?? -1) > -1
        ? `attempt=${attemptIndex === 1 ? 1 : 2}/${data?.limit_count}`
        : "";
  }
  return searchParams;
};
const calculateEndTime = (createdAt: Date, quizTimed: number): Date => {
  return dayjs(createdAt).add(quizTimed, "minutes").toDate();
};

export const isQuizExpired = (createdAt: Date, quizTimed: number): boolean => {
  const endTime = calculateEndTime(createdAt, quizTimed);
  return dayjs().isAfter(endTime);
};