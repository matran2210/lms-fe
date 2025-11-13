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
import React, { useCallback, useEffect, useRef, useState } from 'react'

// Định nghĩa kiểu dữ liệu cho các props của CustomFlow
interface CustomFlowProps {
  nodes: Node[]
  edges: Edge[]
  onConnect: OnConnect
  nodeTypes: NodeTypes
  edgeTypes: EdgeTypes
  modalOpen?: boolean
}

const CustomFlow = ({
  nodes,
  edges,
  onConnect,
  nodeTypes,
  edgeTypes,
  modalOpen = true,
}: CustomFlowProps) => {
  const { fitView, setViewport } = useReactFlow()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const fixedViewport = { x: 0, y: 0, zoom: 1 }

  // key để ép ReactFlow re-render lại khi modal mở => cập nhật handle position
  const [flowKey, setFlowKey] = useState(0)

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
    if (modalOpen) {
      const timer = setTimeout(() => {
        setFlowKey((prev) => prev + 1)

        requestAnimationFrame(() => {
          try {
            fitView?.({ padding: 0.2, duration: 300 })
          } catch {}
        })
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [modalOpen, nodes.length, edges.length, fitView])

  useEffect(() => {
    const wr = wrapperRef.current
    if (!wr) return
    const ro = new ResizeObserver(() => {
      setFlowKey((k) => k + 1)
      requestAnimationFrame(() => fitView?.({ padding: 0.2 }))
    })
    ro.observe(wr)
    return () => ro.disconnect()
  }, [fitView])

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
    const wheelHandler = (e: Event) => e.stopPropagation()
    canvas.addEventListener('wheel', wheelHandler, { passive: true })
    return () => canvas.removeEventListener('wheel', wheelHandler)
  }, [])

  return (
    <div
      ref={wrapperRef}
      style={{ height: '100%', width: '100%' }}
      onWheelCapture={(e) => e.stopPropagation()}
    >
      <ReactFlow
        key={flowKey} // 👈 ép remount lại mỗi khi modalOpen thay đổi
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
