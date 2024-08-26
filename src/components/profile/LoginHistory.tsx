import SappButton from '@components/base/button/SappButton'
import HistoryItem from '@components/base/historyItem/HistoryItem'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  getLoginHistory,
  loadMoreLoginHistory,
  userReducer,
} from 'src/redux/slice/User/User'

interface IProp {
  onOpenTab: () => void
}

const LoginHistory = ({ onOpenTab }: IProp) => {
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
    <div className="relative">
      <div className="sticky top-0 flex items-center justify-between border-b border-gray-3 bg-white">
        <div className="mx-6 pb-5 pt-6 text-xl font-medium">
          {`Login History (${loginHistory?.meta?.total_records || 0})`}
        </div>
        <SappButton
          onClick={onOpenTab}
          size="medium"
          title={'Back'}
          color="textUnderline"
          className="-mr-8 block min-w-[120px] text-base lg:hidden"
        />
      </div>
      <div
        onScroll={(e) => {
          const { target } = e
          if (
            (target as any).scrollTop + (target as any).offsetHeight >=
            (target as any).scrollHeight
          ) {
            handleLoadMoreHistory()
          }
        }}
        className="h-[calc(604px-70px)] overflow-y-auto"
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
