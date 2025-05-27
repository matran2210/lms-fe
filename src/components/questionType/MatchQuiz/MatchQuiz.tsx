import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  forwardRef,
  ForwardedRef,
} from 'react'
import {
  ReactFlowProvider,
  ReactFlow,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  useReactFlow,
  ConnectionMode,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { CustomNode } from './CustomNode'
import CustomEdge from './CustomEdge'
import { MY_COURSES } from 'src/constants/lang'
import { SappTitleSolution } from 'src/common/SappTitleSolution'
import EditorReader from '@components/base/editor/EditorReader'
import { IExhibitData } from 'src/type/exhibit'
import { Iprops } from 'src/redux/slice/EntranceTest/EntranceTest'

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
          position: { x: 0, y: 100 + index * 100 },
          data: { label: q.label, role: 'question' },
        })
      })

      // Create answer nodes (right side, x: containerWidth - nodeWidth)
      answers.forEach((a, index) => {
        nodes.push({
          id: a.id,
          type: 'custom',
          position: { x: containerWidth - nodeWidth, y: 100 + index * 100 },
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
      }))

      const answers: RawItem[] = data.question_matchings.map((item: any) => ({
        id: item.answer.id,
        label: item.answer.answer,
        role: 'answer' as Role,
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

    return (
      <div className="flex h-full w-full flex-col">
        <div
          className="relative h-[500px] w-full min-w-[700px] bg-gray-100"
          ref={flowRef}
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
          <svg>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="3"
                refY="4"
                orient="0"
                markerUnits="strokeWidth"
              >
                <path
                  d="M3.604 3.519C3.799 3.715 3.799 4.032 3.604 4.226L0.422 7.409C0.227 7.604 -0.0905 7.604 -0.2855 7.409C-0.481 7.213 -0.481 6.897 -0.2855 6.701L2.543 3.873L-0.2855 1.045C-0.481 0.849 -0.481 0.533 -0.2855 0.337C-0.0905 0.142 0.227 0.142 0.422 0.337L3.604 3.519Z"
                  fill="currentColor"
                />
              </marker>
            </defs>
          </svg>
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
