"use client";

import { Workbook } from "@fortune-sheet/react";
import * as XLSX from "xlsx";
import { useEffect, useMemo, useState } from "react";
import { generateSheetId } from "@lms/core";

type SheetViewerProps = {
  fileUrl?: string;
  fileName?: string;
};

const createEmptySheet = () => ({
  name: "Sheet1",
  id: generateSheetId(),
  status: 1,
  data: [[]],
  celldata: [],
});

const SheetViewer = ({ fileUrl, fileName }: SheetViewerProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [rawData, setRawData] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!fileUrl) {
        setError("Không tìm thấy URL sheet");
        return;
      }
      setLoading(true);
      setError(undefined);
      try {
        const res = await fetch(fileUrl);
        const buffer = await res.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });

        const sheets = workbook.SheetNames.map((sheetName, idx) => {
          const ws = workbook.Sheets[sheetName];
          const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true });
          const data = rows;
          const celldata: any[] = [];

          rows.forEach((row, r) => {
            if (!Array.isArray(row)) return;
            row.forEach((cell, c) => {
              if (cell !== null && cell !== undefined && cell !== "") {
                celldata.push({
                  r,
                  c,
                  v: {
                    v: cell,
                    m: String(cell),
                  },
                });
              }
            });
          });

          return {
            name: sheetName || `Sheet${idx + 1}`,
            id: sheetName || `sheet-${idx + 1}`,
            status: 1,
            data,
            celldata,
          };
        });

        setRawData(sheets.length > 0 ? sheets : [createEmptySheet()]);
      } catch (err) {
        setError("Không thể tải hoặc parse dữ liệu sheet");
        setRawData([createEmptySheet()]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fileUrl]);

  const normalizedData = useMemo(() => {
    const source = rawData && rawData.length > 0 ? rawData : [createEmptySheet()];
    return source.map((sheet) => {
      if (!sheet.celldata || sheet.celldata.length === 0) {
        const celldata: any[] = [];
        if (sheet.data && Array.isArray(sheet.data)) {
          sheet.data.forEach((row: any, r: number) => {
            if (Array.isArray(row)) {
              row.forEach((cell: any, c: number) => {
                if (cell && typeof cell === "object" && cell.v !== undefined) {
                  celldata.push({ r, c, v: cell });
                }
              });
            }
          });
        }
        return { ...sheet, celldata };
      }
      return sheet;
    });
  }, [rawData]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500">
        Đang tải sheet...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  return (
    <Workbook
      key={`${normalizedData.length}-${fileUrl || "sheet-viewer"}`}
      data={normalizedData}
      allowEdit={false}
      showToolbar={false}
      showinfobar={false}
      allowCopy={false}
      enableAddRow={false}
      enableAddCol={false}
    />
  );
};

export default SheetViewer;

