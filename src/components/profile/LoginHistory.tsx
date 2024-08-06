import HistoryItem from '@components/base/historyItem/HistoryItem'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  getLoginHistory,
  loadMoreLoginHistory,
  userReducer,
} from 'src/redux/slice/User/User'

const LoginHistory = () => {
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
    <div
      className="bg-white py-6 flex-1 shadow-box h-fit "
      style={{ maxHeight: '568px', overflowY: 'auto', minHeight: '400px' }}
    >
      <div className="mx-6 border-b border-gray-3 pb-5 text-xl font-medium">{`Login History (${
        loginHistory?.meta?.total_records || 0
      })`}</div>
      <div
        className="max-h-[631px] "
        onScroll={(e) => {
          const { target } = e
          if (
            (target as any).scrollTop + (target as any).offsetHeight >=
            (target as any).scrollHeight
          ) {
            handleLoadMoreHistory()
          }
        }}
      >
        {loginHistory?.userActivities?.map((e: any) => {
          return (
            <div key={e.id}>
              <HistoryItem data={e} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default LoginHistory
