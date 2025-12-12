import React, { useEffect, useState } from "react";
import { OFFICE_VIEWER_URL } from "@lms/core";
import { isPdfFile } from "@lms/utils";

const MAX_SIZE = 20 * 1024 * 1024;

const FileViewer = ({
  fileName,
  fileUrl,
}: {
  fileName: string;
  fileUrl: string;
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
    window.location.href = fileUrl;

    return (
      <div className="p-4">File lớn hơn 20MB. Vui lòng tải xuống để xem.</div>
    );
  }

  return (
    <>
      {isPdfFile(fileName) ? (
        <iframe src={fileUrl} className="h-full w-full border-none" />
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
