import { IQuestion, IResponse } from '@lms/core'
import { fetcher } from '@services/requestV2'

type QuestionDetailQueryDTO = {
  after_test: boolean
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
  ): Promise<any> {
    let uri = `${BASE_TEST_URL_API}/question-topic/${id}?quiz_id=${quiz_id}&include_questions=false`
    if (class_user_id) {
      uri += `&class_user_id=${class_user_id}`
    }
    if (!cache) return fetcher(uri)

    if (!this.CACHE_GET_TOPIC_DESCRIPTION[uri]) {
      this.CACHE_GET_TOPIC_DESCRIPTION[uri] = await fetcher(uri)
    }

    return this.CACHE_GET_TOPIC_DESCRIPTION[uri]
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
    const quizAttemptResponse = await this.createQuizAttempt(id, class_user_id)
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
}
