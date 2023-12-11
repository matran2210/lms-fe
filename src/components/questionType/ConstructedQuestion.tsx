import React from 'react'
import { DISPLAY_TYPE, RESPONSE_OPTION } from 'src/constants'
import HookFormEditor from '@components/base/editor/HookFormEditor'
// import SpreadsheetEditor from '@components/base/spreadSheet/SpreadSheetEditor'
import dynamic from 'next/dynamic'
import EditorReader from '@components/base/editor/EditorReader'
export type IPreviewProp = {
  data: any
  question_content: string
  index: number
  question_data: any
  control: any
}
const EssayQuestionPreview = ({
  data,
  question_content,
  index,
  question_data,
  control,
}: IPreviewProp) => {
  // const DynamicBundledEditor = dynamic(() => import('../base/spreadSheet/SpreadSheetEditor'), {
  //   ssr: false,
  // })
  //   const { control } = useForm()
  if (data) {
    return (
      <React.Fragment>
        <div style={{ background: 'white' }}>
          <EditorReader
            className="sapp-questions"
            text_editor_content={question_content}
          />
          <div>
            <div className="sapp-questions-essay">{`Requirement : ${data.name}`}</div>
            <EditorReader
              className="editor-wrap"
              // className="questions"
              // style={{ borderBottom: "4px solid #F2F2F2" }}
              text_editor_content={data.description}
            />
          </div>
          {question_data.display_type === DISPLAY_TYPE.VERTICAL && (
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
                  <div className="title-btn-preview">Choose file to upload</div>
                </div>
              </div>
              {question_data.display_type === DISPLAY_TYPE.VERTICAL && (
                <div className="sapp-seprate-line-preview"></div>
              )}
            </React.Fragment>
          )}
          <div
            style={
              question_data.display_type === DISPLAY_TYPE.VERTICAL
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
              <></>
            )}
          </div>
        </div>
      </React.Fragment>
    )
  } else {
    return null
  }
}
export default EssayQuestionPreview
