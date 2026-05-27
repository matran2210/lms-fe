"use client";
import {
  addEdge,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import dynamic from "next/dynamic";
import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnswerItem, IAnswerMultipleChoice, MY_COURSES } from "@lms/core";
import { IExhibitData } from "@lms/core";
import CustomEdge from "./CustomEdge";
import { CustomNode } from "./CustomNode";
import { runHighlight } from "@lms/utils";
import clsx from "clsx";
import { Grid } from "antd";
import SappDivider from "../../base/divider/Divider";
import { HighlightableHTML } from "../../highlights";
import { SappTitleSolution } from "../../common";
import { EditorReader } from "../../base";
import { useFeature } from "@lms/contexts";

// Lazy load ReactFlowProvider + CustomFlow — @xyflow/react ~200KB
const CustomFlow = dynamic(() => import("./CustomFlow"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
})

const ReactFlowProviderDynamic = dynamic(
  () => import("@xyflow/react").then((m) => ({ default: m.ReactFlowProvider })),
  { ssr: false },
)

interface IProps {
  data: any;
  action?: any;
  handleSaveHighLight?: any;
  highlighted?: any;
  removeHighlight?: any;
  allowHighLight?: boolean;
  defaultAnswer?: any;
  done?: boolean;
  extenalRef?: any;
  index?: number;
  corrects?: any;
  solution?: string;
  allowUnHighLight?: boolean;
  uuid?: string;
  setOpenFile?: (
    data: IExhibitData,
    file?: string | null,
    fileName?: string | null,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
  isHideExhibit?: boolean;
  isAlwaysShowAnswer?: boolean;
  exhibitText?: string;
  correctAnswerClass?: string;
  explainClassname?: string;
  onChangeMatchedPairs?: (matchedPairs: any[]) => void;
  storageKey?: string;
  disabled?: boolean;
  isAnimationCorrectAnswer?: boolean;
}

type Role = "question" | "answer";
type MatchNode = Node<{ label: string; role: Role; answer_position?: number }>;

interface RawItem {
  id: string;
  label: string;
  role: Role;
  color: string;
  width: string;
  answer_position: number;
}

interface TransformDataInput {
  questions: RawItem[];
  answers: RawItem[];
  containerWidth?: number;
  nodeWidth?: number;
}

export enum Color {
  TextDefault = "#000000",
  Success = "#078A4D",
  Error = "#F80903",
  ArrowDefault = "#FFB700",
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
      exhibitText = "Exhibit",
      correctAnswerClass,
      explainClassname,
      onChangeMatchedPairs,
      storageKey,
      disabled = false,
      isAnimationCorrectAnswer = false,
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {

    const { params, query } = useFeature()
    const [edges, setEdges] = useState<Edge[]>([]);
    const flowRef = useRef<HTMLDivElement>(null);
    const [nodes, setNodes] = useState<MatchNode[]>([]);
    const [correctNodes, setCorrectNodes] = useState<Node[]>([]);
    const [correctEdges, setCorrectEdges] = useState<Edge[]>([]);
    const [key, setKey] = useState(1);
    const { useBreakpoint } = Grid;
    const { lg } = useBreakpoint();
    const NODE_WIDTH = lg ? 328 : 290;
    const CONTAINER_WIDTH = lg ? 852 : 640;

    // State để lưu tối đa 2 node đang được chọn
    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

    // Hàm xử lý khi click vào node
    const handleNodeClick = useCallback(
      (nodeId: string) => {
        if (disabled) return;
        const clickedNode = nodes.find((n) => n.id === nodeId);
        if (!clickedNode) return;

        // Nếu node đã được chọn thì bỏ chọn (toggle)
        if (selectedNodes.includes(nodeId)) {
          setSelectedNodes(selectedNodes.filter((id) => id !== nodeId));
          return;
        }

        // Nếu chưa chọn node nào hoặc mới chọn 1 node
        if (selectedNodes.length === 0) {
          setSelectedNodes([nodeId]);
        } else if (selectedNodes.length === 1) {
          const firstNode = nodes.find((n) => n.id === selectedNodes[0]);
          if (firstNode && firstNode.data.role !== clickedNode.data.role) {
            // Đủ 2 node khác role, highlight cả 2 node
            setSelectedNodes([selectedNodes[0], nodeId]);
            // Sau một nhịp event, nối edge và reset selection
            setTimeout(() => {
              const source =
                firstNode.data.role === "question" ? firstNode.id : nodeId;
              const target =
                firstNode.data.role === "question" ? nodeId : firstNode.id;
              setEdges((prev) =>
                addEdge(
                  { source, target, type: "custom" } as Edge,
                  prev.filter(
                    (e) => e.source !== source && e.target !== target,
                  ),
                ),
              );
              setSelectedNodes([]);
            }, 100);
          } else {
            // Nếu cùng role thì chỉ đổi selected
            setSelectedNodes([nodeId]);
          }
        }
      },
      [nodes, selectedNodes, disabled],
    );

    const getMatchedPairs = (edges: Edge[], nodes: MatchNode[]) => {
      const nodeMap = new Map(nodes.map((n) => [n.id, n]));

      return edges
        .map((edge) => {
          const sourceNode = nodeMap.get(edge.source);
          const targetNode = nodeMap.get(edge.target);

          if (!sourceNode || !targetNode) return null;

          // Đảm bảo phân biệt đúng role giữa question và answer
          const isSourceQuestion = sourceNode.data.role === "question";

          return {
            question_id: isSourceQuestion ? sourceNode.id : targetNode.id,
            answer_id: isSourceQuestion ? targetNode.id : sourceNode.id,
          };
        })
        .filter(Boolean);
    };

    useImperativeHandle(ref, () => ({
      handleReset() {
        setKey((prev) => {
          const newKey = prev + 1;
          return newKey;
        });
      },
      handleResetEdges() {
        setKey((prev) => {
          const newKey = prev + 1;
          return newKey;
        });
        setEdges([]);
      },
      getMatchedPairs: () => getMatchedPairs(edges, nodes),
    }));

    const transformDataToNodes = ({
      questions,
      answers,
      containerWidth = 700,
      nodeWidth = 295,
    }: TransformDataInput): MatchNode[] => {
      const nodes: MatchNode[] = [];

      // Create question nodes (left side, x: 0)
      questions.forEach((q, index) => {
        nodes.push({
          id: q.id,
          type: "custom",
          position: { x: 0, y: index * 100 },
          data: { label: q.label, role: "question" },
        });
      });

      // Create answer nodes (right side, x: containerWidth - nodeWidth)
      answers
        .sort((a, b) => (a.answer_position ?? 0) - (b.answer_position ?? 0))
        .forEach((a, index) => {
          nodes.push({
            id: a.id,
            type: "custom",
            position: { x: containerWidth - nodeWidth, y: index * 100 },
            data: { label: a.label, role: "answer" },
          });
        });
      return nodes;
    };

    useEffect(() => {
      // Transform question_matchings into questions and answers
      const questions: RawItem[] =
        data?.question_matchings?.map((item: any) => ({
          id: item.id,
          label: item.content,
          role: "question" as Role,
          color: Color.TextDefault,
        })) || [];

      const answers: RawItem[] =
        data?.answers?.map((item: any) => ({
          id: item.id,
          label: item.answer,
          role: "answer" as Role,
          color: Color.TextDefault,
          answer_position: item?.answer_position,
        })) || [];

      const transformed = transformDataToNodes({
        questions,
        answers,
        containerWidth: flowRef.current?.clientWidth || CONTAINER_WIDTH,
        nodeWidth: NODE_WIDTH,
      });
      setNodes(transformed);
    }, [data, NODE_WIDTH, CONTAINER_WIDTH]);

    // CustomNode sẽ nhận selectedNodes, tự kiểm tra node.id có trong selectedNodes không để render border vàng
    const nodeTypes = useMemo(
      () => ({
        custom: (props: any) => {
          const { id } = props;
          const isSelected = selectedNodes.includes(id);
          // Kiểm tra nếu là answer và đã được nối (có edge nối vào)
          const isAnswer = props.data?.role === "answer";
          const isConnected = isAnswer && edges.some((e) => e.target === id);
          return (
            <CustomNode
              {...props}
              data={{
                ...props.data,
                isSelected,
                isConnected,
                onClick: (e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                  if (!corrects && !disabled) handleNodeClick(id);
                },
              }}
            />
          );
        },
      }),
      [selectedNodes, handleNodeClick, corrects, edges, disabled],
    );

    const edgeTypes = {
      custom: CustomEdge,
    };

    const onConnect = useCallback((connection: Connection) => {
      if (disabled) return;
      setEdges((prev) => {
        // Xoá edge cũ có cùng target
        const filtered = prev.filter(
          (e) =>
            e.target !== connection.target && e.source !== connection.source,
        );

        // Thêm edge mới
        return addEdge({ ...connection, type: "custom" }, filtered);
      });
    }, [disabled]);

    useEffect(() => {
      if (!defaultAnswer || defaultAnswer.length === 0) return;

      const hasCorrects = corrects && corrects.length > 0;

      const newEdges: Edge[] = defaultAnswer.map((pair: any) => {
        const oldEdge = edges.find(
          (e) => e.source === pair.question_id && e.target === pair.answer_id,
        );

        // Nếu có corrects thì đổi màu theo đúng/sai, không thì mặc định màu đen
        const isCorrect = hasCorrects
          ? corrects.some(
              (c: any) =>
                String(c?.id) === String(pair.question_id) &&
                (String(c?.answer?.id) === String(pair.answer_id) ||
                  c?.answer_ids?.includes(pair?.answer_id)),
            )
          : false;

        return {
          id: `edge-${pair.question_id}-${pair.answer_id}`,
          source: pair.question_id,
          target: pair.answer_id,
          type: "custom",
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
        };
      });

      setEdges(newEdges);
    }, [defaultAnswer, corrects]);

    const [isNodeReady, setNodeReady] = useState(false);

    useEffect(() => {
      if (nodes.length > 0) setNodeReady(true);
    }, [nodes]);

    useEffect(() => {
      if (!isNodeReady) return;
      const hasCorrects = corrects && corrects.length > 0;
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
        );
        return;
      }
      // Khi có corrects, đổi màu node theo đúng/sai như logic cũ
      const correctMap = new Map(
        corrects.map((item: any) => [item.id, item?.answer?.id]),
      );

      const connectedIds = new Set<string>();
      const nodeColors = new Map<string, string>();
      edges.forEach((edge) => {
        const answerCurrent = corrects?.find(
          (item: { id: string }) => item?.id === edge?.source,
        );
        const isMultiAnswer = answerCurrent?.answer_ids?.includes(edge?.target);
        const isCorrect =
          correctMap.get(edge?.source) === edge?.target || isMultiAnswer;
        connectedIds.add(edge?.source);
        connectedIds.add(edge?.target);

        nodeColors.set(edge.source, isCorrect ? Color.Success : Color.Error);
        nodeColors.set(edge.target, isCorrect ? Color.Success : Color.Error);
      });

      // Đánh dấu đỏ các node đúng nhưng chưa nối
      for (const item of corrects) {
        const question_id = item.id;
        const answer_id = item?.answer?.id;

        if (!connectedIds.has(question_id)) {
          nodeColors.set(question_id, Color.Error);
        }
        if (!connectedIds.has(answer_id)) {
          nodeColors.set(answer_id, Color.Error);
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
            };
          }
          return node;
        }),
      );
    }, [corrects, edges, isNodeReady]);

    // Tạo flow cho các câu trả lời đúng
    const generateCorrectFlow = (corrects: any[], allNodes: Node[]) => {
      const nodeMap = new Map(allNodes.map((n) => [n.id, n]));
      const correctEdges: Edge[] = [];
      const correctNodes: Node[] = [];

      for (const item of corrects) {
        const sourceId = item.id;
        const targetId = item?.answer?.id;

        const sourceNode = nodeMap.get(sourceId);
        const targetNode = nodeMap.get(targetId);

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
          };

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
          };

          correctNodes.push(newSourceNode, newTargetNode);

          correctEdges.push({
            id: `correct-${sourceId}-${targetId}`,
            source: newSourceNode.id,
            target: newTargetNode.id,
            data: { isCorrect: true },
            style: { stroke: Color.Success },
            type: "custom",
          });
        }
      }

      return {
        nodes: correctNodes,
        edges: correctEdges,
      };
    };

    const correctFlow = useMemo(() => {
      if (!corrects || nodes.length === 0) return { nodes: [], edges: [] };

      const allAnswersCorrect =
        defaultAnswer?.length > 0
          ? defaultAnswer?.every((pair: AnswerItem) =>
              corrects?.some(
                (c: IAnswerMultipleChoice) =>
                  String(c?.id) === String(pair?.question_id) &&
                  String(c?.answer?.id) === String(pair?.answer_id),
              ),
            )
          : false;

      if (allAnswersCorrect) return { nodes: [], edges: [] };

      return generateCorrectFlow(corrects, nodes);
    }, [corrects, nodes, defaultAnswer]);

    useEffect(() => {
      setCorrectEdges(correctFlow.edges);
      setCorrectNodes(correctFlow.nodes);
    }, [correctFlow]);

    // Thông báo matchedPairs lên parent mỗi khi edges hoặc nodes thay đổi
    useEffect(() => {
      if (disabled) return;
      if (onChangeMatchedPairs) {
        onChangeMatchedPairs(getMatchedPairs(edges, nodes));
      }
    }, [edges, nodes, disabled]);

    const correctNodeTypes = useMemo(
      () => ({
        custom: (props: any) => {
          const { id } = props;
          // Kiểm tra nếu là answer và đã được nối (có edge nối vào)
          const isAnswer = props.data?.role === "answer";
          const isConnected =
            isAnswer && correctEdges.some((e) => e.target === id);
          return (
            <CustomNode
              {...props}
              data={{
                ...props.data,
                isConnected,
              }}
            />
          );
        },
      }),
      [correctEdges],
    );

    return (
      <div key={key} ref={extenalRef}>
        <div
          id="hightlight_area"
          className={clsx(
            `max-w-[${CONTAINER_WIDTH}px]`,
            "whitespace-normal break-words",
          )}
          onMouseUp={(e: any) => {
            if (disabled) return;
            if (
              e?.target?.tagName?.charAt(0) !== "m" &&
              e?.target?.firstChild?.tagName !== "math"
            ) {
              if (allowHighLight) {
                runHighlight(
                  handleSaveHighLight,
                  allowHighLight || false,
                  "hightlight_area",
                );
              } else if (allowUnHighLight) {
                runHighlight(
                  handleSaveHighLight,
                  allowUnHighLight || false,
                  "hightlight_area",
                  { color: "white" },
                );
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
                  <div className="my-6 border border-b-gray-300"></div>
                )}
                <div className="mb-4 flex items-center">
                  <div className="font-semibold">
                    {exhibitText ? exhibitText + "s" : "Exhibits"} (
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
                                type: "exhibits",
                                description: e?.description,
                                name: e?.name,
                                index: i,
                                files: e?.files,
                              },
                              null,
                              null,
                              event,
                            );
                        }}
                      >
                        {exhibitText} {i + 1}: {e?.name}
                      </div>
                    );
                  })}
                </div>
                <div className="my-6 border border-b-gray-300"></div>
              </>
            )}
          <HighlightableHTML
            initialHTML={data?.question_content || ""}
            storageKey={
              storageKey ||
              `${params?.id || query.id}-${data?.qType}-question-${data?.id}`
            }
            className="sapp-questions sapp-editor-reader !mb-8"
          />
          {/* <EditorReader
            className="sapp-questions sapp-editor-reader !mb-[32px]"
            text_editor_content={data?.question_content}
            highlighted={highlighted}
          /> */}
        </div>
        <div className="flex h-full w-full flex-col" data-aos={isAnimationCorrectAnswer ? "fade-left" : ""}
          data-aos-delay={200}
          data-aos-once="true">
          <div
            className={`relative w-full min-w-[${CONTAINER_WIDTH}]`}
            ref={flowRef}
            style={{
              width: CONTAINER_WIDTH + "px",
              height: `${(nodes?.length / 2 || 1) * 100}px`,
            }}
          >
            <ReactFlowProviderDynamic>
              <CustomFlow
                key={key}
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
              />
            </ReactFlowProviderDynamic>
          </div>
          {!!corrects && !!correctNodes?.length && (
            <div data-aos={isAnimationCorrectAnswer ? "fade-down" : ""} data-aos-duration="800">
              <SappDivider />
              <div className={clsx(correctAnswerClass)}>
                <SappTitleSolution title={`${MY_COURSES.correctAnswer}:`} />
                <div
                  className={`relative mt-4 w-full min-w-[${CONTAINER_WIDTH}]`}
                  ref={flowRef}
                  style={{
                    height: `${(correctNodes?.length / 2 || 1) * 100}px`,
                    width: CONTAINER_WIDTH + "px",
                  }}
                >
                  <ReactFlowProviderDynamic>
                    <CustomFlow
                      key={`correct-${key}`}
                      nodes={correctNodes}
                      edges={correctEdges}
                      nodeTypes={correctNodeTypes}
                      edgeTypes={edgeTypes}
                      onConnect={onConnect}
                    />
                  </ReactFlowProviderDynamic>
                </div>
              </div>
            </div>
          )}
        </div>

        {solution && (
          <div data-aos={isAnimationCorrectAnswer ? "fade-down" : ""} data-aos-duration="800">
            <SappDivider />
            <div className={explainClassname}>
              <SappTitleSolution title={`${MY_COURSES.explanations}:`} />
              <EditorReader className="mt-4" text_editor_content={solution} />
            </div>
          </div>
        )}
      </div>
    );
  },
);

MatchQuiz.displayName = "MatchQuiz";

const MatchQuizComponent = forwardRef((props: IProps, ref) => {
  return <MatchQuiz {...props} ref={ref} />;
});

MatchQuizComponent.displayName = "MatchQuizComponent";

export default MatchQuizComponent;
