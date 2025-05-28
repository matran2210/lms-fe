import { CoursesAPI } from '@pages/api/courses'
import { useEffect, useState } from 'react'

const useGetQuestionTabs = (id: string) => {
  const [questions, setQuestionTabs] = useState<any>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuestionTabs = async () => {
      if (id) {
        try {
          setLoading(true)
          const response = await CoursesAPI.getQuestionTabsById(id)
          setQuestionTabs(response.data)
        } catch (err) {
        } finally {
          setLoading(false)
        }
      }
    }

    fetchQuestionTabs()
  }, [id]) // Dependency on id

  return { questions, loading }
}

export default useGetQuestionTabs
