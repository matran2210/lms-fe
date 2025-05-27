import {
  ReactFlow,
  useReactFlow,
  type Edge,
  type Node,
  type OnConnect,
  type OnMove,
  type NodeTypes,
  type EdgeTypes,
  ConnectionMode,
} from "@xyflow/react";
import { useCallback, useEffect } from "react";

// Định nghĩa kiểu dữ liệu cho các props của CustomFlow
interface CustomFlowProps {
  nodes: Node[];
  edges: Edge[];
  onConnect: OnConnect;
  nodeTypes: NodeTypes;
  edgeTypes: EdgeTypes;
}

const CustomFlow = ({ nodes, edges, onConnect, nodeTypes, edgeTypes }: CustomFlowProps) => {
  const { setViewport } = useReactFlow();

      const fixedViewport = { x: 0, y: 0, zoom: 1 }

          const onMove = useCallback((event: any, viewport: any) => {
      if (
        viewport.x !== fixedViewport.x ||
        viewport.y !== fixedViewport.y ||
        viewport.zoom !== fixedViewport.zoom
      ) {
        setViewport(fixedViewport) // reset lại viewport ngay lập tức
      }
    }, [])


  useEffect(() => {
    setViewport(fixedViewport);
  }, [setViewport]);

  return (
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
  );
};

export default CustomFlow;