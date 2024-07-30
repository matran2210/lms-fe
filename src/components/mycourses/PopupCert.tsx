import React from 'react'
import EditorReader from '@components/base/editor/EditorReader'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { useRouter } from 'next/router'
import { ICert } from 'src/type'
import { isEmpty } from 'lodash'
import { IRibbon } from '@assets/icons'

interface IProps {
  open: boolean
  onCancel: () => void
  dataStudent: ICert | undefined
}

const PopupCert = ({ dataStudent, onCancel, open }: IProps) => {
  const router = useRouter()

  const onClickCertificate = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${dataStudent?.payload?.certificate_id}`,
      '_blank',
    )
  }

  const onClickBackCourse = () => {
    onCancel()
    router.push(localStorage.getItem('courseDetail') || '')
  }

  return (
    <SappModalV2
      title={undefined}
      open={open}
      handleCancel={onClickBackCourse}
      onOk={
        !isEmpty(dataStudent?.payload?.certificate_id)
          ? onClickCertificate
          : onClickBackCourse
      }
      showCancelButton={!isEmpty(dataStudent?.payload?.certificate_id)}
      size="max-w-[646px]"
      footerButtonClassName="flex flex-col-reverse gap-8"
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
      scrollbale={false}
      confirmOnclose={false}
      okButtonCaption={
        !isEmpty(dataStudent?.payload?.certificate_id)
          ? 'View your Certificate'
          : 'Back'
      }
      cancelButtonCaption="Back"
      handleClose={onClickBackCourse}
      showOkButton
    >
      <div className="p-8 rounded-full bg-secondary flex items-center justify-center w-max mx-auto mb-6">
        <IRibbon />
      </div>
      <div className="text-2xl md:text-4xl text-bw-1 font-semibold text-center">
        {dataStudent?.payload?.title}
      </div>

      <EditorReader
        text_editor_content={dataStudent?.payload?.content}
        className="text-medium-sm text-gray-1 text-center mt-4 px-1 content-course"
      />
    </SappModalV2>
  )
}

export default PopupCert
