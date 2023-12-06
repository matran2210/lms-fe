import React from 'react'
import { DISPLAY_TYPE, RESPONSE_OPTION } from 'src/constants'
import HookFormEditor from '@components/base/editor/HookFormEditor'
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
  //   const { control } = useForm()
  if (data) {
    return (
      <React.Fragment>
        <div style={{ background: 'white' }}>
          <div
            className="sapp-questions"
            dangerouslySetInnerHTML={{ __html: question_content }}
          ></div>
          <div>
            <div className="sapp-questions-essay">{`Requirement : ${data.name}`}</div>
            <div
              className="editor-wrap"
              // className="questions"
              // style={{ borderBottom: "4px solid #F2F2F2" }}
              dangerouslySetInnerHTML={{ __html: data.description }}
            ></div>
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
              // <SpreadsheetEditor />
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
