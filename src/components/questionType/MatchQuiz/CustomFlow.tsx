import {
  ReactFlow,
  useReactFlow,
  type Edge,
  type Node,
  type OnConnect,
  type NodeTypes,
  type EdgeTypes,
  ConnectionMode,
} from '@xyflow/react'
import React, { useCallback, useEffect, useRef } from 'react'

// Định nghĩa kiểu dữ liệu cho các props của CustomFlow
interface CustomFlowProps {
  nodes: Node[]
  edges: Edge[]
  onConnect: OnConnect
  nodeTypes: NodeTypes
  edgeTypes: EdgeTypes
}

const CustomFlow = ({
  nodes,
  edges,
  onConnect,
  nodeTypes,
  edgeTypes,
}: CustomFlowProps) => {
  const { setViewport } = useReactFlow()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const fixedViewport = { x: 0, y: 0, zoom: 1 }

  const onMove = useCallback((event: any, viewport: any) => {
    if (
      viewport.x !== fixedViewport.x ||
      viewport.y !== fixedViewport.y ||
      viewport.zoom !== fixedViewport.zoom
    ) {
      setViewport(fixedViewport)
    }
  }, [])

  useEffect(() => {
    setViewport(fixedViewport)
  }, [setViewport])

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const canvas = wrapper.querySelector(
      '.react-flow__viewport',
    ) as HTMLElement | null
    if (!canvas) return

    const wheelHandler = (e: Event) => {
      e.stopPropagation()
    }

    canvas.addEventListener('wheel', wheelHandler, { passive: true })

    return () => {
      canvas.removeEventListener('wheel', wheelHandler)
    }
  }, [])

  return (
    <div ref={wrapperRef} style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onMove={onMove}
        onConnect={onConnect}
        fitView={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnScroll={false}
        nodesDraggable={false}
        edgesReconnectable={false}
        minZoom={1}
        maxZoom={1}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Strict}
      />
    </div>
  )
}

export default CustomFlow
