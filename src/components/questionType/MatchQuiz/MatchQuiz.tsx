import EditorReader from '@components/base/editor/EditorReader'
import {
  ReactFlowProvider,
  addEdge,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react'
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
import { runHighlight } from '@utils/index'
import clsx from 'clsx'

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
  explainClassname?: string
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
  TextDefault = '#000000',
  Success = '#078A4D',
  Error = '#F80903',
  ArrowDefault = '#FFB700',
}

const MatchQuiz = forwardRef(
  (
    {
      data,
      handleSaveHighLight,
      highlighted,
      allowHighLight,
      defaultAnswer,
      extenalRef,
      corrects,
      solution,
      allowUnHighLight,
      setOpenFile,
      isHideExhibit = true,
      exhibitText = 'Exhibit',
      explainClassname,
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
            question_id: isSourceQuestion ? sourceNode.id : targetNode.id,
            answer_id: isSourceQuestion ? targetNode.id : sourceNode.id,
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
      const questions: RawItem[] =
        data?.question_matchings.map((item: any) => ({
          id: item.id,
          label: item.content,
          role: 'question' as Role,
          color: Color.TextDefault,
        })) || []

      const answers: RawItem[] =
        data?.question_matchings?.map((item: any) => ({
          id: item.answer.id,
          label: item.answer.answer,
          role: 'answer' as Role,
          color: Color.TextDefault,
        })) || []

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
          (e) => e.source === pair.question_id && e.target === pair.answer_id,
        )

        // Nếu có corrects thì đổi màu theo đúng/sai, không thì mặc định màu đen
        const isCorrect = hasCorrects
          ? corrects.some(
              (c: any) =>
                String(c?.id) === String(pair.question_id) &&
                String(c?.answer?.id) === String(pair.answer_id),
            )
          : false

        return {
          id: `edge-${pair.question_id}-${pair.answer_id}`,
          source: pair.question_id,
          target: pair.answer_id,
          type: 'custom',
          data: {
            ...(oldEdge ? oldEdge.data : {}),
            color: hasCorrects
              ? isCorrect
                ? Color.Success
                : Color.Error
              : Color?.ArrowDefault,
          },
          style: {
            stroke: hasCorrects
              ? isCorrect
                ? Color.Success
                : Color.Error
              : Color?.ArrowDefault,
          },
        }
      })

      setEdges(newEdges)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultAnswer, corrects])

    useEffect(() => {
      const hasCorrects = corrects && corrects.length > 0
      if (!hasCorrects) {
        // Khi chưa có corrects: tất cả node về màu đen, isDisabled false
        setNodes((prevNodes) =>
          prevNodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              color: Color.TextDefault,
              edgeColor: Color.ArrowDefault,
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
        const question_id = item.id
        const answer_id = item.answer.id

        if (!connectedIds.has(question_id)) {
          nodeColors.set(question_id, Color.Error)
        }
        if (!connectedIds.has(answer_id)) {
          nodeColors.set(answer_id, Color.Error)
        }
      }

      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.data?.role && nodeColors.has(node.id)) {
            return {
              ...node,
              data: {
                ...node.data,
                color: nodeColors.get(node.id) || Color?.TextDefault,
                edgeColor: nodeColors.get(node.id) || Color?.ArrowDefault,
                isDisabled: true,
              },
            }
          }
          return node
        }),
      )
    }, [corrects, edges])

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
              edgeColor: Color.Success,
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
              edgeColor: Color.Success,
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
            String(c.id) === String(pair.question_id) &&
            String(c.answer.id) === String(pair.answer_id),
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
        <div
          id="hightlight_area"
          onMouseUp={(e: any) => {
            if (
              e?.target?.tagName?.charAt(0) !== 'm' &&
              e?.target?.firstChild?.tagName !== 'math'
            ) {
              // if(e){
              if (allowHighLight) {
                runHighlight(
                  handleSaveHighLight,
                  allowHighLight || false,
                  'hightlight_area',
                )
              } else if (allowUnHighLight) {
                runHighlight(
                  handleSaveHighLight,
                  allowUnHighLight || false,
                  'hightlight_area',
                  { color: 'white' },
                )
              }
              // }
            }
          }}
        >
          {data?.question_topic?.exhibits &&
            !isHideExhibit &&
            data?.question_topic?.exhibits?.length > 0 && (
              <>
                {!!data?.question_topic?.description && (
                  <div className="my-6 border border-b-[#DCDDDD]"></div>
                )}
                <div className="mb-4 flex items-center">
                  <div className="font-semibold">
                    {exhibitText ? exhibitText + 's' : 'Exhibits'} (
                    {data?.question_topic?.exhibits?.length || 0})
                  </div>
                  <div className="ml-4">
                    <span className="text-error">* </span>
                    <span className="text-[#A1A1A1]">Click to view</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {data?.question_topic?.exhibits?.map((e: any, i: number) => {
                    return (
                      <div
                        className="cursor-pointer hover:text-primary"
                        key={e?.id ?? i}
                        onClick={(event) => {
                          setOpenFile &&
                            setOpenFile(
                              {
                                type: 'exhibits',
                                description: e?.description,
                                name: e?.name,
                                index: i,
                                files: e?.files,
                              },
                              null,
                              null,
                              event,
                            )
                        }}
                      >
                        {exhibitText} {i + 1}: {e?.name}
                      </div>
                    )
                  })}
                </div>
                <div className="my-6 border border-b-[#DCDDDD]"></div>
              </>
            )}
          <EditorReader
            className="sapp-questions !mb-[32px]"
            text_editor_content={data?.question_content}
            highlighted={highlighted}
          />
        </div>
        <div className="flex h-full w-full flex-col">
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
              <Divider className="bg-ink-300" />
              <div className="mb-4 text-base font-bold text-[#3F3F3F]">
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
          <>
            <Divider className="my-8" />
            <div className={clsx('bg-gray-4 mt-6 p-6', explainClassname)}>
              <SappTitleSolution title={`${MY_COURSES.solution}:`} />
              <EditorReader className="mt-4" text_editor_content={solution} />
            </div>
          </>
        )}
      </div>
    )
  },
)

MatchQuiz.displayName = 'MatchQuiz'

const MatchQuizComponent = forwardRef((props: IProps, ref) => {
  return <MatchQuiz {...props} ref={ref} />
})

MatchQuizComponent.displayName = 'MatchQuizComponent'

export default MatchQuizComponent
