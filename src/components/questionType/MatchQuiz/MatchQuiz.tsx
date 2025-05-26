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
import UserFlow from './UserFlow'
import { Divider } from 'antd'

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

    const fixedViewport = { x: 0, y: 0, zoom: 1 }

    const onMove = useCallback((event: any, viewport: any) => {
      if (
        viewport.x !== fixedViewport.x ||
        viewport.y !== fixedViewport.y ||
        viewport.zoom !== fixedViewport.zoom
      ) {
      }
    }, [])

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
      const correctNodes: Node[] = []

      for (const item of corrects) {
        const sourceId = item.id
        const targetId = item.answer.id

        const sourceNode = nodeMap.get(sourceId)
        const targetNode = nodeMap.get(targetId)

        if (sourceNode && targetNode) {
          const offsetY = 120 // khoảng cách xuống dưới

          const newSourceNode: Node = {
            ...sourceNode,
            id: `correct-${sourceId}`,
            position: {
              x: sourceNode.position.x,
              y: sourceNode.position.y + offsetY,
            },
            data: {
              ...sourceNode.data,
              isDisabled: true,
              color: Color.Success,
            },
          }

          const newTargetNode: Node = {
            ...targetNode,
            id: `correct-${targetId}`,
            position: {
              x: targetNode.position.x,
              y: targetNode.position.y + offsetY,
            },
            data: {
              ...targetNode.data,
              isDisabled: true,
              color: Color.Success,
            },
          }

          correctNodes.push(newSourceNode, newTargetNode)

          correctEdges.push({
            id: `correct-${sourceId}-${targetId}`,
            source: newSourceNode.id,
            target: newTargetNode.id,
            data: { isCorrect: true },
            style: { stroke: Color.Success },
          })
        }
      }

      return {
        nodes: correctNodes,
        edges: correctEdges,
      }
    }

    useEffect(() => {
      if (!corrects || nodes.length === 0) return

      const { nodes: correctAddNodes, edges: correctAddEdges } =
        generateCorrectFlow(corrects, nodes)

      setCorrectEdges(correctAddEdges)
      setCorrectNodes(correctAddNodes)
    }, [corrects])

    return (
      <>
      <div className="flex h-full w-full flex-col">
        <div
          className={`relative w-full min-w-[700px] bg-gray-100`}
          ref={flowRef}
          style={{
            height: `${(nodes?.length/2 + correctNodes?.length/2 || 1) * 100}px`,
          }}
        >
          <ReactFlowProvider>
            <UserFlow
              nodes={nodes}
              edges={edges}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              />
          </ReactFlowProvider>
              <Divider/>
          <div>Kết quả</div>
          <ReactFlowProvider>
            <UserFlow
              nodes={correctNodes}
              edges={correctEdges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onConnect={onConnect}
          
            />
          </ReactFlowProvider>
        </div>
      </div>

        {solution && (
          <div className="mt-6 bg-gray-4 p-6">
            <SappTitleSolution title={MY_COURSES.explanations} />
            <EditorReader className="mt-4 " text_editor_content={solution} />
          </div>
        )}
      </>
    )
  },
)

MatchQuiz.displayName = 'MatchQuiz'

const MatchQuizWrapper = forwardRef((props: IProps, ref) => {
  return <MatchQuiz {...props} ref={ref} />
})

MatchQuizWrapper.displayName = 'MatchQuizWrapper'

export default MatchQuizWrapper
