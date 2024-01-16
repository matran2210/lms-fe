import HookFormEditor from '@components/base/editor/HookFormEditor'
import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react'
import { DISPLAY_TYPE, RESPONSE_OPTION } from 'src/constants'
// import SpreadsheetEditor from '@components/base/spreadSheet/SpreadSheetEditor'
import EditorReader from '@components/base/editor/EditorReader'
import { DeserializeHighlight, runHighlight } from '@utils/index'
import { Workbook } from '@fortune-sheet/react'
import '@fortune-sheet/react/dist/index.css'
import { Controller } from 'react-hook-form'
import { uniqueId } from 'lodash'
import { IResource } from 'src/type/courses'
import { UploadAPI } from 'src/pages/api/upload'
import { CloseIcon, UploadIcon } from '@assets/icons'
import PopupViewPdf from '@components/base/pdf/popupViewPdf'
export type IPreviewProp = {
  data: any
  question_content: string
  index: number
  question_data: any
  control: any
  name: string
  handleSaveHighLight?: any
  highlighted?: any
  removeHighlight?: any
  allowHighLight?: boolean
  forCaseStudy?: boolean
  solution?: string
  setValue?: any
  defaultValue?: any
  response_option_custom?: any
  externalRef?: any
  fullData: any
  openChooseFile?: any
  handleClearFile?: any
}
const EssayQuestionPreview = ({
  data,
  question_content,
  index,
  question_data,
  control,
  handleSaveHighLight,
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
}: IPreviewProp) => {
  // console.log(response_option_custom)
  const [key, setKey] = useState<string>('1')
  const refSheet = useRef(null) as any
  const inputRef = useRef(null) as any
  const [openPdf, setOpenPdf] = useState<{ status: boolean; url: string }>()
  useEffect(() => {
    if (question_data) {
      DeserializeHighlight(highlighted)
    }
  }, [question_data, question_content, data])
  // useEffect(()=>{
  if (externalRef) {
    externalRef.current = {
      reset: () =>
        setKey((prev) => {
          const newKey = uniqueId('key')
          return newKey
        }),
    }
  }
  const handleDownload = async (data: {
    files: { name: string; file_key: string }[]
  }) => {
    try {
      await UploadAPI.downloadFile(data)
    } catch (error) {}
  }
  // },[response_option_custom])
  return (
    <div
      key={key}
      style={{ background: 'white' }}
      id="hightlight_area"
      onMouseUp={(e: any) => {
        if (
          e.target.tagName.charAt(0) !== 'm' &&
          e.target.firstChild?.tagName !== 'math'
        ) {
          if (e) {
            runHighlight(handleSaveHighLight, allowHighLight || false)
          }
        }
      }}
    >
      <EditorReader
        className="sapp-questions"
        text_editor_content={question_content}
      />
      {data && (
        <>
          <div>
            <div className="sapp-questions-essay">{`Requirement ${
              index + 1
            } : ${data.name}`}</div>
            <EditorReader
              className="editor-wrap"
              // className="questions"
              // style={{ borderBottom: "4px solid #F2F2F2" }}
              text_editor_content={data.description}
            />
            {data?.files?.length > 0 &&
              data?.files.map((e: any, index: number) => {
                return (
                  <div
                    className="cursor-pointer text-state-info hover:underline"
                    onClick={() =>
                      setOpenPdf({ status: true, url: e.resource.url })
                    }
                    key={index}
                  >
                    {e.resource.name}
                  </div>
                )
              })}
          </div>
          {(question_data.display_type === DISPLAY_TYPE.VERTICAL ||
            forCaseStudy) && <div className="sapp-seprate-line-preview"></div>}
          {question_data.assignment_type !== 'TEXT' ? (
            !fullData.answer_file?.file_key ? (
              <React.Fragment>
                <div className="sapp-upload-file-preview">
                  <div className="title-upload-button-preview">
                    Upload file to submit:
                  </div>
                  <div className="sapp-upload-button-preview">
                    {/* <input
                      ref={inputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    /> */}
                    {/* <UploadIcon /> */}
                    <UploadIcon />
                    <div
                      className="title-btn-preview"
                      // onClick={() => inputRef.current.click()}
                      onClick={() => openChooseFile(true)}
                    >
                      Choose file to upload
                    </div>
                  </div>
                </div>
                {(question_data.display_type === DISPLAY_TYPE.VERTICAL ||
                  forCaseStudy) && (
                  <div className="sapp-seprate-line-preview"></div>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="sapp-upload-file-preview">
                  <div className="title-upload-button-preview">
                    Uploaded file:
                  </div>
                  <div
                    className="cursor-pointer text-state-info hover:underline"
                    onClick={() =>
                      handleDownload({
                        files: [
                          {
                            name: fullData.answer_file.file_name,
                            file_key: fullData.answer_file.file_key,
                          },
                        ],
                      })
                    }
                  >
                    {fullData.answer_file.file_name}
                  </div>
                  {!fullData?.done && (
                    <div
                      onClick={() => handleClearFile()}
                      className="cursor-pointer"
                    >
                      <CloseIcon />
                    </div>
                  )}
                </div>
                {(question_data.display_type === DISPLAY_TYPE.VERTICAL ||
                  forCaseStudy) && (
                  <div className="sapp-seprate-line-preview"></div>
                )}
              </React.Fragment>
            )
          ) : (
            <></>
          )}
          <div
            style={
              question_data.display_type === DISPLAY_TYPE.VERTICAL ||
              forCaseStudy
                ? { width: 'calc(100% + 20px)', marginLeft: '-20px' }
                : { width: '100%', marginTop: '10px' }
            }
          >
            {question_data.response_option === RESPONSE_OPTION.WORD ? (
              <HookFormEditor
                control={control}
                name={name}
                math={true}
                height={500}
                placeholder="Your answer here"
                defaultValue={defaultValue}
                disabled={fullData?.done}
                // externalRef={externalRef}
              />
            ) : question_data.response_option === RESPONSE_OPTION.SHEET ? (
              <div className="w-full, h-[500px]">
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
                          if (!fullData?.done) {
                            const currentSheet = refSheet.current?.getSheet()
                            if (value) {
                              let old = [...JSON.parse(value)]
                              const index = old.findIndex(
                                (e: any) => e.id === currentSheet.id,
                              )
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
                          value
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
                disabled={fullData?.done}
              />
            ) : (
              <div className="w-full, h-[500px]">
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
                          if (!fullData?.done) {
                            const currentSheet = refSheet.current?.getSheet()
                            // // console.log(listSheet.findIndex((e:any)=>e.id === currentSheet.id),"test");
                            // // listSheet.splice(0,1)
                            // listSheet[listSheet.findIndex((e:any)=>e.id === currentSheet.id)] = {...listSheet[listSheet.findIndex((e:any)=>e.id === currentSheet.id)], celldata: currentSheet.celldata}
                            // console.log(listSheet,"test");
                            if (value) {
                              let old = [...JSON.parse(value)]
                              const index = old.findIndex(
                                (e: any) => e?.id === currentSheet?.id,
                              )
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
                          value
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
          </div>
        </>
      )}
      <PopupViewPdf
        open={openPdf?.status || false}
        setOpen={setOpenPdf}
        url={openPdf?.url || ''}
      />
    </div>
  )
}
export default memo(EssayQuestionPreview)
