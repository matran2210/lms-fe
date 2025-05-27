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
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { SappTitleSolution } from 'src/common/SappTitleSolution'
import { MY_COURSES } from 'src/constants/lang'
import { IExhibitData } from 'src/type/exhibit'
import CustomEdge from './CustomEdge'
import { CustomNode } from './CustomNode'
import CustomFlow from './CustomFlow'
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
    const [key, setKey] = useState(1)

    const getMatchedPairs = (edges: Edge[], nodes: MatchNode[]) => {
      const nodeMap = new Map(nodes.map((n) => [n.id, n]))

      return edges
        .map((edge) => {
          const sourceNode = nodeMap.get(edge.source)
          const targetNode = nodeMap.get(edge.target)

          if (!sourceNode || !targetNode) return null

          // Đảm bảo phân biệt đúng role giữa question và answer
          const isSourceQuestion = sourceNode.data.role === 'question'

          return {
            questionId: isSourceQuestion ? sourceNode.id : targetNode.id,
            answerId: isSourceQuestion ? targetNode.id : sourceNode.id,
          }
        })
        .filter(Boolean)
    }

    useImperativeHandle(ref, () => ({
      handleReset() {
        setKey((prev) => {
          const newKey = prev + 1
          return newKey
        })
      },
      getMatchedPairs: () => getMatchedPairs(edges, nodes),
    }))

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
      if (!defaultAnswer || defaultAnswer.length === 0) return

      const hasCorrects = corrects && corrects.length > 0

      const newEdges: Edge[] = defaultAnswer.map((pair: any) => {
        const oldEdge = edges.find(
          (e) => e.source === pair.questionId && e.target === pair.answerId,
        )

        // Nếu có corrects thì đổi màu theo đúng/sai, không thì mặc định màu đen
        const isCorrect = hasCorrects
          ? corrects.some(
              (c: any) =>
                String(c?.id) === String(pair.questionId) &&
                String(c?.answer?.id) === String(pair.answerId),
            )
          : false

        return {
          id: `edge-${pair.questionId}-${pair.answerId}`,
          source: pair.questionId,
          target: pair.answerId,
          type: 'custom',
          data: {
            ...(oldEdge ? oldEdge.data : {}),
            color: hasCorrects
              ? isCorrect
                ? Color.Success
                : Color.Error
              : 'black', // màu đen khi chưa có corrects
          },
          style: {
            stroke: hasCorrects
              ? isCorrect
                ? Color.Success
                : Color.Error
              : 'black', // màu viền edge
          },
        }
      })

      setEdges(newEdges)
    }, [defaultAnswer, corrects])

    useEffect(() => {
      if (!nodes.length) return

      const hasCorrects = corrects && corrects.length > 0
      if (!hasCorrects) {
        // Khi chưa có corrects: tất cả node về màu đen, isDisabled false
        setNodes((prevNodes) =>
          prevNodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              color: 'black',
              isDisabled: false,
            },
          })),
        )
        return
      }

      // Khi có corrects, đổi màu node theo đúng/sai như logic cũ
      const correctMap = new Map(
        corrects.map((item: any) => [item.id, item.answer.id]),
      )

      const connectedIds = new Set<string>()
      const nodeColors = new Map<string, string>()

      edges.forEach((edge) => {
        const isCorrect = correctMap.get(edge.source) === edge.target
        connectedIds.add(edge.source)
        connectedIds.add(edge.target)

        nodeColors.set(edge.source, isCorrect ? Color.Success : Color.Error)
        nodeColors.set(edge.target, isCorrect ? Color.Success : Color.Error)
      })

      // Đánh dấu đỏ các node đúng nhưng chưa nối
      for (const item of corrects) {
        const questionId = item.id
        const answerId = item.answer.id

        if (!connectedIds.has(questionId)) {
          nodeColors.set(questionId, Color.Error)
        }
        if (!connectedIds.has(answerId)) {
          nodeColors.set(answerId, Color.Error)
        }
      }

      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.data?.role && nodeColors.has(node.id)) {
            return {
              ...node,
              data: {
                ...node.data,
                color: nodeColors.get(node.id) || 'black',
                isDisabled: true,
              },
            }
          }
          return node
        }),
      )
    }, [corrects, edges, nodes.length])

    // Tạo flow cho các câu trả lời đúng
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
          const newSourceNode: Node = {
            ...sourceNode,
            id: `correct-${sourceId}`,
            position: {
              x: sourceNode.position.x,
              y: sourceNode.position.y,
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
              y: targetNode.position.y,
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
            type: 'custom',
          })
        }
      }

      return {
        nodes: correctNodes,
        edges: correctEdges,
      }
    }

    const correctFlow = useMemo(() => {
      if (!corrects || nodes.length === 0) return { nodes: [], edges: [] }

      const allAnswersCorrect = defaultAnswer.every((pair: any) =>
        corrects.some(
          (c: any) =>
            String(c.id) === String(pair.questionId) &&
            String(c.answer.id) === String(pair.answerId),
        ),
      )

      if (allAnswersCorrect) return { nodes: [], edges: [] }

      return generateCorrectFlow(corrects, nodes)
    }, [corrects, nodes, defaultAnswer])

    useEffect(() => {
      setCorrectEdges(correctFlow.edges)
      setCorrectNodes(correctFlow.nodes)
    }, [correctFlow])

    return (
      <div key={key} ref={extenalRef}>
        <div className="flex h-full w-full flex-col bg-gray-100">
          <div
            className={`relative w-full min-w-[700px]`}
            ref={flowRef}
            style={{
              height: `${(nodes?.length / 2 || 1) * 100}px`,
            }}
          >
            <ReactFlowProvider>
              <CustomFlow
                key={key}
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
              />
            </ReactFlowProvider>
          </div>
          {!!corrects && !!correctNodes?.length && (
            <>
              <Divider className="bg-gray-15" />
              <div className="mb-4 text-base font-bold text-bw-15">
                Correct Answer:
              </div>
              <div
                className={`relative w-full min-w-[700px]`}
                ref={flowRef}
                style={{
                  height: `${(correctNodes?.length / 2 || 1) * 100}px`,
                }}
              >
                <ReactFlowProvider>
                  <CustomFlow
                    key={`correct-${key}`}
                    nodes={correctNodes}
                    edges={correctEdges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    onConnect={onConnect}
                  />
                </ReactFlowProvider>
              </div>
            </>
          )}
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
  return <MatchQuiz {...props} ref={ref} />
})

MatchQuizWrapper.displayName = 'MatchQuizWrapper'

export default MatchQuizWrapper
