import HookFormEditor from '@components/base/editor/HookFormEditor'
import React, { memo, useEffect, useRef, useState } from 'react'
import { DISPLAY_TYPE, RESPONSE_OPTION } from 'src/constants'
// import SpreadsheetEditor from '@components/base/spreadSheet/SpreadSheetEditor'
import EditorReader from '@components/base/editor/EditorReader'
import { runHighlight } from '@utils/index'
import { Workbook } from '@fortune-sheet/react'
import { Controller } from 'react-hook-form'
import { isEmpty, isNull, isUndefined, uniqueId } from 'lodash'
import { UploadAPI } from 'src/pages/api/upload'
import { CloseIcon, UploadIcon } from '@assets/icons'
import { useAppDispatch } from 'src/redux/hook'
import { disableUnsavedChange, loginSlice } from 'src/redux/slice/Login/Login'
import clsx from 'clsx'

type SheetData = {
  name: string
  id: string
  status: number
  data: (string | number | null)[][]
  celldata: {
    r: number
    c: number
    v: { v: string; ct: { fa: string; t: string }; m: string }
  }[]
  row?: number
  column?: number
}

export type IPreviewProp = {
  data: any
  question_content: string
  index: number | undefined
  question_data: any
  control: any
  name: string
  handleSaveHighLight?: any
  highlighted?: any
  removeHighlight?: any
  allowHighLight?: boolean
  allowUnHighLight?: boolean
  forCaseStudy?: boolean
  solution?: string
  setValue?: any
  defaultValue?: any
  response_option_custom?: any
  externalRef?: any
  fullData: any
  openChooseFile?: any
  handleClearFile?: any
  setOpenPdf?: (type: string, file?: string, fileName?: string) => void
  handleSaveHighLightRequirement?: any
  setUnsavedChanges?: any
  handleChange?: (id: string) => void
  isShowContent?: boolean
  showRequiment?: boolean
}
const EssayQuestionPreview = ({
  data,
  question_content,
  index,
  question_data,
  control,
  handleSaveHighLight = () => {},
  highlighted,
  removeHighlight,
  allowHighLight,
  forCaseStudy = false,
  solution,
  name,
  setValue,
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
}: IPreviewProp) => {
  const dispatch = useAppDispatch()
  const [key, setKey] = useState<string>('1')
  const refSheet = useRef(null) as any

  const fileData = {
    name:
      fullData?.data?.requirements?.[index ?? 0]?.answer_file?.file_name ||
      fullData?.answer_file?.file_name ||
      fullData?.data?.answer_file?.file_name,
    key:
      fullData?.data?.requirements?.[index ?? 0]?.answer_file?.file_key ||
      fullData?.answer_file?.file_key ||
      fullData?.data?.answer_file?.file_key,
  }
  if (externalRef) {
    externalRef.current = {
      reset: () =>
        setKey((prev) => {
          const newKey = uniqueId('key')
          return newKey
        }),
    }
  }

  useEffect(() => {
    if (
      refSheet.current &&
      Number(index) <= question_data?.requirements?.length
    ) {
      if (
        defaultValue === undefined ||
        defaultValue === null ||
        String(defaultValue).trim() === ''
      ) {
        const emptySheets = refSheet.current
          ?.getAllSheets()
          .map((sheet: SheetData) => ({
            ...sheet,
            celldata: [],
            data: Array(sheet.row || 100)
              .fill(null)
              .map(() => Array(sheet.column || 50).fill(null)),
          }))
        emptySheets.forEach((sheet: SheetData) => {
          refSheet.current?.updateSheet(JSON.parse(JSON.stringify([sheet])))
        })
      } else {
        const sheetData =
          defaultValue && String(defaultValue).trim() !== ''
            ? JSON.parse(defaultValue)
            : [{ name: 'Sheet1', id: '', status: 1, data: [[]], celldata: [] }]

        // Convert sheetData to constructor with id of refSheet.current
        const currentSheets = refSheet.current.getAllSheets()
        const updatedSheetData = sheetData.map(
          (sheet: SheetData, index: number) => ({
            ...sheet,
            id: currentSheets[index]?.id || '',
          }),
        )

        const emptySheets = currentSheets.map((sheet: SheetData) => ({
          ...sheet,
          celldata: [],
          data: Array(sheet.row || 100)
            .fill(null)
            .map(() => Array(sheet.column || 50).fill(null)),
        }))
        emptySheets.forEach((sheet: SheetData, index: number) => {
          if (sheet?.name === sheetData[index]?.name) {
            refSheet.current?.updateSheet(
              JSON.parse(JSON.stringify([updatedSheetData[index]])),
            )
          } else {
            refSheet.current?.updateSheet(JSON.parse(JSON.stringify([sheet])))
          }
        })
      }
    }
  }, [defaultValue, index])

  const handleDownload = async (data: {
    files: { name: string; file_key: string }[]
  }) => {
    try {
      setUnsavedChanges && setUnsavedChanges(false)
      dispatch(disableUnsavedChange())
      await UploadAPI.downloadFile(data)
    } catch (error) {
    } finally {
      setUnsavedChanges && setUnsavedChanges(true)
      dispatch(loginSlice.actions.enableUnsavedChange())
    }
  }
  return (
    <div
      style={{ background: 'white' }}
      // id="hightlight_area"
      // onMouseUp={(e: any) => {
      //   if (
      //     e.target.tagName.charAt(0) !== 'm' &&
      //     e.target.firstChild?.tagName !== 'math'
      //   ) {
      //     if (e) {
      //       if (allowHighLight) {
      //         runHighlight(
      //           handleSaveHighLight,
      //           allowHighLight || false,
      //           'hightlight_area',
      //         )
      //       } else if (allowUnHighLight) {
      //         runHighlight(
      //           handleSaveHighLight,
      //           allowUnHighLight || false,
      //           'hightlight_area',
      //           { color: 'white' },
      //         )
      //       }
      //     }
      //   }
      // }}
    >
      {question_content && isShowContent && (
        <div
          id="hightlight_area"
          onMouseUp={(e: any) => {
            if (
              e?.target?.tagName?.charAt(0) !== 'm' &&
              e?.target?.firstChild?.tagName !== 'math'
            ) {
              if (e) {
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
              }
            }
          }}
        >
          <EditorReader
            className="sapp-questions"
            text_editor_content={question_content}
            highlighted={highlighted}
          />
        </div>
      )}
      {data && (
        <>
          <div
            id="hightlight_area_require"
            onMouseUp={(e: any) => {
              if (
                e.target.tagName.charAt(0) !== 'm' &&
                e.target.firstChild?.tagName !== 'math'
              ) {
                if (e) {
                  if (allowHighLight) {
                    runHighlight(
                      handleSaveHighLightRequirement,
                      allowHighLight || false,
                      'hightlight_area_require',
                    )
                  } else if (allowUnHighLight) {
                    runHighlight(
                      handleSaveHighLightRequirement,
                      allowUnHighLight || false,
                      'hightlight_area_require',
                      { color: 'white' },
                    )
                  }
                }
              }
            }}
          >
            {data?.name && (
              <>
                <div className="sapp-questions-essay">
                  {index !== undefined
                    ? `Requirement ${index + 1}: ${data?.name}`
                    : `Requirement: ${data?.name}`}
                </div>
                <EditorReader
                  className="editor-wrap mb-4"
                  text_editor_content={data?.description}
                  highlighted={
                    question_data?.requirements?.[index || 0]?.highlighted
                  }
                  highlighArea="hightlight_area_require"
                />
              </>
            )}

            {data?.files?.length > 0 && (
              <div className="mb-4">
                {data?.files?.map((e: any, index: number) => {
                  return (
                    <div
                      className="mb-1 w-fit cursor-pointer text-state-info hover:underline"
                      onClick={() => {
                        setOpenPdf &&
                          setOpenPdf(
                            'file',
                            e?.resource?.url,
                            e?.resource?.name,
                          )
                      }}
                      key={index}
                    >
                      {e?.resource?.name}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          {question_data.display_type === DISPLAY_TYPE.VERTICAL &&
            !forCaseStudy && <div className="sapp-seprate-line-preview"></div>}
        </>
      )}
      <>
        {question_data.assignment_type !== 'TEXT' ? (
          !isNull(fileData.key) && !isUndefined(fileData.key) ? (
            <React.Fragment>
              <div className="sapp-upload-file-preview">
                <div className="text-base font-semibold">
                  {fullData.done
                    ? 'Your Answer File:'
                    : 'Upload file to submit'}
                </div>
                <div
                  className="cursor-pointer text-state-info hover:underline"
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
                {!fullData?.done &&
                  !fullData?.confirmed &&
                  !fullData.data.confirmed && (
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
                  <div className="sapp-seprate-line-preview"></div>
                )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div
                className={clsx(
                  'sapp-upload-file-preview',
                  data
                    ? ''
                    : 'w-fit flex-col !items-start justify-start !pt-0 font-semibold',
                )}
              >
                <div
                  className={clsx(
                    data ? '' : 'text-left',
                    'text-base font-semibold',
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
                        fullData?.done ||
                        fullData?.confirmed ||
                        fullData?.data?.confirmed
                      ) && openChooseFile(true)
                    }
                  >
                    Choose file to upload
                  </div>
                </div>
              </div>
              {question_data?.display_type === DISPLAY_TYPE.VERTICAL &&
                !forCaseStudy &&
                data && <div className="sapp-seprate-line-preview"></div>}
            </React.Fragment>
          )
        ) : (
          <></>
        )}

        <div
          style={
            question_data?.display_type === DISPLAY_TYPE.VERTICAL ||
            forCaseStudy
              ? { width: '100%' }
              : { width: '100%', marginTop: '10px' }
          }
          key={key}
          className={`${showRequiment ? 'pointer-events-none' : ''}`}
        >
          {question_data?.response_option === RESPONSE_OPTION.WORD ? (
            <HookFormEditor
              control={control}
              name={name}
              math={true}
              height={500}
              placeholder="Your answer here"
              defaultValue={defaultValue}
              disabled={
                fullData?.done ||
                fullData?.confirmed ||
                fullData?.data?.confirmed
              }
              handleChange={() => handleChange && handleChange(data?.id)}
              // externalRef={externalRef}
            />
          ) : question_data.response_option === RESPONSE_OPTION.SHEET ? (
            <div
              className={`${fullData?.done || fullData?.confirmed || fullData?.data?.confirmed ? 'pointer-events-none opacity-100' : ''} h-[500px] w-full border`}
            >
              <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                render={({ field: { onChange, value } }) => {
                  const isValid = (value?: string) => {
                    try {
                      if (
                        !value ||
                        isEmpty(value) ||
                        isUndefined(value) ||
                        isNull(value)
                      )
                        return false
                      JSON.parse(value)
                      return true
                    } catch {
                      return false
                    }
                  }
                  return (
                    <Workbook
                      // generateSheetId={() => name}
                      ref={refSheet}
                      // column={2}
                      // row={2}

                      onChange={(e) => {
                        if (!fullData?.done && !fullData?.confirmed) {
                          const currentSheet = refSheet.current?.getSheet()
                          if (value && String(value).trim() !== '') {
                            let old = [...JSON.parse(value)]
                            const index = old.findIndex(
                              (e: any) => e.id === currentSheet.id,
                            )
                            // Check event change text of sheet
                            if (old?.[0]?.celldata?.length > 0) {
                              handleChange && handleChange(data?.id)
                            }
                            if (index >= 0) {
                              old.splice(index, 1, currentSheet)
                            } else {
                              old.push(currentSheet)
                              // setValue(name, JSON.stringify(old))
                            }
                            onChange(JSON.stringify(old))
                            // setValue(name, JSON.stringify(old))
                          } else {
                            onChange(JSON.stringify([currentSheet]))
                            // setValue(name, JSON.stringify([currentSheet]))
                          }
                        }
                      }}
                      data={
                        isValid(value)
                          ? JSON.parse(value)
                          : [
                              {
                                name: 'Sheet1',
                                // config: {
                                //   authority: {

                                //     sheet: true, //If it is 1 or true, the worksheet is protected; if it is 0 or false, the worksheet is not protected.

                                //   },
                                // },
                              },
                            ]
                      }
                      // onChange={(e) => console.log(e)}
                    />
                  )
                }}
              ></Controller>
            </div>
          ) : response_option_custom === 0 ? (
            <HookFormEditor
              control={control}
              name={name}
              // externalRef={externalRef}
              math={true}
              height={500}
              placeholder="Your answer here"
              defaultValue={defaultValue}
              disabled={
                fullData?.done ||
                fullData?.confirmed ||
                fullData?.data?.confirmed
              }
              handleChange={() => handleChange && handleChange(data?.id)}
            />
          ) : (
            <div
              className={`${fullData?.done || fullData?.confirmed || fullData?.data?.confirmed ? 'pointer-events-none opacity-100' : ''} h-[500px] w-full border`}
            >
              <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Workbook
                      // generateSheetId={() => name}
                      ref={refSheet}
                      // column={2}
                      // row={2}

                      onChange={(e) => {
                        // const celldata = e.data
                        if (!fullData?.done && !fullData?.confirmed) {
                          const currentSheet = refSheet?.current?.getSheet()
                          // // console.log(listSheet.findIndex((e:any)=>e.id === currentSheet.id),"test");
                          // // listSheet.splice(0,1)
                          // listSheet[listSheet.findIndex((e:any)=>e.id === currentSheet.id)] = {...listSheet[listSheet.findIndex((e:any)=>e.id === currentSheet.id)], celldata: currentSheet.celldata}
                          // console.log(listSheet,"test");
                          if (value) {
                            let old = [...JSON.parse(value)]
                            const index = old?.findIndex(
                              (e: any) => e?.id === currentSheet?.id,
                            )
                            // Check event change text of sheet
                            if (old?.[0]?.celldata?.length > 0) {
                              handleChange && handleChange(data?.id)
                            }
                            if (index >= 0) {
                              old.splice(index, 1, currentSheet)
                            } else {
                              old.push(currentSheet)
                              // setValue(name, JSON.stringify(old))
                            }
                            onChange(JSON.stringify(old))
                            // setValue(name, JSON.stringify(old))
                          } else {
                            onChange(JSON.stringify([currentSheet]))
                            // setValue(name, JSON.stringify([currentSheet]))
                          }
                        }
                      }}
                      data={
                        value && String(value).trim() !== ''
                          ? JSON.parse(value)
                          : [
                              {
                                name: 'Sheet1',
                              },
                            ]
                      }
                      // onChange={(e) => console.log(e)}
                    />
                  )
                }}
              ></Controller>
            </div>
          )}
          {(fullData?.confirmed ||
            fullData?.done ||
            fullData?.data?.confirmed) &&
            (fullData?.solution || data?.explanation?.trim()) && (
              <div className="mb-11 mt-8 bg-gray-4 p-4">
                <div className="font-semibold">Solution</div>
                <EditorReader
                  text_editor_content={
                    data?.explanation ??
                    fullData?.solution ??
                    fullData?.data?.solution ??
                    ''
                  }
                  className="mt-4"
                />
              </div>
            )}
        </div>
      </>
    </div>
  )
}
export default memo(EssayQuestionPreview)
