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
  /**
   * @description lấy giá trị của router
   */
  const router = useRouter()

  /**
   * @description lấy state trong context
   */
  const {
    setCourseType,
    courseType,
    setOpenPopupCongrats,
    openPopupCongrats,
    scoreQuestion,
    submitTest,
    setSubmitTest,
  } = useCourseContext()

  /**
   * @description biến này check xem có điểm có pass khóa Foundation hay không?
   */
  const passFoundation = scoreQuestion >= quiz?.required_percent_score

  /**
   * @description set type của khóa học khi lần đầu tiên vào màn Course Detail
   */
  useEffect(() => {
    setCourseType(course_type)
  }, [])

  /**
   * @description mở popup khi khóa là Foundation và submit bài Final Test
   */
  useEffect(() => {
    if (courseType === 'FOUNDATION_COURSE' && submitTest) {
      setOpenPopupCongrats(true)
    } else {
      setOpenPopupCongrats(false)
    }
  }, [courseType, submitTest])

  /**
   * @description function đóng popup và set lại state submit bài test
   */
  const handleClosePopup = () => {
    setSubmitTest(false)
    setOpenPopupCongrats(false)
  }

  return (
    <SappModalV2
      open={openPopupCongrats}
      okButtonCaption={passFoundation ? 'View Results' : 'Quit'}
      onOk={() => {
        router.replace(
          `${
            passFoundation
              ? `/courses/test/test-result/${quiz?.attempt?.id}`
              : `/courses/my-course/${router.query.courseId}`
          }`,
        )
        handleClosePopup()
      }}
      showCancelButton={passFoundation}
      showOkButton={true}
      showHeader={false}
      size="max-w-[646px]"
      footerButtonClassName="flex flex-col-reverse gap-6"
      childClass="flex flex-col justify-center items-center"
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
      title={undefined}
      cancelButtonCaption="Quit"
      handleCancel={handleClosePopup}
    >
      <div className="flex justify-center">
        <div
          className="rounded-full bg-secondary p-8"
          style={{ width: 'fit-content' }}
        >
          <IconCongrats />
        </div>
      </div>
      <div className="mt-6 flex justify-center text-4xl font-semibold text-[#050505]">
        Congratulations
      </div>
      <div className="mb-3 mt-4 text-center">
        <span className="mb-3 mt-4 text-center text-sm font-normal text-[#A1A1A1]">
          Congratulations on completing the Final Test of
        </span>
        <span className="mb-3 ms-1 mt-4 text-center text-sm font-semibold text-[#050505]">
          {name}
        </span>
        <span className="mb-3 ms-1 mt-4 text-center text-sm font-normal text-[#A1A1A1]">
          with a score of
        </span>
        <span className="mb-3 ms-1 mt-4 text-center text-sm font-semibold text-[#050505]">
          {scoreQuestion}
        </span>
        <span className="mb-3 mt-4 text-center text-sm font-normal text-[#A1A1A1]">
          . The system will calculate your overall grade for this course and
          return it to you via Email shortly.
        </span>
      </div>
    </SappModalV2>
  )
}

export default ModalCongrats
