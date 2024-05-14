import { IconCongrats } from '@assets/icons'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { useCourseContext } from '@contexts/index'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

interface IProps {
  name: string
  course_type: string
  quiz: {
    required_percent_score: number
    attempt: {
      id: string
    }
  }
}

const ModalCongrats = ({ name, course_type, quiz }: IProps) => {
  const router = useRouter()
  const {
    setCourseType,
    courseType,
    setOpenPopupCongrats,
    openPopupCongrats,
    scoreQuestion,
    setScoreQuestion,
  } = useCourseContext()

  useEffect(() => {
    setCourseType(course_type)
  }, [])

  useEffect(() => {
    if (courseType && scoreQuestion >= quiz?.required_percent_score) {
      setOpenPopupCongrats(true)
    } else {
      setOpenPopupCongrats(false)
    }
  }, [courseType])

  return (
    <SappModalV2
      open={openPopupCongrats}
      okButtonCaption="View Your Result"
      onOk={() => {
        router.replace(`/courses/test/test-result/${quiz?.attempt?.id}`)
        setScoreQuestion(0)
        setOpenPopupCongrats(false)
      }}
      showCancelButton={true}
      showHeader={false}
      size="max-w-[646px]"
      footerButtonClassName="flex flex-col-reverse gap-6"
      childClass="flex flex-col justify-center items-center"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
      title={undefined}
      cancelButtonCaption="Back to My Course"
      handleCancel={() => {
        router.replace('/courses')
        setScoreQuestion(0)
        setOpenPopupCongrats(false)
      }}
    >
      <div className="flex justify-center">
        <div
          className="p-8 rounded-full bg-secondary"
          style={{ width: 'fit-content' }}
        >
          <IconCongrats />
        </div>
      </div>
      <div className="text-bw-1 text-4xl font-semibold mt-6 flex justify-center">
        Congrats
      </div>
      <div className="text-center mt-4 mb-3">
        <span className="text-gray-1 text-medium-sm font-normal mt-4 mb-3 text-center">
          Congratulations on completing{' '}
        </span>
        <span className="text-bw-1 text-medium-sm font-normal mt-4 mb-3 text-center">
          {name}
        </span>
      </div>
    </SappModalV2>
  )
}

export default ModalCongrats
