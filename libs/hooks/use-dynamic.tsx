"use client"
import { useFeature } from '@lms/contexts'
import { useEffect, useState } from 'react'

const useDynamicLoading = (
  getData: (page: number) => void,
  pageSize: number,
) => {
  const { router, params } = useFeature()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState<number>(pageSize)

  const loadMoreOptions = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      // Fetch additional items from the API with an increased page_size
      getData(page)
      setPage(page + pageSize)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMenuScrollToBottom = ({ target }: any) => {
    // Check if the user has scrolled to the bottom of the menu
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      // Load more options when scrolling to the bottom
      loadMoreOptions()
    }
  }

  useEffect(() => {
    // Load initial options when the component mounts
    if (params?.courseId || params?.id) {
      loadMoreOptions()
    }
  }, [])

  return { isLoading, handleMenuScrollToBottom, setPage }
}

export default useDynamicLoading
