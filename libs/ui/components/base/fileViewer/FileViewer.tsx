"use client";
import { useEffect, useState } from "react";
import { OFFICE_VIEWER_URL } from "@lms/core";
import { downloadFileByURL, isPdfFile } from "@lms/utils";

const MAX_SIZE = 20 * 1024 * 1024;

const FileViewer = ({
  fileName,
  fileUrl,
  onlyView = false,
  onDownload,
}: {
  fileName: string;
  fileUrl: string;
  onlyView?: boolean;
  onDownload?: () => void;
}) => {
  const [shouldDownload, setShouldDownload] = useState(false);

  useEffect(() => {
    const checkSize = async () => {
      try {
        const res = await fetch(fileUrl, { method: "HEAD" });
        const size = res.headers.get("content-length");

        if (size && Number(size) > MAX_SIZE) {
          setShouldDownload(true);
        }
      } catch (err) {}
    };

    checkSize();
  }, [fileUrl]);

  if (shouldDownload) {
    return (
      <span>
        Dung lượng file &quot;{fileName}&quot; quá lớn,&nbsp;
        <span
          className="font-semibold cursor-pointer text-state-info hover:underline"
          onClick={() => onDownload ? onDownload() : downloadFileByURL(fileUrl, fileName)}
        >
          vui lòng click vào đây để tải xuống và xem
        </span>
        .
      </span>
    );
  }

  return (
    <>
      {isPdfFile(fileName) ? (
        <iframe
          src={onlyView ? `${fileUrl}#toolbar=0` : fileUrl}
          className="h-full w-full border-none"
        />
      ) : (
        <iframe
          src={`${OFFICE_VIEWER_URL}?src=${encodeURIComponent(fileUrl)}`}
          className="h-full w-full border-none"
        />
      )}
    </>
  );
};

export default FileViewer;
