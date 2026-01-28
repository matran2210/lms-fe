"use client";

import { Workbook } from "@fortune-sheet/react";
import * as ExcelJS from "exceljs";
import { useEffect, useMemo, useState } from "react";
import { generateSheetId } from "@lms/core";
import { LoadingIcon } from "@lms/assets";

type IProps = {
  fileUrl: string;
  fileName: string;
  resizeVersion?: number;
};

const DEFAULT_COL_WIDTH = 100;
const DEFAULT_ROW_HEIGHT = 20;

const createEmptySheet = () => ({
  name: "Sheet1",
  id: generateSheetId(),
  status: 1,
  data: [[]],
  celldata: [],
  config: {},
});

/* ================== HELPERS ================== */

const getBorderStyle = (border?: Partial<ExcelJS.Border>) => {
  if (!border || !border.style) return null;

  const styleMap: Record<string, number> = {
    thin: 1,
    medium: 2,
    thick: 3,
    dotted: 4,
    dashed: 5,
    double: 8,
  };

  return {
    style: styleMap[border.style] || 1,
    color: border.color?.argb
      ? `#${border.color.argb.slice(2)}`
      : "#000000",
  };
};

const normalizeMergedRowHeight = (
  merge: any,
  rowlen: Record<number, number>,
  defaultHeight: number,
) => {
  const start = merge.top - 1;
  const end = merge.bottom - 1;
  if (end <= start) return;

  let total = 0;
  for (let r = start; r <= end; r++) {
    total += rowlen[r] ?? defaultHeight;
  }

  rowlen[start] = total;
  for (let r = start + 1; r <= end; r++) {
    rowlen[r] = 0;
  }
};

const applyAlignment = (cell: ExcelJS.Cell, v: any) => {
  const a = cell.alignment;
  if (!a) return;

  v.ht = a.horizontal === "center" ? 0 : a.horizontal === "right" ? 2 : 1;
  v.vt = a.vertical === "middle" ? 0 : a.vertical === "bottom" ? 2 : 1;
  if (a.wrapText) v.tb = 2;
};

const cellHasContent = (cell: ExcelJS.Cell, value: any) => {
  if (value !== null && value !== undefined && value !== "") return true;
  if (cell.fill?.type === "pattern") return true;
  if (cell.font?.bold || cell.font?.italic || cell.font?.color) return true;
  if (
    cell.border?.top ||
    cell.border?.bottom ||
    cell.border?.left ||
    cell.border?.right
  )
    return true;
  return false;
};

/* ================== COMPONENT ================== */

const SheetViewer = ({ fileUrl, fileName, resizeVersion }: IProps) => {
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState<any[] | null>(null);

  useEffect(() => {
    const loadExcel = async () => {
      setLoading(true);
      try {
        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error("Fetch failed");

        const buffer = await res.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        const sheets = workbook.worksheets.map((ws) => {
          const sheetId = ws.name || generateSheetId();
          const celldata: any[] = [];

          const config: any = {
            columnlen: {},
            rowlen: {},
            defaultColWidth: DEFAULT_COL_WIDTH,
            defaultRowHeight: DEFAULT_ROW_HEIGHT,
          };

          const maxRow = ws.rowCount;
          const maxCol = ws.columnCount;

          const data: any[][] = Array.from({ length: maxRow }, () =>
            Array(maxCol).fill(null),
          );

          // Row height
          ws.eachRow({ includeEmpty: true }, (row, rowIndex) => {
            config.rowlen[rowIndex - 1] =
              row.height || DEFAULT_ROW_HEIGHT;
          });

          // Merge normalize
          Object.values(ws._merges || {}).forEach((merge: any) => {
            if (merge.bottom - merge.top + 1 > 1) {
              normalizeMergedRowHeight(
                merge,
                config.rowlen,
                DEFAULT_ROW_HEIGHT,
              );
            }
          });

          // Cells
          ws.eachRow({ includeEmpty: true }, (row, rowIndex) => {
            const r = rowIndex - 1;

            row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
              const c = colIndex - 1;

              if (r === 0) {
                const w = ws.getColumn(colIndex).width;
                config.columnlen[c] = w ? w * 8 : DEFAULT_COL_WIDTH;
              }

              const merge = ws._merges?.[cell.address];
              const isMerged = !!merge;
              const isMaster =
                isMerged &&
                merge.top - 1 === r &&
                merge.left - 1 === c;

              let value: any = null;
              if (!isMerged || isMaster) {
                if (typeof cell.value === "object" && cell.value) {
                  if ("richText" in cell.value)
                    value = cell.value.richText.map((t: any) => t.text).join("");
                  else if ("result" in cell.value) value = cell.value.result;
                } else value = cell.value ?? null;
              }

              data[r][c] = isMerged && !isMaster ? null : value;
              if (isMerged && !isMaster) return;
              if (!cellHasContent(cell, value)) return;

              const v: any = { v: value, m: cell.text || "" };

              if (cell.fill?.type === "pattern") {
                const fg = (cell.fill as ExcelJS.FillPattern).fgColor?.argb;
                if (fg) v.bg = `#${fg.slice(2)}`;
              }

              if (cell.font) {
                if (cell.font.color?.argb)
                  v.fc = `#${cell.font.color.argb.slice(2)}`;
                if (cell.font.bold) v.bl = 1;
                if (cell.font.italic) v.it = 1;
                if (cell.font.underline) v.un = 1;
                if (cell.font.strike) v.cl = 1;
                if (cell.font.size) v.fs = cell.font.size;
                if (cell.font.name) v.ff = cell.font.name;
              }

              applyAlignment(cell, v);

              if (cell.border) {
                const bd: any = {};
                const t = getBorderStyle(cell.border.top);
                const b = getBorderStyle(cell.border.bottom);
                const l = getBorderStyle(cell.border.left);
                const rB = getBorderStyle(cell.border.right);
                if (t) bd.t = t;
                if (b) bd.b = b;
                if (l) bd.l = l;
                if (rB) bd.r = rB;
                if (Object.keys(bd).length) v.bd = bd;
              }

              if (isMaster) {
                v.mc = {
                  r,
                  c,
                  rs: merge.bottom - merge.top + 1,
                  cs: merge.right - merge.left + 1,
                };
              }

              celldata.push({ r, c, v });
            });
          });

          return {
            name: ws.name,
            id: sheetId,
            status: ws.orderNo === 0 ? 1 : 0,
            data,
            celldata,
            config,
          };
        });

        setRawData(sheets.length ? sheets : [createEmptySheet()]);
      } catch (e) {
        setRawData([createEmptySheet()]);
      } finally {
        setLoading(false);
      }
    };

    loadExcel();
  }, [fileUrl]);

  const normalizedData = useMemo(
    () => (rawData?.length ? rawData : [createEmptySheet()]),
    [rawData],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingIcon stroke="#404041" />
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <Workbook
        key={`${fileName}-${resizeVersion ?? 0}`}
        data={normalizedData}
        allowEdit={false}
        showToolbar={false}
      />
    </div>
  );
};

export default SheetViewer;

SheetViewer.displayName = "SheetViewer";