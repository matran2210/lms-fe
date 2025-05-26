import React from 'react'
import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react'

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}) => {
  const offset = 8 // khoảng cách mong muốn

  // Tính toán lùi điểm target lại một chút theo hướng nối
  let adjustedTargetX = targetX
  let adjustedTargetY = targetY

  if (targetPosition === 'left') {
    adjustedTargetX = targetX - offset
  }

  const curvature = 0.2

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX: adjustedTargetX,
    targetY: adjustedTargetY,
    targetPosition,
    curvature,
  })
  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd="url(#arrowhead)"
        style={{ stroke: 'black', strokeWidth: 2 }}
      />
    </>
  )
}

export default CustomEdge
