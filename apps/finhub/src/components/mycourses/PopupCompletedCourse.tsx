import { IRibbon } from '@assets/icons'
import { EditorReader } from '@lms/ui'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { hidePopup } from 'src/redux/slice/Popup/Result-test'

interface IProps {}

const PopupCert = ({}: IProps) => {
  const dispatch = useAppDispatch()
  const selector = useAppSelector((state) => state.popupReducer)

  const onClickBackCourse = () => {
    dispatch({ type: hidePopup })
  }
  const ContentCompleted = () => {
    return (
      <EditorReader
        text_editor_content={selector?.content}
        className="content-course text-center text-sm text-gray-800 md:text-base"
      />
    )
  }

  return (
    <ShortCourseModal
      open={selector.is_open}
      okButtonCaption="Back"
      showCancelButton={false}
      handleCancel={onClickBackCourse}
      onOk={onClickBackCourse}
      fullWidthBtn={true}
      buttonSize="medium"
      icon={<IRibbon />}
      header="Congratulation"
      content={<ContentCompleted />}
      maskClosable={false}
    />
  )
}

export default PopupCert
