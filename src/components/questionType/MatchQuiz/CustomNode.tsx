import React from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'

export const CustomNode: React.FC<NodeProps> = ({ data }) => {
  const handleStyle: React.CSSProperties = {
    width: 10,
    height: 10,
    background: '#fff',
    border: '2px solid black',
    borderRadius: '50%',
  }

  return (
    <div className="relative min-h-10 w-[295px] break-words rounded-lg bg-white p-4 text-start text-base shadow-matchingquiz">
      {data.label as any}
      {data.role === 'question' && (
        <Handle
          type="source"
          position={Position.Right}
          style={handleStyle}
          id="right"
        />
      )}

      {data.role === 'answer' && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            ...handleStyle,
            borderColor: 'black',
            borderWidth: 3,
            opacity: 0,
          }}
          id="left"
        />
      )}
    </div>
  )
}
