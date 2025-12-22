import { IQuestion, IResponse } from '@lms/core'
import request, { fetcher, getBaseUrl } from '@services/requestV2'
import axios, { AxiosResponse, CancelTokenSource } from 'axios'

type QuestionDetailQueryDTO = {
  after_test: boolean
}
type PartUploadDto = { part_number: number; upload_url: string }

type PartUploadedDto = { eTag: string; part_number: number }

type StartMultipartResponse = {
  uploadId: string
  parts: PartUploadDto[]
  metadata: {
    partSize: number
    numberOfParts: number
  }
}
const BASE_TEST_URL_API = process.env.NEXT_PUBLIC_TEST_API_URL
export class TestServiceAPI {
  // Question
  static getQuestionAnswer(id: string) {
    return fetcher(`${BASE_TEST_URL_API}/question/results`, {
      params: {
        question_ids: id,
      },
    })
  }
  static getQuestionDetail(
    questionId: string,
    query?: QuestionDetailQueryDTO,
  ): Promise<IResponse<IQuestion>> {
    return fetcher(`${BASE_TEST_URL_API}/question/${questionId}`, {
      params: query,
    })
  }

  // Quiz
  static getDetailQuizById(id: string | string[] | undefined): Promise<any> {
    return fetcher(`${BASE_TEST_URL_API}/quiz/${id}`)
  }

  static getQuestionTabsById(id: string | string[] | undefined): Promise<any> {
    return fetcher(`${BASE_TEST_URL_API}/quiz/${id}/shuffle`)
  }
  static submitAllQuestion(id: string, data: any): Promise<any> {
    //is submit test
    return fetcher(`${BASE_TEST_URL_API}/quiz/${id}/submit`, {
      data: data,
      method: 'POST',
    })
  }

  static submitAnswer(id: string, data: any): Promise<any> {
    return fetcher(`${BASE_TEST_URL_API}/quiz/${id}/submit-answer`, {
      data: data,
      method: 'POST',
    })
  }

  static updateFlagInQuestion(
    quiz_attempt_id: string,
    payload: {
      question_id: string
      flag: boolean
      answer?: {
        question_id: string
        requirement_id: string
      }[]
    },
  ) {
    return fetcher(`${BASE_TEST_URL_API}/quiz/${quiz_attempt_id}/flag`, {
      data: payload,
      method: 'PUT',
    })
  }
  static createQuizAttempt(
    id: string | string[] | undefined,
    class_user_id: string | undefined,
  ): Promise<any> {
    return fetcher(`${BASE_TEST_URL_API}/quiz/quiz-attempt`, {
      method: 'POST',
      data: {
        quiz_id: id,
        class_user_id: class_user_id || undefined,
      },
    })
  }
  static createTopicAttempt(
    quiz_id: string,
    question_topic_id: string,
    class_user_id?: string,
    story_topic_id?: string | string[] | undefined,
  ) {
    return fetcher(`${BASE_TEST_URL_API}/quiz/case-study/topic-attempt`, {
      method: 'POST',
      data: {
        quiz_id,
        question_topic_id,
        class_user_id,
        story_topic_id,
      },
    })
  }
  static submitCaseStudy(id: string, data: any): Promise<any> {
    return fetcher(`${BASE_TEST_URL_API}/quiz/case-study/${id}/submit`, {
      data: data,
      method: 'POST',
    })
  }
  static CACHE_GET_TOPIC_DESCRIPTION = {} as { [key: string]: any }

  // Question Topic
  static async getTopicDescription(
    id: string | string[] | undefined,
    quiz_id?: string,
    class_user_id?: string,
    cache = false,
    include_questions = false,
  ): Promise<any> {
    let uri = `${BASE_TEST_URL_API}/question-topic/${id}?quiz_id=${quiz_id}&include_questions=${include_questions}`
    if (class_user_id) {
      uri += `&class_user_id=${class_user_id}`
    }
    if (!cache) return fetcher(uri)

    if (!TestServiceAPI.CACHE_GET_TOPIC_DESCRIPTION[uri]) {
      TestServiceAPI.CACHE_GET_TOPIC_DESCRIPTION[uri] = await fetcher(uri)
    }

    return TestServiceAPI.CACHE_GET_TOPIC_DESCRIPTION[uri]
  }

  // Quiz Attempt
  //get answer a question
  static getAnswersSubmitted(id: string): Promise<any> {
    return fetcher(`${BASE_TEST_URL_API}/quiz-attempts/user-answers/${id}`)
  }
  //Hiện đang dùng để submit cho bài test trong activity

  static async submitQuizTest(
    id: string,
    data: any,
    class_user_id?: string,
  ): Promise<any> {
    const quizAttemptResponse = await TestServiceAPI.createQuizAttempt(
      id,
      class_user_id,
    )
    const quizAttemptId = quizAttemptResponse.data?.id
    if (quizAttemptId) {
      const response = await fetcher(
        `${BASE_TEST_URL_API}/quiz/${quizAttemptId}/submit-with-all-answer`,
        {
          data: data,
          method: 'POST',
        },
      )

      return {
        ...response,
        quizAttemptId,
        progress: quizAttemptResponse?.data?.progress,
      }
    }
  }

  // Upload / Download file
  static async startUpload({
    content_type,
    name,
    size,
    blob,
    getProgress,
    location,
  }: {
    content_type: string
    name: string
    size: string
    blob: Blob
    description: string
    getProgress: (percent: number) => void
    location: string
  }) {
    const responsePreUpload = await preUpload({
      content_type,
      name: name || '',
      location: location || '',
      size,
    })
    await uploadFile(
      {
        upload_url: responsePreUpload.data.upload_url,
        file_key: responsePreUpload.data.file_key,
        type: responsePreUpload.data.type as 'SINGLE_PART' | 'MULTIPLE_PART',
        contentType: content_type,
        blob,
      },
      getProgress,
    )
    return responsePreUpload
  }
  static downloadFile = async (data: {
    files: { name: string; file_key: string }[]
  }) => {
    try {
      const responseToken: IResponse<{
        data: string
        success: boolean
      }> = await request(`${BASE_TEST_URL_API}/resource/get-token-download`, {
        data: data,
        method: 'POST',
      })
      if (responseToken?.data?.success) {
        const link = document.createElement('a')
        link.href = `${BASE_TEST_URL_API}/resource/download?token=${responseToken?.data?.data}`
        link.download = data.files[0].name
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {}
  }
}

const preUpload = async ({
  content_type,
  name,
  location,
  size,
}: {
  content_type: string
  name: string
  location: string | null
  size: string
}): Promise<
  IResponse<{
    type: string
    file_key: string
    upload_url: string
    name: string
  }>
> => {
  return fetcher(`${BASE_TEST_URL_API}/resource/pre-upload/metadata`, {
    params: {
      content_type,
      name,
      location,
      size,
    },
  })
}

const uploadFile = async (
  file: {
    contentType: string
    file_key: string
    upload_url: string
    blob: Blob
    type: 'SINGLE_PART' | 'MULTIPLE_PART'
  },
  getProgress?: (percent: number) => void,
) => {
  const fileBlob = file.blob
  if (file.type === 'SINGLE_PART') {
    const onUploadProgress = (progressEvent: any) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      )
      if (getProgress) {
        getProgress(percent)
      }
    }
    await axios.put(file.upload_url, fileBlob, {
      headers: { 'Content-Type': fileBlob.type },
      onUploadProgress,
    })
    return
  }
}
