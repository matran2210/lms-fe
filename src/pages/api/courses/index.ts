import { fetcher } from 'src/services/request'

export const getCourse = () => {
  return fetcher(`courses?page_index=1&page_size=10`)
}

export const getCoursePartDetail = (id: string | undefined) => {
  return fetcher(`https://lms-sapp.merket.io/api/v1/course-sections/${id}`)
}

export const getCourseLearningOutcome = (id: string | undefined) => {
  return fetcher(`https://lms-sapp.merket.io/api/v1/course_learning_outcomes/${id}`)
}
