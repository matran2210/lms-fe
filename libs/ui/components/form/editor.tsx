"use client";
import { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { VALID_UPLOAD_EDITOR } from "@lms/core";
import { SAPPEditorV2 } from "@sapp-fe/sapp-common-package";
import { SAPPEditorHandle } from "@lms/core";
import { useSappEditorImageUpload } from "@lms/hooks";
import { convertMathHtmlToImage } from "@lms/utils";
interface IProps {
  onChange: (event: any) => void;
  valueText?: string;
  className?: string;
  height?: number;
  math?: boolean;
  placeholder?: string;
  getContent?: (e: string) => void;
  acceptFiles?: { type: string; size: number }[];
  disabled?: boolean;
  key?: number | string;
  editorRef?: React.RefObject<SAPPEditorHandle>;
}

const Editor = ({
  onChange,
  valueText,
  className = "",
  height,
  math,
  placeholder,
  getContent,
  acceptFiles = VALID_UPLOAD_EDITOR,
  disabled,
  key,
  editorRef,
}: IProps) => {
  const [editorContent, setEditorContent] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!valueText) {
        setEditorContent(valueText || "");
        return;
      }

      const converted = await convertMathHtmlToImage(valueText);

      if (mounted) {
        setEditorContent(converted);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [valueText]);

  if (editorContent === undefined) return null;
  const { handleImageUpload } = useSappEditorImageUpload()
  return (
    <div key={key}>
      <Spin spinning={loading}>
        <SAPPEditorV2
          ref={editorRef}
          {...(key && { key: key })}
          content={editorContent}
          onChange={onChange}
          handleImageUpload={(file) =>
            handleImageUpload(file, 'lms/library-editor')
          }
          placeholder={placeholder}
          disabled={disabled}
        />
      </Spin>
    </div>
  );
};

export default Editor;
