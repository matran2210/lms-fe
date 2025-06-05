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

  const onClickBackCourse = () => {
    dispatch({ type: hidePopup })
  }

  return (
    <SappModalV2
      title={undefined}
      open={selector.is_open}
      handleCancel={onClickBackCourse}
      onOk={onClickBackCourse}
      // showCancelButton={true}
      size="max-w-[646px]"
      footerButtonClassName="flex flex-col-reverse gap-8"
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
      scrollbale={false}
      confirmOnclose={false}
      okButtonCaption={'Back'}
      // cancelButtonCaption="Back"
      handleClose={onClickBackCourse}
      showOkButton
    >
      <div className="mx-auto mb-6 flex w-max items-center justify-center rounded-full bg-secondary p-8">
        <IRibbon />
      </div>
      <div className="text-center text-2xl font-semibold text-[#050505] md:text-4xl">
        Congratulations
      </div>

      <EditorReader
        text_editor_content={selector?.content}
        className="content-course mt-4 px-1 text-center text-sm text-[#A1A1A1]"
      />
    </SappModalV2>
  )
}

export default PopupCert
