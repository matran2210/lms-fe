import { IconBuildingModify } from '@lms/assets'
import { ECourseProgram } from '@lms/core'
import { SappModalV3 } from '@lms/ui'
import { onLinkSocial } from '@lms/utils'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { CoursesAPI } from 'src/api/courses'

interface SurveyModalProps {
  class_code?: string
  program: CourseProgram
  data: Record<string, any>
}

interface SurveyState {
  middtermCourse: boolean
  finalCourse: boolean
  completeCourse: boolean
  ldCourse?: boolean
}

const SURVEY_URLS = {
  ACCA: 'https://survey.hsforms.com/1qDp92jBgQceLUHWjcZ6fxg120xb',
  CFA: 'https://survey.hsforms.com/11oHaCszKRTiIQSsnErE57g120xb',
  CMA: 'https://survey.hsforms.com/1g3K5gl5hSFeJCtVFfFfc2g120xb',
  CERT_DIP: 'https://survey.hsforms.com/1jWWomyiBS4OBiaDF7rG4CQ120xb',
}

const SURVEY_URLS_COMPLETE = {
  ACCA: 'https://survey.hsforms.com/19aFy9lTvSs6rISvymAngCw120xb',
  CFA: 'https://survey.hsforms.com/1JUWK7CYAQc-_dkACNB-NnQ120xb',
  CMA: 'https://survey.hsforms.com/1hqLZ4gS-Rh-5Vv1Nig3QJA120xb',
  CERT_DIP: 'https://survey.hsforms.com/140B1nhjYSmaP0uQ-A7oFKQ120xb',
}

const SURVEY_ICONS = {
  middtermCourse: <IconBuildingModify />,
  finalCourse: <IconBuildingModify />,
  completeCourse: <IconBuildingModify />,
  ldCourse: <IconBuildingModify />,
}

const SURVEY_TITLES = {
  middtermCourse: 'Khảo sát phản hồi giữa khóa',
  finalCourse: 'Khảo sát phản hồi cuối khóa',
  completeCourse: 'Hoàn thành khảo sát để khép lại hành trình!',
  ldCourse: 'Bạn đã tham gia khóa học',
}

type CourseProgram =
  | ECourseProgram.ACCA
  | ECourseProgram.CERT_DIP
  | ECourseProgram.CFA
  | ECourseProgram.CMA
  | ECourseProgram.LD

const PopupModalTest: React.FC<SurveyModalProps> = ({
  class_code,
  program,
  data,
}) => {
  const convertCertDip = (input: string) => {
    if (!input) return ''
    return input.replace(/\//g, '_').toUpperCase()
  }

  const [open, setOpen] = useState<SurveyState>({
    middtermCourse: false,
    finalCourse: false,
    completeCourse: false,
    ldCourse: false,
  })
  const isLDProgram = program === ECourseProgram.LD
  const progress = data?.survey_attributes?.progress_percent

  const completeMiddterm = progress >= 0.5 && progress < 0.6

  const completeFinal = progress >= 0.6 && progress <= 1

  const params = useParams()
  const { courseId } = params
  /**
   * Xác định loại khảo sát hiện tại dựa trên trạng thái
   */
  const getSurveyType = () => {
    if (isLDProgram) return 'ldCourse'
    if (open.middtermCourse) return 'middtermCourse'
    if (open.finalCourse) return 'finalCourse'
    return 'completeCourse'
  }

  /**
   * Xử lý khi người dùng submit khảo sát
   * Chuyển hướng đến form khảo sát tương ứng với chương trình
   */
  const handleSubmit = () => {
    let surveyUrl = completeMiddterm
      ? SURVEY_URLS[
          convertCertDip(program) as
            | ECourseProgram.ACCA
            | ECourseProgram.CERT_DIP
            | ECourseProgram.CFA
            | ECourseProgram.CMA
        ]
      : SURVEY_URLS_COMPLETE[
          convertCertDip(program) as
            | ECourseProgram.ACCA
            | ECourseProgram.CERT_DIP
            | ECourseProgram.CFA
            | ECourseProgram.CMA
        ]
    if (isLDProgram) {
      surveyUrl = 'https://survey.hsforms.com/1n9Xo8sKjQ9u2a7h0r3z8CQ120xb'
    }
    onLinkSocial(surveyUrl)
  }

  /**
   * Xử lý khi người dùng hoàn thành khảo sát
   */
  const handleCompleteSurvey = async () => {
    await CoursesAPI.changeSurvey(courseId, {
      is_disabled: true,
    })
  }

  /**
   * Xử lý khi người dùng muốn nhắc lại khảo sát sau
   */
  const handleRemindSurvey = async () => {
    await CoursesAPI.changeSurvey(courseId, {
      remind_late: true,
    })
  }

  /**
   * Xử lý đóng modal
   */
  const handleClose = () => {
    handleRemindSurvey()
  }

  const handleTest = () => {
    setOpen({
      middtermCourse: false,
      finalCourse: false,
      completeCourse: false,
      ldCourse: false,
    })
  }

  /**
   * Xử lý khi người dùng xác nhận đã hoàn thành khảo sát
   */
  const handleConfirmComplete = () => {
    handleCompleteSurvey()
  }

  /**
   * Nội dung khảo sát cho từng loại
   */
  const SURVEY_CONTENTS = {
    middtermCourse: (
      <span>
        Chúc mừng bạn đã hoàn thành{' '}
        <span className="text-sm font-medium text-gray-800">50%</span> lớp học{' '}
        <span className="text-sm font-medium text-gray-800">{class_code}</span>.
        Tại SAPP Academy, chúng tôi luôn nỗ lực mang đến trải nghiệm học tập tốt
        nhất. Hãy dành 2 phút để chia sẻ cảm nhận của bạn – những đóng góp quý
        giá này sẽ giúp chúng tôi nâng cao chất lượng khóa học và dịch vụ học
        tập. Cảm ơn bạn đã đồng hành cùng chúng tôi!
      </span>
    ),
    finalCourse: (
      <span>
        Bạn đã đi đến chặng đường cuối cùng của lớp học{' '}
        <span className="text-sm font-medium text-gray-800">{class_code}</span>!
        Trong suốt hành trình vừa qua, chắc hẳn bạn đã có những trải nghiệm đáng
        nhớ về nội dung khóa học cũng như dịch vụ hỗ trợ. Để SAPP Academy thấu
        hiểu và không ngừng nâng cao chất lượng đào tạo, chúng tôi rất mong nhận
        được phản hồi từ bạn. Chỉ với 2 phút, đóng góp của bạn sẽ giúp chúng tôi
        cải thiện chất lượng khóa học và mang đến trải nghiệm học tập tốt hơn
        cho các học viên sau. Cảm ơn bạn đã đồng hành cùng chúng tôi!
      </span>
    ),
    completeCourse: (
      <span>
        Chúng tôi thực sự trân trọng những đóng góp của bạn! Nếu bạn chưa hoàn
        thành khảo sát, đây là cơ hội để chia sẻ suy nghĩ và giúp chúng tôi nâng
        cao chất lượng khóa học. Chỉ mất 2 phút, nhưng ý kiến của bạn sẽ tạo ra
        giá trị lâu dài! Cảm ơn bạn đã đồng hành cùng SAPP Academy!
      </span>
    ),
    ldCourse: (
      <span>
        Trong quá trình học, bộ phận L&D mong muốn lắng nghe kỳ vọng và nhu cầu
        của bạn để có thể đồng hành và hỗ trợ tốt hơn trong suốt khóa học. Chỉ
        với vài phút, phản hồi của bạn sẽ giúp chúng tôi nâng cao chất lượng đào
        tạo và mang đến trải nghiệm học tập phù hợp hơn. Cảm ơn bạn đã đồng hành
        cùng chúng tôi!
      </span>
    ),
  }

  /**
   * Xử lý hiển thị modal dựa trên tiến độ học tập
   */
  useEffect(() => {
    // if (
    //   data?.class_type !== 'LESSON' ||
    //   !data?.survey_attributes?.is_survey_popup ||
    //   ![
    //     ECourseProgram.ACCA,
    //     ECourseProgram.CERT_DIP,
    //     ECourseProgram.CFA,
    //     ECourseProgram.CMA,
    //   ].includes(convertCertDip(program) as ECourseProgram)
    // )
    //   return
    if (isLDProgram) {
      setOpen({
        middtermCourse: false,
        finalCourse: false,
        completeCourse: false,
        ldCourse: true,
      })
    } else if (completeFinal) {
      setOpen({
        middtermCourse: false,
        finalCourse: true,
        completeCourse: false,
      })
    } else if (completeMiddterm) {
      setOpen({
        middtermCourse: true,
        finalCourse: false,
        completeCourse: false,
      })
    }
  }, [data])

  const surveyType = getSurveyType()

  const isSurveyActive =
    open.middtermCourse ||
    open.finalCourse ||
    open.completeCourse ||
    open.ldCourse

  const ContentModalTest = () => {
    return (
      <div className="justify-center self-stretch text-center">
        <span className="text-base font-normal leading-normal text-gray-800">
          {SURVEY_CONTENTS[surveyType]}
        </span>
      </div>
    )
  }

  return (
    <SappModalV3
      handleClose={handleTest}
      open={isSurveyActive}
      handleCancel={handleClose}
      onOk={open.completeCourse ? handleConfirmComplete : handleSubmit}
      icon={SURVEY_ICONS[surveyType]}
      header={`${SURVEY_TITLES[surveyType]} ${isLDProgram ? data?.data?.name : ''}`}
      content={<ContentModalTest />}
      showFooter
      okButtonCaption={
        open.completeCourse ? 'Tôi đã hoàn thành' : 'Thực hiện khảo sát'
      }
      fullWidthBtn
      buttonSize="medium"
      cancelButtonCaption={
        open.completeCourse ? 'Tôi sẽ làm sau' : 'Nhắc lại sau'
      }
      headerClassName="text-center"
      isUnderLine
      isOnCancel={false}
    />
  )
}

export default PopupModalTest
