'use client'
import { IconBuildingModify } from '@lms/assets'
import { ECourseProgram, ISurveyCustom } from '@lms/core'
import { SappModalV3 } from '@lms/ui'
import { onLinkSocial } from '@lms/utils'
import { useParams } from 'next/navigation'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { CoursesAPI } from 'src/api/courses'
import ListSurveyLD from './ListSurveyLD'

interface SurveyModalProps {
  class_code?: string
  program: CourseProgram
  data: Record<string, any>
  listSurvey?: ISurveyCustom[]
  refetchSurvey: () => void
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
  ldCourse: 'Khảo sát phản hồi khóa học',
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
  listSurvey,
  refetchSurvey,
}) => {
  const params = useParams()
  const { courseId } = params
  const convertCertDip = (input: string) => {
    if (!input) return ''
    return input.replace(/\//g, '_').toUpperCase()
  }
  const percentComplete = Number(
    // Học viên đã hoàn thành được bao nhiêu % làm tròn 1 số thập phân
    (
      (data?.learning_progress?.total_course_sections_completed /
        (data?.learning_progress?.total_course_sections || 1)) *
      100
    ).toFixed(1),
  )
  const keyLS = 'remind-survey-ld'
  const [isRemindSurveyLD, setIsRemindSurveyLD] = useState(false)

  const [open, setOpen] = useState<SurveyState>({
    middtermCourse: false,
    finalCourse: false,
    completeCourse: false,
    ldCourse: false,
  })
  const [surveyId, setSurveyId] = useState<string>()
  const isLDProgram = program === ECourseProgram.LD
  const listSurveySatisfy = useMemo(() => {
    return (listSurvey || []).filter((item) => {
      if (item.setting.show_by_progress) {
        // nếu là show_by_progress thì so sánh với phần trăm hoàn thành
        const progress = Number(item.setting.show_by_progress)
        return progress && percentComplete >= progress
      } else if (item.setting.show_after_start_date) {
        // nếu là show_after_start_date thì so sánh với số ngày sau khi bắt đầu
        const afterStartDate = Number(item.setting.show_after_start_date)
        const startDate = data?.class?.started_at
        if (startDate) {
          const startedAt = new Date(startDate)
          const now = new Date()
          // lấy số mili giây chênh lệch
          const diffTime = now.getTime() - startedAt.getTime()
          // đổi sang số ngày
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
          return diffDays >= afterStartDate
        }
        return false
      }
      return false
    })
  }, [listSurvey, percentComplete, data?.class?.started_at])

  const progress = data?.survey_attributes?.progress_percent

  const completeMiddterm = progress >= 0.5 && progress < 0.6

  const completeFinal = progress >= 0.6 && progress <= 1

  /**
   * Xác định loại khảo sát hiện tại dựa trên trạng thái
   */
  const getSurveyType = () => {
    if (isLDProgram) return 'ldCourse'
    if (open.middtermCourse) return 'middtermCourse'
    if (open.finalCourse) return 'finalCourse'
    return 'completeCourse'
  }

  const handleConfirmSurvey = async () => {
    try {
      handleClose
      if (!courseId || !surveyId) return
      const res = await CoursesAPI.confirmSurvey(courseId as string, {
        survey_id: surveyId,
      })
      if (res?.success) refetchSurvey()
    } catch (error) {
      // handle error
    }
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
      surveyUrl =
        listSurveySatisfy?.find((item) => item.id === surveyId)?.url || ''
      handleConfirmSurvey()
    } else {
      setOpen({
        middtermCourse: false,
        finalCourse: false,
        completeCourse: true,
      })
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
    if (isLDProgram) {
      if (!courseId) return
      const current = localStorage.getItem(keyLS)

      const list = current ? current.split(',') : []

      // tránh bị duplicate
      if (!list.includes(courseId as string)) {
        list.push(courseId as string)
        localStorage.setItem(keyLS, list.join(','))
        handleTest()
      }
    } else {
      handleRemindSurvey()
      setOpen({
        middtermCourse: false,
        finalCourse: false,
        completeCourse: false,
      })
    }
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
    setOpen({
      middtermCourse: false,
      finalCourse: false,
      completeCourse: false,
    })
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
        Trong quá trình học, bộ phận L&amp;D mong muốn lắng nghe kỳ vọng và nhu
        cầu của bạn để có thể đồng hành và hỗ trợ tốt hơn trong suốt khóa học.
        Chỉ với vài phút, phản hồi của bạn sẽ giúp chúng tôi nâng cao chất lượng
        đào tạo và mang đến trải nghiệm học tập phù hợp hơn. Cảm ơn bạn đã đồng
        hành cùng chúng tôi!
      </span>
    ),
  }

  /**
   * Xử lý hiển thị modal dựa trên tiến độ học tập
   */
  useEffect(() => {
    if (
      data?.class_type !== 'LESSON' ||
      !data?.survey_attributes?.is_survey_popup ||
      ![
        ECourseProgram.ACCA,
        ECourseProgram.CERT_DIP,
        ECourseProgram.CFA,
        ECourseProgram.CMA,
      ].includes(convertCertDip(program) as ECourseProgram)
    )
      return

    if (completeFinal) {
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

  useEffect(() => {
    if (!isLDProgram) return
    const shouldOpenLD =
      isLDProgram && listSurveySatisfy?.length > 0 && !isRemindSurveyLD

    setOpen({
      middtermCourse: false,
      finalCourse: false,
      completeCourse: false,
      ldCourse: shouldOpenLD,
    })
  }, [listSurveySatisfy, isLDProgram, isRemindSurveyLD])

  const surveyType = getSurveyType()

  const isSurveyActive =
    open.middtermCourse ||
    open.finalCourse ||
    open.completeCourse ||
    open.ldCourse

  useEffect(() => {
    if (!courseId) return
    const value =
      localStorage
        .getItem(keyLS)
        ?.split(',')
        .includes(courseId as string) ?? false

    setIsRemindSurveyLD(value)
  }, [courseId])

  const ContentModalTest = () => {
    return (
      <div className="justify-center self-stretch text-center">
        {isLDProgram && (
          <div>
            Bạn đã tham gia khóa học{' '}
            <span className="text-base font-semibold text-gray-800">
              {data?.data?.name}!
            </span>
          </div>
        )}
        <span className="text-base font-normal leading-normal text-gray-800">
          {SURVEY_CONTENTS[surveyType]}
        </span>
        {isLDProgram && (
          <ListSurveyLD
            listSurvey={listSurveySatisfy}
            onSurveyChange={setSurveyId}
          />
        )}
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
      header={SURVEY_TITLES[surveyType]}
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
      isValidated={listSurveySatisfy && listSurveySatisfy?.length > 0}
    />
  )
}

export default PopupModalTest
