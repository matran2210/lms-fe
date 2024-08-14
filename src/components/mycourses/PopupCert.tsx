import { IRibbon } from '@assets/icons'
import EditorReader from '@components/base/editor/EditorReader'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { isEmpty } from 'lodash'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { hidePopup } from 'src/redux/slice/Popup/Result-test'

interface IProps {}

const PopupCert = ({}: IProps) => {
  const dispatch = useAppDispatch()
  const selector = useAppSelector((state) => state.popupReducer)
  const onClickCertificate = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${selector?.content?.user_certificate?.id}`,
      '_blank',
    )
  }

  const onClickBackCourse = () => {
    dispatch({ type: hidePopup })
  }

  return (
    <SappModalV2
      title={undefined}
      open={selector.is_open}
      handleCancel={onClickBackCourse}
      onOk={
        !isEmpty(selector?.content?.user_certificate?.id)
          ? onClickCertificate
          : onClickBackCourse
      }
      showCancelButton={!isEmpty(selector?.content?.user_certificate?.id)}
      size="max-w-[646px]"
      footerButtonClassName="flex flex-col-reverse gap-8"
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
      scrollbale={false}
      confirmOnclose={false}
      okButtonCaption={
        !isEmpty(selector?.content?.user_certificate?.id)
          ? 'View your Certificate'
          : 'Back'
      }
      cancelButtonCaption="Back"
      handleClose={onClickBackCourse}
      showOkButton
    >
      <div className="mx-auto mb-6 flex w-max items-center justify-center rounded-full bg-secondary p-8">
        <IRibbon />
      </div>
      <div className="text-2xl md:text-4xl text-bw-1 font-semibold text-center">
        {selector?.content?.content?.title}
      </div>

      <EditorReader
        text_editor_content={selector?.content?.content?.content}
        className="text-medium-sm text-gray-1 text-center mt-4 px-1 content-course"
      />
    </SappModalV2>
  )
}

export default PopupCert
