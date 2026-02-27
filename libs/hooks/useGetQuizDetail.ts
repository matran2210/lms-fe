"use client"
import { useFeature } from '@lms/contexts'
import { useEffect, useState } from 'react'

const useGetQuizDetail = (id: string) => {
  const [quizDetail, setQuizDetail] = useState<any>(undefined)
  const { testServiceApi: TestServiceAPI } = useFeature()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuizDetail = async () => {
      if (id) {
        try {
          setLoading(true)
          const response = await TestServiceAPI.getDetailQuizById(id)
          setQuizDetail(response.data)
        } catch (err) {
        } finally {
          setLoading(false)
        }
      }
    }

    fetchQuizDetail()
  }, [id]) // Dependency on id

  return { quizDetail, loading }
}

export default useGetQuizDetail
