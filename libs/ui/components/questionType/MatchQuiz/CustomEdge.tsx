import React from 'react'
import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react'
import { Grid } from 'antd'

function getCustomBezierPath({
  sourceX,
  sourceY,
  targetX,
  targetY,
  curvature = 0.5,
}: {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  curvature?: number
}): string {
  const dx = targetX - sourceX
  const dy = targetY - sourceY
  const cpx1 = sourceX + dx * curvature
  const cpy1 = sourceY
  const cpx2 = targetX - dx * curvature
  const cpy2 = targetY

  return `M ${sourceX},${sourceY} C ${cpx1},${cpy1} ${cpx2},${cpy2} ${targetX},${targetY}`
}

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
}) => {
  const { useBreakpoint } = Grid
  const { lg } = useBreakpoint()

  // Điều chỉnh điểm target nếu cần
  let adjustedTargetX = targetX
  let adjustedTargetY = targetY

  if (targetPosition === 'left') {
    adjustedTargetX = targetX + 3
  }

  const curvature = lg ? 0.5 : 0.8

  const edgePath = getCustomBezierPath({
    sourceX,
    sourceY,
    targetX: adjustedTargetX,
    targetY: adjustedTargetY,
    curvature: curvature,
  })

  const markerId = `arrowhead-${id}`
  const strokeColor = style?.stroke || '#FFB700'

  return (
    <>
      <svg style={{ height: 0, width: 0 }}>
        <defs>
          <marker
            id={markerId}
            markerWidth="10"
            markerHeight="10"
            refX="3.5"
            refY="3.9"
            orient="0"
            markerUnits="strokeWidth"
          >
            <path
              d="M3.604 3.519C3.799 3.715 3.799 4.032 3.604 4.226L0.422 7.409C0.227 7.604 -0.0905 7.604 -0.2855 7.409C-0.481 7.213 -0.481 6.897 -0.2855 6.701L2.543 3.873L-0.2855 1.045C-0.481 0.849 -0.481 0.533 -0.2855 0.337C-0.0905 0.142 0.227 0.142 0.422 0.337L3.604 3.519Z"
              fill={strokeColor}
            />
          </marker>
        </defs>
      </svg>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={`url(#${markerId})`}
        style={{
          stroke: style?.stroke || '#FFB700',
          strokeWidth: 2,
          color: style?.stroke || '#FFB700',
        }}
      />
    </>
  )
}

export default CustomEdge
