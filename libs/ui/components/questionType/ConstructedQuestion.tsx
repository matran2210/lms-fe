import { CloseIcon, UploadIcon } from "@lms/assets";
import { disableUnsavedChange, loginSlice, useAppDispatch, useFeature } from "@lms/contexts";
import { DEFAULT_EDITOR_VALUE, DISPLAY_TYPE, generateSheetId, MY_COURSES, RESPONSE_OPTION, SheetData } from "@lms/core";
import { runHighlight } from "@lms/utils";
import clsx from "clsx";
import { cloneDeep, isNull, isUndefined, uniqueId } from "lodash";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { SappDivider } from "../../components/base/divider";
import { EditorReader, HookFormEditor, HookFormExcel } from "../base";
import { SappTitleSolution } from "../common";
import { HighlightableHTML } from "../highlights";

export type IPreviewProp = {
  data: any;
  question_content: string;
  index: number | undefined;
  question_data: any;
  control: any;
  name: string;
  handleSaveHighLight?: any;
  highlighted?: any;
  removeHighlight?: any;
  allowHighLight?: boolean;
  allowUnHighLight?: boolean;
  forCaseStudy?: boolean;
  solution?: string;
  setValue?: any;
  defaultValue?: any;
  response_option_custom?: any;
  externalRef?: any;
  fullData: any;
  openChooseFile?: any;
  handleClearFile?: any;
  setOpenPdf?: (type: string, file?: string, fileName?: string) => void;
  handleSaveHighLightRequirement?: any;
  setUnsavedChanges?: any;
  handleChange?: (id: string) => void;
  isShowContent?: boolean;
  showRequiment?: boolean;
  className?: string;
  editorClassName?: string;
  explainClassname?: string;
  uniqueKey?: string;
  isInTest?: boolean;
  storageKey?: string;
};
type SAPPEditorHandle = {
  moveSelectionOutOfTable: () => void;
  resetContentSafe: (newContent: string) => void;
};
const EssayQuestionPreview = ({
  data,
  question_content,
  index,
  question_data,
  control,
  handleSaveHighLight = () => {},
  highlighted,
  allowHighLight,
  forCaseStudy = false,
  name,
  defaultValue,
  response_option_custom,
  externalRef,
  fullData,
  openChooseFile,
  handleClearFile,
  setOpenPdf,
  allowUnHighLight,
  handleSaveHighLightRequirement = () => {},
  setUnsavedChanges,
  handleChange,
  isShowContent = true,
  showRequiment = false,
  className = "",
  editorClassName = "",
  explainClassname,
  setValue,
  uniqueKey,
  isInTest = false,
  storageKey,
  
}: IPreviewProp) => {
  const { uploadApi, router } = useFeature();

  const dispatch = useAppDispatch();
  const refSheet = useRef(null) as any;
  const [key, setKey] = useState("1");

  const editorRef = useRef<SAPPEditorHandle>(null);
  // Cờ chặn tạm thời onChange trong lúc đang thực hiện các thao tác cấu trúc
  // (thêm/xóa/undo/redo/di chuyển/sao chép sheet) của Fortune Sheet.
  // Mục đích: tránh serialize trạng thái trung gian gây lỗi "sheet not found".
  const ignoreStructOpsRef = useRef<boolean>(false);
  // Lưu snapshot sheets gần nhất (đầy đủ celldata) để không mất dữ liệu các sheet khác khi đổi sheet
  const sheetsSnapshotRef = useRef<any[] | null>(null);

  // Tạo unique key cho mỗi requirement để tránh xung đột giữa các requirements
  const requirementKey = useMemo(() => {
    return `requirement-${data?.id || index || 0}`;
  }, [data?.id, index]);

  // Đồng bộ Controller với các thay đổi cấu trúc của Fortune Sheet
  // - Bật cờ ignoreStructOpsRef khi thao tác cấu trúc đang diễn ra để onChange không chạy
  // - Sau khi thao tác hoàn tất, đồng bộ toàn bộ danh sách sheets vào Controller rồi tắt cờ
  const handleOp = (ops: any[]) => {
    if (!setValue) return;
    let shouldSync = false;
    for (const op of ops) {
      if (
        op?.op === "addSheet" ||
        op?.op === "deleteSheet" ||
        op?.op === "undo" ||
        op?.op === "redo" ||
        op?.op === "moveSheet" ||
        op?.op === "copySheet"
      ) {
        shouldSync = true;
      }
    }
    if (shouldSync) {
      // Avoid onChange processing while structural ops are applying
      ignoreStructOpsRef.current = true;
      // Defer to let Fortune Sheet finish applying the operation
      setTimeout(() => {
        if (refSheet?.current) {
          const workbook = refSheet.current;
          const sheetsNow = (workbook.getAllSheets?.() || []) as any[];

          // Base: ưu tiên snapshot hiện tại nếu có, để giữ celldata của các sheet cũ
          let base: any[] = Array.isArray(sheetsSnapshotRef.current)
            ? (sheetsSnapshotRef.current as any[])
            : [];

          if (!Array.isArray(base) || base.length === 0) {
            // Fallback: nếu chưa có snapshot, tạo từ getAllSheets (celldata có thể rỗng với sheet không active)
            base = sheetsNow.map((s: any) => ({
              id: s?.id,
              name: s?.name,
              status: s?.status,
              row: s?.row,
              column: s?.column,
              celldata: Array.isArray(s?.celldata) ? s.celldata : [],
              data: s?.data ?? [],
            }));
          }

          // Merge theo id: giữ dữ liệu cũ nếu sheet còn tồn tại; thêm sheet mới nếu có
          const byId = new Map<string, any>();
          base.forEach((s: any) => {
            if (s?.id) byId.set(s.id, s);
          });

          sheetsNow.forEach((s: any) => {
            if (s?.id) {
              if (!byId.has(s.id)) {
                byId.set(s.id, {
                  id: s?.id,
                  name: s?.name,
                  status: s?.status,
                  row: s?.row,
                  column: s?.column,
                  celldata: Array.isArray(s?.celldata) ? s.celldata : [],
                  data: s?.data ?? [],
                });
              } else {
                // Cập nhật meta (name/status/row/column) theo cấu trúc mới, giữ celldata/data cũ
                const prev = byId.get(s.id);
                byId.set(s.id, {
                  ...prev,
                  name: s?.name,
                  status: s?.status,
                  row: s?.row,
                  column: s?.column,
                });
              }
            }
          });

          // Loại bỏ sheet đã bị xóa (có trong base nhưng không còn trong sheetsNow)
          const nowIds = new Set(
            sheetsNow.map((s: any) => s?.id).filter(Boolean),
          );
          Array.from(byId.keys()).forEach((id) => {
            if (!nowIds.has(id)) byId.delete(id);
          });

          const merged = sheetsNow
            .map((s: any) => byId.get(s?.id))
            .filter(Boolean);
          sheetsSnapshotRef.current = merged;
          setValue(name, JSON.stringify(merged));
        }
        // Re-enable onChange handling
        ignoreStructOpsRef.current = false;
      }, 0);
    }
  };

  const fileData = {
    name:
      fullData?.data?.requirements?.[index ?? 0]?.answer_file?.file_name ||
      fullData?.answer_file?.file_name ||
      fullData?.data?.answer_file?.file_name ||
      fullData?.data?.defaultValue?.[0]?.answer_file?.file_name,
    key:
      fullData?.data?.requirements?.[index ?? 0]?.answer_file?.file_key ||
      fullData?.answer_file?.file_key ||
      fullData?.data?.answer_file?.file_key ||
      fullData?.data?.defaultValue?.[0]?.answer_file?.file_key,
  };
  if (externalRef) {
    externalRef.current = {
      reset: (templateValue?: string) => {
        // editorRef.current?.moveSelectionOutOfTable()
        editorRef.current?.resetContentSafe(
          templateValue !== undefined
            ? templateValue
            : defaultValue || DEFAULT_EDITOR_VALUE,
        );
      },
      resetSheet: () => {
        setKey((prev) => {
          const newKey = uniqueId("key");
          return newKey;
        });
      },
      clear: (templateValue?: string) => {
        if (refSheet.current) {
          try {
            // Nếu có templateValue, update sheet với giá trị đó
            const currentSheets = refSheet.current.getAllSheets();
            // function tạo sheet trống an toàn
            const makeEmptySheet = (base: SheetData): SheetData => ({
              id: base.id,
              name: base.name,
              status: base.status ?? 1,
              row: base.row ?? 100,
              column: base.column ?? 50,
              celldata: [],
              data: Array(base.row || 100)
                .fill(null)
                .map(() => Array(base.column || 50).fill(null)),
            });

            if (templateValue?.trim()) {
              const sheetData: SheetData[] = JSON.parse(templateValue) || [
                {
                  name: "Sheet1",
                  id: generateSheetId(),
                  status: 1,
                  data: [[]],
                  celldata: [],
                },
              ];

              const updatedSheetData = sheetData.map((sheet, index) => {
                const base = currentSheets[index] || {};
                return {
                  ...makeEmptySheet(base as SheetData), // luôn tạo mới data, celldata
                  ...cloneDeep(sheet), // merge nội dung từ JSON vào
                  id: base?.id || sheet.id || "",
                };
              });

              // update tất cả một lần
              refSheet.current.updateSheet(updatedSheetData.map(cloneDeep));
            }
          } catch (error) {
            toast.error("Error reset sheet data:");
          }
        }
      },
    };
  }

  useEffect(() => {
    if (
      refSheet &&
      refSheet.current &&
      Number(index) <= question_data?.requirements?.length
    ) {
      if (
        defaultValue === undefined ||
        defaultValue === null ||
        String(defaultValue).trim() === ""
      ) {
        const emptySheets = refSheet.current
          ?.getAllSheets()
          .map((sheet: SheetData) => ({
            ...sheet,
            celldata: [],
            data: Array(sheet.row || 100)
              .fill(null)
              .map(() => Array(sheet.column || 50).fill(null)),
          }));
        emptySheets.forEach((sheet: SheetData) => {
          refSheet.current?.updateSheet(JSON.parse(JSON.stringify([sheet])));
        });
      } else {
        const sheetData =
          defaultValue && String(defaultValue).trim() !== ""
            ? JSON.parse(defaultValue)
            : [
                {
                  name: "Sheet1",
                  id: generateSheetId(),
                  status: 1,
                  data: [[]],
                  celldata: [],
                },
              ];

        // Convert sheetData to constructor with id of refSheet.current
        const currentSheets = refSheet.current.getAllSheets();
        const updatedSheetData = sheetData.map(
          (sheet: SheetData, index: number) => ({
            ...sheet,
            id: currentSheets[index]?.id || "",
          }),
        );

        const emptySheets = currentSheets.map((sheet: SheetData) => ({
          ...sheet,
          celldata: [],
          data: Array(sheet.row || 100)
            .fill(null)
            .map(() => Array(sheet.column || 50).fill(null)),
        }));
        emptySheets.forEach((sheet: SheetData, index: number) => {
          if (sheet?.name === sheetData[index]?.name) {
            refSheet.current?.updateSheet(
              JSON.parse(JSON.stringify([updatedSheetData[index]])),
            );
          } else {
            refSheet.current?.updateSheet(JSON.parse(JSON.stringify([sheet])));
          }
        });
      }
    }
  }, [defaultValue, index]);

  const handleDownload = async (data: {
    files: { name: string; file_key: string }[];
  }) => {
    try {
      setUnsavedChanges && setUnsavedChanges(false);
      dispatch(disableUnsavedChange());
      await uploadApi.downloadFile(data);
    } catch (error) {
    } finally {
      setUnsavedChanges && setUnsavedChanges(true);
      dispatch(loginSlice.actions.enableUnsavedChange());
    }
  };

  const stableDataId = useMemo(() => {
    // Chỉ return khi data hợp lệ
    if (data && data.id && typeof data.id === "string" && isInTest) {
      return data.id;
    }
    return null;
  }, [data?.id]);

  const lastValueRef = useRef<string | undefined>(undefined);

  const renderSheetEditor = useCallback(
    ({ onChange, value }: any) => {
      // cập nhật ref giá trị hiện tại nếu khác
      if (lastValueRef.current !== value) {
        lastValueRef.current = value;
      }

      const handleLocalChange = (val: string) => {
        // tránh gọi liên tục nếu giá trị không đổi
        if (val === lastValueRef.current) return;
        lastValueRef.current = val;
        onChange(val);
        handleChange?.(data?.id);
      };

      return (
        <HookFormExcel
          key={`${requirementKey}-${key}`}
          question_data={question_data}
          defaultValue={defaultValue}
          onChange={handleLocalChange}
          fullData={fullData}
          ignoreStructOpsRef={ignoreStructOpsRef}
          refSheet={refSheet}
          sheetsSnapshotRef={sheetsSnapshotRef}
          onOp={handleOp}
        />
      );
    },
    [key, stableDataId, requirementKey],
  );
  const renderWordEditor = useMemo(() => {
    editorRef.current?.resetContentSafe(defaultValue);

    return (
      <HookFormEditor
        control={control}
        name={name}
        math={true}
        height={500}
        placeholder="Your answer here"
        defaultValue={defaultValue}
        disabled={
          fullData?.confirmed ||
          fullData?.data?.confirmed ||
          fullData?.is_viewed_answer
        }
        handleChange={() => handleChange && handleChange(data?.id)}
        // externalRef={externalRef}
        editorRef={editorRef}
      />
    );
  }, [name, defaultValue]);
  return (
    <div
      className={clsx(
        "w-full overflow-hidden",
        {
          "rounded-xl bg-gray-100 p-8 lg:rounded-2xl": !isShowContent,
        },
        className,
      )}
    >
      {question_content && isShowContent && (
        <div
          id="hightlight_area"
          className="mb-2"
          onMouseUp={(e: any) => {
            if (
              e?.target?.tagName?.charAt(0) !== "m" &&
              e?.target?.firstChild?.tagName !== "math"
            ) {
              if (e) {
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
              }
            }
          }}
        >
          <HighlightableHTML
            initialHTML={question_content || ""}
            storageKey={
              storageKey ||
              `${router.query.id}-${fullData?.data?.qType}-question-${fullData?.id}`
            }
            className="sapp-questions sapp-editor-reader"
          />
          {/* <EditorReader
            className="sapp-questions sapp-editor-reader"
            text_editor_content={question_content}
            highlighted={highlighted}
          /> */}
        </div>
      )}
      {data && (
        <>
          <div
            id="hightlight_area_require"
            className="mb-2"
            onMouseUp={(e: any) => {
              if (
                e.target.tagName.charAt(0) !== "m" &&
                e.target.firstChild?.tagName !== "math"
              ) {
                if (e) {
                  if (allowHighLight) {
                    runHighlight(
                      handleSaveHighLightRequirement,
                      allowHighLight || false,
                      "hightlight_area_require",
                    );
                  } else if (allowUnHighLight) {
                    runHighlight(
                      handleSaveHighLightRequirement,
                      allowUnHighLight || false,
                      "hightlight_area_require",
                      { color: "white" },
                    );
                  }
                }
              }
            }}
          >
            {data?.name && (
              <div className="sapp-questions-essay">
                {index !== undefined
                  ? `Requirement ${index + 1}: ${data?.name}`
                  : `Requirement: ${data?.name}`}
              </div>
            )}
            {data?.description && (
              <>
                <HighlightableHTML
                  initialHTML={data?.description || ""}
                  storageKey={`${router.query.id}-${fullData?.data?.qType}-requirement-description-${question_data?.requirements?.[index || 0]?.id}`}
                  className="sapp-questions mb-6"
                />
                {/* <EditorReader
                  className="mb-6"
                  text_editor_content={data?.description}
                  highlighted={
                    question_data?.requirements?.[index || 0]?.highlighted
                  }
                  highlighArea="hightlight_area_require"
                /> */}
                <SappDivider className="!my-6" />
              </>
            )}

            {data?.files?.length > 0 && (
              <div>
                {data?.files?.map((e: any, index: number) => {
                  return (
                    <div
                      className="mb-1 block w-fit max-w-full cursor-pointer break-all text-[#3964EA] hover:underline"
                      onClick={() => {
                        setOpenPdf &&
                          setOpenPdf(
                            "file",
                            e?.resource?.url,
                            e?.resource?.name,
                          );
                      }}
                      key={index}
                    >
                      {e?.resource?.name}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* {question_data.display_type === DISPLAY_TYPE.VERTICAL && question_data?.requirements?.length > 0 &&
            !forCaseStudy && <SappDivider className="my-8" />} */}
        </>
      )}
      <>
        {question_data.assignment_type !== "TEXT" ? (
          !isNull(fileData.key) && !isUndefined(fileData.key) ? (
            <React.Fragment>
              <div className="sapp-upload-file-preview">
                <div className="text-lg font-semibold text-bw-13">
                  {fullData.done
                    ? "Your Answer File:"
                    : "Upload file to submit"}
                </div>
                <div
                  className="cursor-pointer text-[#3964EA] hover:underline"
                  onClick={() =>
                    handleDownload({
                      files: [
                        {
                          name: fileData?.name,
                          file_key: fileData?.key,
                        },
                      ],
                    })
                  }
                >
                  {fileData.name}
                </div>
                {!fullData?.confirmed && !fullData.data.confirmed && (
                  <button
                    onClick={() => handleClearFile(index)}
                    className="cursor-pointer"
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
              {question_data.display_type === DISPLAY_TYPE.VERTICAL &&
                !forCaseStudy && (
                  <div className="mb-8">
                    <hr />
                  </div>
                )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div
                className={clsx(
                  "sapp-upload-file-preview",
                  data
                    ? ""
                    : "justify- w-fit flex-col !items-start !pt-0 font-semibold",
                )}
              >
                <div
                  className={clsx(
                    data ? "" : "text-left",
                    "text-base font-semibold",
                  )}
                >
                  Upload file to submit:
                </div>
                <div className="sapp-upload-button-preview">
                  <UploadIcon />
                  <div
                    className="title-btn-preview"
                    onClick={() =>
                      !(
                        fullData?.confirmed ||
                        fullData?.data?.confirmed ||
                        fullData?.is_viewed_answer
                      ) && openChooseFile(true)
                    }
                  >
                    Choose file to upload
                  </div>
                </div>
              </div>
              <SappDivider className="!my-6" />
            </React.Fragment>
          )
        ) : (
          <></>
        )}

        <div
          style={
            question_data?.display_type === DISPLAY_TYPE.VERTICAL ||
            forCaseStudy
              ? { width: "100%" }
              : { width: "100%", marginTop: "10px" }
          }
          className={`${showRequiment ? "pointer-events-none" : ""}`}
        >
          {question_data?.response_option === RESPONSE_OPTION.WORD ? (
            renderWordEditor
          ) : question_data.response_option === RESPONSE_OPTION.SHEET ? (
            <div
              className={`${fullData?.is_viewed_answer || fullData?.confirmed || fullData?.data?.confirmed ? "pointer-events-none opacity-100" : ""} h-[500px] w-full overflow-hidden rounded-lg`}
            >
              <Controller
                key={`${requirementKey}-${key}`}
                name={name}
                control={control}
                defaultValue={defaultValue}
                render={({ field: { onChange, value } }) => {
                  // const isValid = (value?: string) => {
                  //   try {
                  //     if (
                  //       !value ||
                  //       isEmpty(value) ||
                  //       isUndefined(value) ||
                  //       isNull(value)
                  //     )
                  //       return false
                  //     JSON.parse(value)
                  //     return true
                  //   } catch {
                  //     return false
                  //   }
                  // }
                  return renderSheetEditor({
                    onChange,
                    value,
                  });
                }}
              ></Controller>
            </div>
          ) : response_option_custom === 0 ? (
            renderWordEditor
          ) : (
            <div
              className={`${fullData?.is_viewed_answer || fullData?.confirmed || fullData?.data?.confirmed ? "pointer-events-none opacity-100" : ""} h-[500px] w-full overflow-hidden rounded-lg`}
            >
              <Controller
                key={`${requirementKey}-${key}`}
                name={name}
                control={control}
                defaultValue={defaultValue}
                render={({ field: { onChange, value } }) => {
                  return renderSheetEditor({
                    onChange,
                    value,
                  });
                }}
              />
            </div>
          )}
          {(fullData?.confirmed ||
            fullData?.done ||
            fullData?.data?.confirmed) &&
            (fullData?.solution || data?.explanation?.trim()) && (
              <div className={explainClassname}>
                <SappDivider />
                <SappTitleSolution title={`${MY_COURSES.solution}:`} />
                <EditorReader
                  text_editor_content={
                    data?.explanation ??
                    fullData?.solution ??
                    fullData?.data?.solution ??
                    ""
                  }
                  className="mt-4"
                />
              </div>
            )}
        </div>
      </>
    </div>
  );
};
export default memo(EssayQuestionPreview);
