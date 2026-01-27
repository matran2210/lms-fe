"use client";

import { Workbook } from "@fortune-sheet/react";
import * as XLSX from "xlsx";
import { useEffect, useMemo, useState } from "react";
import { generateSheetId } from "@lms/core";
import { LoadingIcon } from "@lms/assets";

type IProps = {
  fileUrl: string;
  fileName: string;
};

const createEmptySheet = () => ({
  name: "Sheet1",
  id: generateSheetId(),
  status: 1,
  data: [[]],
  celldata: [],
});

const SheetViewer = ({ fileUrl, fileName }: IProps) => {
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(fileUrl);
        const buffer = await res.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });

        const sheets = workbook.SheetNames.map((sheetName, idx) => {
          const ws = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true });
          const data = rows;
          const celldata = [];

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
        setRawData([createEmptySheet()]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <LoadingIcon stroke="#404041" />
    );
  }

  return (
    <Workbook
      key={`${fileName} - sheet-viewer`}
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

