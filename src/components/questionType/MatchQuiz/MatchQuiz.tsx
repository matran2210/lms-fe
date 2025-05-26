import EditorReader from '@components/base/editor/EditorReader'
import {
  ConnectionMode,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { SappTitleSolution } from 'src/common/SappTitleSolution'
import { MY_COURSES } from 'src/constants/lang'
import { IExhibitData } from 'src/type/exhibit'
import CustomEdge from './CustomEdge'
import { CustomNode } from './CustomNode'

interface IProps {
  data: any
  action?: any
  handleSaveHighLight?: any
  highlighted?: any
  removeHighlight?: any
  allowHighLight?: boolean
  defaultAnswer?: any
  done?: boolean
  extenalRef?: any
  index?: number
  corrects?: any
  solution?: string
  allowUnHighLight?: boolean
  uuid?: string
  setOpenFile?: (
    data: IExhibitData,
    file?: string | null,
    fileName?: string | null,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void
  isHideExhibit?: boolean
  isAlwaysShowAnswer?: boolean
  exhibitText?: string
}

type Role = 'question' | 'answer'
type MatchNode = Node<{ label: string; role: Role }>

interface RawItem {
  id: string
  label: string
  role: Role
}

interface TransformDataInput {
  questions: RawItem[]
  answers: RawItem[]
  containerWidth?: number
  nodeWidth?: number
}

export enum Color {
  Default = '#000000',
  Success = '#078A4D',
  Error = '#F80903',
}

const MatchQuiz = forwardRef(
  (
    {
      data,
      action,
      handleSaveHighLight,
      highlighted,
      removeHighlight,
      allowHighLight,
      defaultAnswer,
      done,
      extenalRef,
      corrects,
      solution,
      allowUnHighLight,
      uuid,
      setOpenFile,
      isHideExhibit = true,
      isAlwaysShowAnswer = false,
      exhibitText = 'Exhibit',
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    const [edges, setEdges] = useState<Edge[]>([])
    const { setViewport } = useReactFlow()
    const flowRef = useRef<HTMLDivElement>(null)
    const [nodes, setNodes] = useState<MatchNode[]>([])
    const [correctNodes, setCorrectNodes] = useState<Node[]>([])
    const [correctEdges, setCorrectEdges] = useState<Edge[]>([])

    console.log('corrects:', corrects)

    const transformDataToNodes = ({
      questions,
      answers,
      containerWidth = 700,
      nodeWidth = 295,
    }: TransformDataInput): MatchNode[] => {
      const nodes: MatchNode[] = []

      // Create question nodes (left side, x: 0)
      questions.forEach((q, index) => {
        nodes.push({
          id: q.id,
          type: 'custom',
          position: { x: 0, y: index * 100 },
          data: { label: q.label, role: 'question' },
        })
      })

      // Create answer nodes (right side, x: containerWidth - nodeWidth)
      answers.forEach((a, index) => {
        nodes.push({
          id: a.id,
          type: 'custom',
          position: { x: containerWidth - nodeWidth, y: index * 100 },
          data: { label: a.label, role: 'answer' },
        })
      })

      return nodes
    }

    useEffect(() => {
      // Transform question_matchings into questions and answers
      const questions: RawItem[] = data.question_matchings.map((item: any) => ({
        id: item.id,
        label: item.content,
        role: 'question' as Role,
        color: Color.Default, // Mặc định màu đen, có thể thay đổi sau
      }))

      const answers: RawItem[] = data.question_matchings.map((item: any) => ({
        id: item.answer.id,
        label: item.answer.answer,
        role: 'answer' as Role,
        color: Color.Default, // Mặc định màu đen, có thể thay đổi sau
      }))

      const transformed = transformDataToNodes({
        questions,
        answers,
        containerWidth: flowRef.current?.clientWidth || 700,
        nodeWidth: 295,
      })
      setNodes(transformed)
    }, [data])

    const nodeTypes = {
      custom: CustomNode,
    }

    const edgeTypes = {
      custom: CustomEdge,
    }

    const nodeTypeCorrect = {
      custom: CustomNode,}

    const edgeTypeCorrect = {
      custom: CustomEdge,
    }

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

    useReactFlow().setViewport(fixedViewport)

    const onConnect = useCallback((connection: Connection) => {
      setEdges((prev) => {
        // Xoá edge cũ có cùng target
        const filtered = prev.filter(
          (e) =>
            e.target !== connection.target && e.source !== connection.source,
        )

        // Thêm edge mới
        return addEdge({ ...connection, type: 'custom' }, filtered)
      })
    }, [])

    useEffect(() => {
      if (!corrects) return

      const correctMap = new Map(
        corrects.map((item: any) => [item.id, item.answer.id]),
      )

      const connectedIds = new Set<string>()
      const edgeColors = new Map<string, string>()

      if (edges?.length > 0) {
        const updatedEdges = edges.map((edge) => {
          const isCorrect = correctMap.get(edge.source) === edge.target

          connectedIds.add(edge.source)
          connectedIds.add(edge.target)

          edgeColors.set(edge.source, isCorrect ? Color.Success : Color.Error)
          edgeColors.set(edge.target, isCorrect ? Color.Success : Color.Error)

          return {
            ...edge,
            data: {
              ...edge.data,
              isCorrect,
            },
            style: {
              stroke: isCorrect ? Color.Success : Color.Error,
            },
          }
        })

        setEdges(updatedEdges)
      }

      // Đánh dấu đỏ cho các node đúng nhưng chưa nối
      for (const item of corrects) {
        const questionId = item.id
        const answerId = item.answer.id

        if (!connectedIds.has(questionId)) {
          edgeColors.set(questionId, Color.Error)
        }
        if (!connectedIds.has(answerId)) {
          edgeColors.set(answerId, Color.Error)
        }
      }

      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.data?.role && edgeColors.has(node.id)) {
            return {
              ...node,
              data: {
                ...node.data,
                color: edgeColors.get(node.id) || 'black',
                isDisabled: !!corrects,
              },
            }
          }
          return node
        }),
      )
    }, [corrects])

    const generateCorrectFlow = (corrects: any[], allNodes: Node[]) => {
      const nodeMap = new Map(allNodes.map((n) => [n.id, n]))
      const correctEdges: Edge[] = []
      const correctNodes = new Map<string, Node>()

      for (const item of corrects) {
        const sourceId = item.id
        const targetId = item.answer.id

        correctEdges.push({
          id: `correct-${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          data: { isCorrect: true },
          style: { stroke: Color.Success }, // xanh
        })

        const sourceNode = nodeMap.get(sourceId)
        const targetNode = nodeMap.get(targetId)

        if (sourceNode) {
          correctNodes.set(sourceId, {
            ...sourceNode,
            data: {
              ...sourceNode.data,
              color: Color.Success,
              isDisabled: true,
            },
          })
        }

        if (targetNode) {
          correctNodes.set(targetId, {
            ...targetNode,
            data: {
              ...targetNode.data,
              color: Color.Success,
              isDisabled: true,
            },
          })
        }
      }

      return {
        nodes: Array.from(correctNodes.values()),
        edges: correctEdges,
      }
    }

    useEffect(() => {
      if (!corrects || nodes.length === 0) return

      const { nodes: correctNodes, edges: correctEdges } = generateCorrectFlow(
        corrects,
        nodes,
      )
      setCorrectNodes(correctNodes)
      setCorrectEdges(correctEdges)
    }, [corrects, nodes])

    return (
      <div className="flex h-full w-full flex-col">
        <div
          className={`relative w-full min-w-[700px] bg-gray-100`}
          ref={flowRef}
          style={{
            height: `${(data?.question_matchings?.length || 1) * 100}px`,
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onMove={onMove}
            onConnect={onConnect}
            fitView={false} // không auto-fit khi render
            panOnDrag={false} // không cho kéo canvas
            zoomOnScroll={false} // không cho zoom bằng cuộn chuột
            zoomOnPinch={false} // không zoom bằng pinch
            panOnScroll={false} // không pan bằng scroll
            nodesDraggable={false} // không cho kéo node
            edgesReconnectable={false} // không cho kéo lại edge
            minZoom={1} // khoá mức zoom
            maxZoom={1}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            connectionMode={ConnectionMode.Strict} // để bắt buộc kết nối đúng handle
          />
          <div>Kết quả</div>
          <ReactFlow
            nodes={correctNodes}
            edges={correctEdges}
            nodeTypes={nodeTypeCorrect}
            edgeTypes={edgeTypeCorrect}
            fitView={false}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            panOnScroll={false}
            nodesDraggable={false}
            edgesReconnectable={false}
            minZoom={1}
            maxZoom={1}
            connectionMode={ConnectionMode.Strict}
          />
        </div>
        {solution && (
          <div className="mt-6 bg-gray-4 p-6">
            <SappTitleSolution title={MY_COURSES.explanations} />
            <EditorReader className="mt-4 " text_editor_content={solution} />
          </div>
        )}
      </div>
    )
  },
)

MatchQuiz.displayName = 'MatchQuiz'

const MatchQuizWrapper = forwardRef((props: IProps, ref) => {
  return (
    <ReactFlowProvider>
      <MatchQuiz {...props} ref={ref} />
    </ReactFlowProvider>
  )
})

MatchQuizWrapper.displayName = 'MatchQuizWrapper'

export default MatchQuizWrapper
