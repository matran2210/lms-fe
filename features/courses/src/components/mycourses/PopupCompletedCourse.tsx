import { IRibbon } from '@lms/assets'
import { hidePopup, useFeature } from '@lms/contexts'
import { EditorReader, SappModalV3 } from '@lms/ui'

const PopupCert = () => {
  const { dispatch, useAppSelector } = useFeature()
  const selector = useAppSelector?.((state) => state.popupReducer)

  const onClickBackCourse = () => {
    dispatch?.({ type: hidePopup })
  }

  return (
    <SappModalV3
      title={undefined}
      open={!!selector?.is_open}
      handleCancel={onClickBackCourse}
      onOk={onClickBackCourse}
      fullWidthBtn={true}
      buttonSize="medium"
      okButtonCaption={'Back'}
      handleClose={onClickBackCourse}
      showOkButton
    >
      <div className="mx-auto mb-6 flex items-center justify-center md:mb-10">
        <IRibbon />
      </div>
      <div className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 md:text-[32px]">
        Congratulation
      </div>

      <EditorReader
        text_editor_content={selector?.content}
        className="content-course text-center text-sm text-gray-800 md:text-base"
      />
    </SappModalV3>
  )
}

export default PopupCert
