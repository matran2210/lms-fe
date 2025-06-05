import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  getLoginHistory,
  loadMoreLoginHistory,
  userReducer,
} from 'src/redux/slice/User/User'
import ProfileCard from '@components/card/ProfileCard'
import HistoryItem from './HistoryItem'

const LoginHistoryList = () => {
  const dispatch = useAppDispatch()
  const { loginHistory, loadHistory } = useAppSelector(userReducer)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  useEffect(() => {
    dispatch(getLoginHistory({ page_index: pageIndex, page_size: pageSize }))
  }, [])

  const handleLoadMoreHistory = () => {
    if (!loadHistory) {
      if (pageIndex < loginHistory.meta.total_pages) {
        setPageIndex((prev) => {
          dispatch(
            loadMoreLoginHistory({
              page_index: prev + 1,
              page_size: pageSize,
            }),
          )
          return prev + 1
        })
      }
    }
  }
  return (
    <ProfileCard
      title={
        <div>
          Login History{' '}
          <span className="text-base font-normal text-secondary-300">
            ({loginHistory?.meta?.total_records || 0})
          </span>
        </div>
      }
      subtitle="These are IP adresses that logged on"
      onScroll={(e) => {
        const { target } = e
        if (
          (target as any).scrollTop + (target as any).offsetHeight >=
          (target as any).scrollHeight
        ) {
          handleLoadMoreHistory()
        }
      }}
      bodyClassName="h-[calc(604px-70px)] overflow-y-auto"
    >
      {loginHistory?.userActivities?.map((e: any) => {
        return (
          <div key={e.id}>
            <HistoryItem data={e} />
          </div>
        )
      })}
    </ProfileCard>
  )
}
export default LoginHistoryList
