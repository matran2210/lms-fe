import React from "react";
import { OFFICE_VIEWER_URL } from "@lms/core";

const FileViewer = ({
  fileName,
  fileUrl,
}: {
  fileName: string;
  fileUrl: string;
}) => {
  const isPdfFile = (fileName: string) => {
    return fileName.toLowerCase().endsWith(".pdf");
  };

  console.log("fileUrl", fileUrl);

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
