import React from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Color } from './MatchQuiz'
import { Grid } from 'antd'

export const CustomNode: React.FC<NodeProps> = ({ data }) => {
  const handleStyle: React.CSSProperties = {
    width: data.role === 'answer' ? '60px' : '15px',
    height: data.role === 'answer' ? '60px' : '15px',
    background: '#fff',
    border: `2px solid ${data?.edgeColor || Color?.ArrowDefault}`,
    borderRadius: '50%',
  }
  const { useBreakpoint } = Grid
  const { lg } = useBreakpoint()
  const NODE_WIDTH = lg ? 328 : 290

  // Thêm màu border vàng khi được chọn
  const borderColor = data?.isSelected ? '#FFB700' : 'none'

  return (
    <div
      style={{
        color: (data?.color || Color?.TextDefault) as string,
        width: NODE_WIDTH + 'px',
        border: `2px solid ${borderColor}`,
        boxSizing: 'border-box',
        cursor: data?.onClick ? 'pointer' : 'default',
      }}
      className={`relative min-h-10 break-words rounded-lg bg-white p-4 text-start text-base shadow-small`}
      onClick={data?.onClick as React.MouseEventHandler<HTMLDivElement>}
    >
      {data.label as any}
      {data.role === 'question' && (
        <Handle
          type="source"
          position={Position.Right}
          style={handleStyle}
          id="right"
          isConnectable={!data?.isDisabled}
        />
      )}

      {data.role === 'answer' && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            ...handleStyle,
            borderWidth: 2,
            left: -5,
            transform: 'translateY(-50%)',
            opacity: 0,
          }}
          id="left"
          isConnectable={!data?.isDisabled}
        />
      )}
    </div>
  )
}
