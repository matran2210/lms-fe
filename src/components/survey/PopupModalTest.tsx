import SappModalV2 from '@components/base/modal/SappModalV2'
import { CoursesAPI } from '@pages/api/courses'
import { onLinkSocial } from '@utils/index'
import { round } from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

interface SurveyModalProps {
  learning_progress?: number
  course_name?: string
  program?: 'CMA' | 'ACCA' | 'CFA' | undefined
  data: any
}

interface SurveyState {
  middtermCourse: boolean
  finalCourse: boolean
  completeCourse: boolean
}

const SURVEY_URLS = {
  ACCA: 'https://survey.hsforms.com/1jWWomyiBS4OBiaDF7rG4CQ120xb',
  CFA: 'https://survey.hsforms.com/1EmIZK95sTWqhk1G3ozRyIw120xb',
  CMA: 'https://survey.hsforms.com/1jlTMbpPsTaai6oKwrjEv1g120xb',
}

const SURVEY_ICONS = {
  middtermCourse: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
    >
      <path
        d="M20.894 14.828H35.624C37.312 14.828 38.468 13.124 37.842 11.556L36.224 7.50395C35.862 6.59595 34.984 6.00195 34.006 6.00195H22.51C21.534 6.00195 20.654 6.59795 20.292 7.50395L18.676 11.556C18.05 13.124 19.206 14.828 20.894 14.828Z"
        fill="#FFB800"
      />
      <path
        d="M56.3 37.5401C54.72 35.9801 52.18 35.9801 50.6 37.5401L48.896 39.2561L54.6 44.9401L56.3 43.2401C57.88 41.6601 57.88 39.1201 56.3 37.5401Z"
        fill="#FFB800"
      />
      <path
        d="M46.78 41.3799L37.02 51.1399C36.8 51.3399 36.66 51.6199 36.62 51.9199L35.86 56.3199C35.7 57.2999 36.54 58.1399 37.52 57.9799L41.94 57.2399C42.22 57.1799 42.5 57.0399 42.7 56.8399L52.48 47.0599L46.78 41.3799Z"
        fill="#FFB800"
      />
      <path
        d="M43.4 10.4199H40.618L40.628 10.4459C41.292 12.1039 41.088 13.9819 40.086 15.4619C39.084 16.9439 37.416 17.8299 35.626 17.8299H20.894C19.104 17.8299 17.436 16.9459 16.434 15.4619C15.43 13.9799 15.228 12.1039 15.89 10.4439L15.9 10.4199H13.12C9.46002 10.4199 6.52002 13.3799 6.52002 17.0199V51.3999C6.52002 55.0399 9.46002 57.9999 13.12 57.9999H33.102C32.864 57.3119 32.778 56.5739 32.898 55.8359L33.662 51.4099C33.778 50.5159 34.26 49.5899 35.002 48.9179L45.576 38.3399L48.466 35.4259C48.928 34.9699 49.45 34.6139 49.996 34.3059V17.0199C50 13.3799 47.04 10.4199 43.4 10.4199ZM18.842 43.6819H17.02C16.026 43.6819 15.22 42.8759 15.22 41.8819C15.22 40.8879 16.026 40.0819 17.02 40.0819H18.844C19.838 40.0819 20.644 40.8879 20.644 41.8819C20.644 42.8759 19.836 43.6819 18.842 43.6819ZM18.842 32.7599H17.02C16.026 32.7599 15.22 31.9539 15.22 30.9599C15.22 29.9659 16.026 29.1599 17.02 29.1599H18.844C19.838 29.1599 20.644 29.9659 20.644 30.9599C20.644 31.9539 19.836 32.7599 18.842 32.7599ZM34.962 43.6799H26.062C25.068 43.6799 24.262 42.8739 24.262 41.8799C24.262 40.8859 25.068 40.0799 26.062 40.0799H34.962C35.956 40.0799 36.762 40.8859 36.762 41.8799C36.762 42.8739 35.958 43.6799 34.962 43.6799ZM39.5 32.7599H26.058C25.064 32.7599 24.258 31.9539 24.258 30.9599C24.258 29.9659 25.064 29.1599 26.058 29.1599H39.5C40.494 29.1599 41.3 29.9659 41.3 30.9599C41.3 31.9539 40.494 32.7599 39.5 32.7599Z"
        fill="#FFB800"
      />
    </svg>
  ),
  finalCourse: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
    >
      <path
        d="M20.894 14.828H35.624C37.312 14.828 38.468 13.124 37.842 11.556L36.224 7.50395C35.862 6.59595 34.984 6.00195 34.006 6.00195H22.51C21.534 6.00195 20.654 6.59795 20.292 7.50395L18.676 11.556C18.05 13.124 19.206 14.828 20.894 14.828Z"
        fill="#FFB800"
      />
      <path
        d="M56.3 37.5401C54.72 35.9801 52.18 35.9801 50.6 37.5401L48.896 39.2561L54.6 44.9401L56.3 43.2401C57.88 41.6601 57.88 39.1201 56.3 37.5401Z"
        fill="#FFB800"
      />
      <path
        d="M46.78 41.3799L37.02 51.1399C36.8 51.3399 36.66 51.6199 36.62 51.9199L35.86 56.3199C35.7 57.2999 36.54 58.1399 37.52 57.9799L41.94 57.2399C42.22 57.1799 42.5 57.0399 42.7 56.8399L52.48 47.0599L46.78 41.3799Z"
        fill="#FFB800"
      />
      <path
        d="M43.4 10.4199H40.618L40.628 10.4459C41.292 12.1039 41.088 13.9819 40.086 15.4619C39.084 16.9439 37.416 17.8299 35.626 17.8299H20.894C19.104 17.8299 17.436 16.9459 16.434 15.4619C15.43 13.9799 15.228 12.1039 15.89 10.4439L15.9 10.4199H13.12C9.46002 10.4199 6.52002 13.3799 6.52002 17.0199V51.3999C6.52002 55.0399 9.46002 57.9999 13.12 57.9999H33.102C32.864 57.3119 32.778 56.5739 32.898 55.8359L33.662 51.4099C33.778 50.5159 34.26 49.5899 35.002 48.9179L45.576 38.3399L48.466 35.4259C48.928 34.9699 49.45 34.6139 49.996 34.3059V17.0199C50 13.3799 47.04 10.4199 43.4 10.4199ZM18.842 43.6819H17.02C16.026 43.6819 15.22 42.8759 15.22 41.8819C15.22 40.8879 16.026 40.0819 17.02 40.0819H18.844C19.838 40.0819 20.644 40.8879 20.644 41.8819C20.644 42.8759 19.836 43.6819 18.842 43.6819ZM18.842 32.7599H17.02C16.026 32.7599 15.22 31.9539 15.22 30.9599C15.22 29.9659 16.026 29.1599 17.02 29.1599H18.844C19.838 29.1599 20.644 29.9659 20.644 30.9599C20.644 31.9539 19.836 32.7599 18.842 32.7599ZM34.962 43.6799H26.062C25.068 43.6799 24.262 42.8739 24.262 41.8799C24.262 40.8859 25.068 40.0799 26.062 40.0799H34.962C35.956 40.0799 36.762 40.8859 36.762 41.8799C36.762 42.8739 35.958 43.6799 34.962 43.6799ZM39.5 32.7599H26.058C25.064 32.7599 24.258 31.9539 24.258 30.9599C24.258 29.9659 25.064 29.1599 26.058 29.1599H39.5C40.494 29.1599 41.3 29.9659 41.3 30.9599C41.3 31.9539 40.494 32.7599 39.5 32.7599Z"
        fill="#FFB800"
      />
    </svg>
  ),
  completeCourse: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
    >
      <path
        d="M20.8941 14.828H35.6241C37.3121 14.828 38.4681 13.124 37.8421 11.556L36.2241 7.50395C35.8621 6.59595 34.9841 6.00195 34.0061 6.00195H22.5101C21.5341 6.00195 20.6541 6.59795 20.2921 7.50395L18.6761 11.556C18.0501 13.124 19.2061 14.828 20.8941 14.828Z"
        fill="#FFB800"
      />
      <path
        d="M56.3 37.5401C54.72 35.9801 52.18 35.9801 50.6 37.5401L48.896 39.2561L54.6 44.9401L56.3 43.2401C57.88 41.6601 57.88 39.1201 56.3 37.5401Z"
        fill="#FFB800"
      />
      <path
        d="M46.78 41.3799L37.02 51.1399C36.8 51.3399 36.66 51.6199 36.62 51.9199L35.86 56.3199C35.7 57.2999 36.54 58.1399 37.52 57.9799L41.94 57.2399C42.22 57.1799 42.5 57.0399 42.7 56.8399L52.48 47.0599L46.78 41.3799Z"
        fill="#FFB800"
      />
      <path
        d="M43.4 10.4199H40.618L40.628 10.4459C41.292 12.1039 41.088 13.9819 40.086 15.4619C39.084 16.9439 37.416 17.8299 35.626 17.8299H20.894C19.104 17.8299 17.436 16.9459 16.434 15.4619C15.43 13.9799 15.228 12.1039 15.89 10.4439L15.9 10.4199H13.12C9.46002 10.4199 6.52002 13.3799 6.52002 17.0199V51.3999C6.52002 55.0399 9.46002 57.9999 13.12 57.9999H33.102C32.864 57.3119 32.778 56.5739 32.898 55.8359L33.662 51.4099C33.778 50.5159 34.26 49.5899 35.002 48.9179L45.576 38.3399L48.466 35.4259C48.928 34.9699 49.45 34.6139 49.996 34.3059V17.0199C50 13.3799 47.04 10.4199 43.4 10.4199ZM18.842 43.6819H17.02C16.026 43.6819 15.22 42.8759 15.22 41.8819C15.22 40.8879 16.026 40.0819 17.02 40.0819H18.844C19.838 40.0819 20.644 40.8879 20.644 41.8819C20.644 42.8759 19.836 43.6819 18.842 43.6819ZM18.842 32.7599H17.02C16.026 32.7599 15.22 31.9539 15.22 30.9599C15.22 29.9659 16.026 29.1599 17.02 29.1599H18.844C19.838 29.1599 20.644 29.9659 20.644 30.9599C20.644 31.9539 19.836 32.7599 18.842 32.7599ZM34.962 43.6799H26.062C25.068 43.6799 24.262 42.8739 24.262 41.8799C24.262 40.8859 25.068 40.0799 26.062 40.0799H34.962C35.956 40.0799 36.762 40.8859 36.762 41.8799C36.762 42.8739 35.958 43.6799 34.962 43.6799ZM39.5 32.7599H26.058C25.064 32.7599 24.258 31.9539 24.258 30.9599C24.258 29.9659 25.064 29.1599 26.058 29.1599H39.5C40.494 29.1599 41.3 29.9659 41.3 30.9599C41.3 31.9539 40.494 32.7599 39.5 32.7599Z"
        fill="#FFB800"
      />
    </svg>
  ),
}

const SURVEY_TITLES = {
  middtermCourse: 'Khảo sát phản hồi giữa khóa',
  finalCourse: 'Khảo sát phản hồi cuối khóa',
  completeCourse: 'Hoàn thành khảo sát để khép lại hành trình!',
}

const PopupModalTest: React.FC<SurveyModalProps> = ({ course_name, program, data }) => {
  const [open, setOpen] = useState<SurveyState>({
    middtermCourse: false,
    finalCourse: false,
    completeCourse: false,
  })

  const router = useRouter()

  /**
   * Xác định loại khảo sát hiện tại dựa trên trạng thái
   */
  const getSurveyType = () => {
    if (open.middtermCourse) return 'middtermCourse'
    if (open.finalCourse) return 'finalCourse'
    return 'completeCourse'
  }

  /**
   * Xử lý khi người dùng submit khảo sát
   * Chuyển hướng đến form khảo sát tương ứng với chương trình
   */
  const handleSubmit = () => {
    const surveyUrl = SURVEY_URLS[program || 'CMA']
    onLinkSocial(surveyUrl)

    setOpen({
      middtermCourse: false,
      finalCourse: false,
      completeCourse: true,
    })
  }

  /**
   * Xử lý khi người dùng hoàn thành khảo sát
   */
  const handleCompleteSurvey = async () => {
    await CoursesAPI.createTest(router?.query?.courseId, {
      is_disabled: true,
    })
  }

  /**
   * Xử lý khi người dùng muốn nhắc lại khảo sát sau
   */
  const handleRemindSurvey = async () => {
    await CoursesAPI.createTest(router?.query?.courseId, {
      remind_late: true,
    })
  }

  /**
   * Xử lý đóng modal
   */
  const handleClose = () => {
    handleRemindSurvey()
    setOpen({
      middtermCourse: false,
      finalCourse: false,
      completeCourse: false,
    })
  }

  const handleTest = () => {
    setOpen({
      middtermCourse: false,
      finalCourse: false,
      completeCourse: false,
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
        <span className="text-sm font-medium text-bw-1">
          {round(data?.survey_attributes?.progress_percent * 100, 2)}%
        </span>{' '}
        khóa học{' '}
        <span className="text-sm font-medium text-bw-1">{course_name}</span>.
        Tại SAPP Academy, chúng tôi luôn nỗ lực mang đến trải nghiệm học tập tốt
        nhất. Hãy dành 2 phút để chia sẻ cảm nhận của bạn – những đóng góp quý
        giá này sẽ giúp chúng tôi nâng cao chất lượng khóa học và dịch vụ học
        tập. Cảm ơn bạn đã đồng hành cùng chúng tôi!
      </span>
    ),
    finalCourse: (
      <span>
        Bạn đã đi đến chặng đường cuối cùng của khóa học{' '}
        <span className="text-sm font-medium text-bw-1">{course_name}</span>!
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
  }

  /**
   * Xử lý hiển thị modal dựa trên tiến độ học tập
   */
  useEffect(() => {
    if (data?.class_type !== 'LESSON' || !data?.survey_attributes?.is_survey_popup) return

    const progress = data.survey_attributes.progress_percent

    if (progress >= 0.9 && progress <= 1) {
      setOpen({
        middtermCourse: false,
        finalCourse: true,
        completeCourse: false,
      })
    } else if (progress >= 0.5 && progress < 0.9) {
      setOpen({
        middtermCourse: true,
        finalCourse: false,
        completeCourse: false,
      })
    }
  }, [data])

  const surveyType = getSurveyType()

  const isSurveyActive = open.middtermCourse || open.finalCourse || open.completeCourse

  return (
    <SappModalV2
      footerButtonClassName="flex flex-col-reverse gap-8"
      position="center"
      title={undefined}
      open={isSurveyActive}
      handleClose={handleTest}
      handleCancel={handleClose}
      onOk={open.completeCourse ? handleConfirmComplete : handleSubmit}
      okButtonCaption={open.completeCourse ? 'Tôi đã hoàn thành' : 'Thực hiện khảo sát'}
      fullWidthBtn={true}
      buttonSize="extra"
      showFooter
      cancelButtonCaption={open.completeCourse ? 'Tôi sẽ làm sau' : 'Nhắc lại sau'}
    >
      <div className="flex justify-center">
        <div className="w-fit rounded-full bg-secondary p-8">
          {SURVEY_ICONS[surveyType]}
        </div>
      </div>

      <div className="mt-6 flex justify-center text-center text-4xl font-semibold text-bw-1">
        {SURVEY_TITLES[surveyType]}
      </div>

      <div className="mb-3 mt-4 text-center text-medium-sm leading-[150%] text-gray-1">
        {SURVEY_CONTENTS[surveyType]}
      </div>
    </SappModalV2>
  )
}

export default PopupModalTest
