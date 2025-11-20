import { Sheet } from "@lms/core";

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
