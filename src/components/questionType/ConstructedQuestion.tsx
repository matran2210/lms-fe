import HookFormEditor from '@components/base/editor/HookFormEditor'
import React, { useEffect } from 'react'
import { DISPLAY_TYPE, RESPONSE_OPTION } from 'src/constants'
// import SpreadsheetEditor from '@components/base/spreadSheet/SpreadSheetEditor'
import EditorReader from '@components/base/editor/EditorReader'
import { DeserializeHighlight, runHighlight } from '@utils/index'
import { Workbook } from '@fortune-sheet/react'
import '@fortune-sheet/react/dist/index.css'
export type IPreviewProp = {
  data: any
  question_content: string
  index: number
  question_data: any
  control: any
  handleSaveHighLight?: any
  highlighted?: any
  removeHighlight?: any
  allowHighLight?: boolean
  forCaseStudy?: boolean
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
}: IPreviewProp) => {
  // const DynamicBundledEditor = dynamic(() => import('../base/spreadSheet/SpreadSheetEditor'), {
  //   ssr: false,
  // })
  //   const { control } = useForm()
  useEffect(() => {
    if (question_data) {
      DeserializeHighlight(highlighted)
    }
  }, [question_data, question_content, data])

  return (
    <React.Fragment>
      <div
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
              <div className="sapp-questions-essay">{`Requirement : ${data.name}`}</div>
              <EditorReader
                className="editor-wrap"
                // className="questions"
                // style={{ borderBottom: "4px solid #F2F2F2" }}
                text_editor_content={data.description}
              />
            </div>
            {(question_data.display_type === DISPLAY_TYPE.VERTICAL ||
              forCaseStudy) && (
              <div className="sapp-seprate-line-preview"></div>
            )}
            {question_data.assignment_type !== 'TEXT' && (
              <React.Fragment>
                <div className="sapp-upload-file-preview">
                  <div className="title-upload-button-preview">
                    Upload file to submit:
                  </div>
                  <div className="sapp-upload-button-preview">
                    {/* <UploadIcon /> */}
                    <div className="title-btn-preview">
                      Choose file to upload
                    </div>
                  </div>
                </div>
                {(question_data.display_type === DISPLAY_TYPE.VERTICAL ||
                  forCaseStudy) && (
                  <div className="sapp-seprate-line-preview"></div>
                )}
              </React.Fragment>
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
                  name="editor"
                  math={true}
                  height={500}
                />
              ) : (
                // <DynamicBundledEditor />
                <div className="w-full, h-[500px]">
                  {/* <Luckysheet id={'luckySheet' + index}/> */}
                  <Workbook
                    data={[
                      {
                        name: 'Sheet1',
                        // celldata: [
                        //   {
                        //     r: 0,
                        //     c: 0,
                        //     v: {
                        //       ct: { fa: 'General', t: 'g' },
                        //       m: 'value1',
                        //       v: 'value1',
                        //     },
                        //   },
                        //   {
                        //     r: 0,
                        //     c: 1,
                        //     v: {
                        //       ct: { fa: 'General', t: 'g' },
                        //       m: 'value2',
                        //       v: 'value2',
                        //     },
                        //   },
                        // ],
                      },
                    ]}
                    // onChange={(e) => console.log(e)}
                  />
                  ,
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </React.Fragment>
  )
}
export default EssayQuestionPreview
