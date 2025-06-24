import SappButton from '@components/base/button/SappButton'
import HistoryItem from '@components/base/historyItem/HistoryItem'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  getLoginHistory,
  loadMoreLoginHistory,
  userReducer,
} from 'src/redux/slice/User/User'
import TabLayout from './TabLayout'

interface IProp {
  onOpenTab: () => void
}

const LoginHistory = ({ onOpenTab }: IProp) => {
  const dispatch = useAppDispatch()
  const { loginHistory, loadHistory } = useAppSelector(userReducer)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  useEffect(() => {
    dispatch(
      getLoginHistory({
        page_index: pageIndex,
        page_size: pageSize,
        type: 'login',
      }),
    )
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
    <TabLayout
      title={`Login History (${loginHistory?.meta?.total_records || 0})`}
      headerButtons={
        <SappButton
          onClick={onOpenTab}
          size="medium"
          title={'Back'}
          color="textUnderline"
          className="-mr-8 block min-w-[120px] text-base lg:hidden"
        />
      }
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
    </TabLayout>
  )
}
export default LoginHistory
