import React from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Color } from './MatchQuiz'

export const CustomNode: React.FC<NodeProps> = ({ data }) => {
  const handleStyle: React.CSSProperties = {
    width: '10px',
    height: '10px',
    background: '#fff',
    border: `2px solid ${data?.edgeColor || Color?.ArrowDefault}`,
    borderRadius: '50%',
  }

  return (
    <div
      style={{ color: (data?.color || Color?.TextDefault) as string }}
      className={`relative min-h-10 w-[295px] break-words rounded-lg bg-white p-4 text-start text-base shadow-small`}
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
            opacity: 0,
          }}
          id="left"
          isConnectable={!data?.isDisabled}
        />
      )}
    </div>
  )
}
