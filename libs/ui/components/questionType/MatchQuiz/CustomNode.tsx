"use client";
import React, { useRef, useState, useEffect } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Color } from "./MatchQuiz";
import { Grid, Tooltip } from "antd";

export const CustomNode: React.FC<NodeProps> = ({ data }) => {
  const handleStyle: React.CSSProperties = {
    width: "15px",
    height: "15px",
    background: "#fff",
    border: `2px solid ${data?.edgeColor || Color?.ArrowDefault}`,
    borderRadius: "50%",
  };
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();
  // Ưu tiên bề rộng được truyền từ MatchQuiz (đã co giãn theo container), fallback theo breakpoint
  const NODE_WIDTH = (data?.nodeWidth as number) || (lg ? 328 : 290);

  // Thêm màu border vàng khi được chọn
  const borderColor = data?.isSelected ? "#EF5941" : "none";

  // Truncate + Tooltip logic
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = labelRef.current;
    if (el) {
      setIsTruncated(el.scrollHeight > el.clientHeight + 1); // +1 để tránh lỗi float
    }
  }, [data.label, lg]);

  return (
    <div
      style={{
        color: (data?.color || Color?.TextDefault) as string,
        width: NODE_WIDTH + "px",
        border: `2px solid ${borderColor}`,
        boxSizing: "border-box",
        cursor: data?.onClick ? "pointer" : "default",
      }}
      className={`relative min-h-10 break-words rounded-lg bg-white p-4 text-start text-base shadow-small`}
      onClick={data?.onClick as React.MouseEventHandler<HTMLDivElement>}
    >
      <Tooltip
        title={isTruncated ? (data.label as React.ReactNode) : undefined}
        placement="top"
      >
        <span
          ref={labelRef}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordBreak: "break-word",
            lineHeight: "1.5",
            maxHeight: "3em", // 2 lines * 1.5em
            minHeight: "3em", // fix chiều cao đúng 2 dòng
            height: "3em", // fix luôn height
          }}
        >
          {data.label as string}
        </span>
      </Tooltip>
      {data.role === "question" && (
        <Handle
          type="source"
          position={Position.Right}
          style={handleStyle}
          id="right"
          isConnectable={!data?.isDisabled}
        />
      )}

      {data.role === "answer" && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            ...handleStyle,
            opacity: data.isConnected ? 0 : 1,
          }}
          id="left"
          isConnectable={!data?.isDisabled}
        />
      )}
    </div>
  );
};
