"use client";
import { useEffect, useState } from "react";

const TextPreview = ({ url }: { url: string }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;

    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
      })
      .catch(() => {
        setContent("Không thể tải nội dung file TXT");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        Đang tải nội dung...
      </div>
    );
  }

  return (
    <pre className="h-full w-full overflow-auto whitespace-pre-wrap break-words bg-gray-50 p-4 text-sm text-gray-800">
      {content}
    </pre>
  );
};

export default TextPreview;
