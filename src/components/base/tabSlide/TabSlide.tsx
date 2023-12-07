import { ReactNode, useState } from 'react'
import Pagination from '../pagination/Pagination'
import PageLink from '../pagination/PageLink'
import ArrowIcon from '../pagination/ArrowIcon'

interface IProps {
  data: Array<any>
  setCurrentTab?: any
  optionShowAll?: ReactNode
  currentTab: string
  handleChangeTab?: any
}

const TabSlide = ({
  data,
  setCurrentTab,
  optionShowAll,
  currentTab,
  handleChangeTab,
}: IProps) => {
  const [activeShowAll, setActiveShowAll] = useState<boolean>(true)
  return (
    <ul
      className={`pagination flex items-center flex-wrap w-full gap-3`}
      aria-label="Pagination"
    >
      <div
        className={`${
          activeShowAll
            ? 'relative w-[calc(100%-141px)] mx-7'
            : ' flex items-center gap-6'
        }`}
      >
        <div
          className={`${
            activeShowAll && 'absolute top-0.5 -left-3 -translate-x-full'
          }`}
        >
          <PageLink
            disabled={data.findIndex((e) => e.id === currentTab) === 0}
            arrow={true}
            onClick={() => {
              if (setCurrentTab !== undefined) {
                const index = data.findIndex((e) => e.id === currentTab)
                handleChangeTab(data[index - 1].id)
              }
            }}
            // type={type}
          >
            <ArrowIcon iconType={'teeny'}></ArrowIcon>
          </PageLink>
        </div>
        <div
          className={`${
            activeShowAll
              ? 'flex gap-2 overflow-auto w-full'
              : 'flex items-center gap-2 flex-wrap'
          }`}
          //   ref={elementRef}
        >
          {data.map((pageNum: any, idx: any) => (
            <PageLink
              key={idx}
              active={currentTab === pageNum.id}
              // disabled={isNaN(pageNum)}
              onClick={() => {
                if (setCurrentTab !== undefined) {
                  handleChangeTab(pageNum.id)
                }
              }}
              isViewedProp={pageNum.viewed}
              isFlagedProp={pageNum.flaged}
              //   type={type}
            >
              {!isNaN(pageNum.id) ? pageNum.id : '|'}
            </PageLink>
          ))}
        </div>
        <div
          className={`${
            activeShowAll && 'absolute top-0.5 -right-3 translate-x-full'
          }`}
        >
          <PageLink
            disabled={
              data.findIndex((e) => e.id === currentTab) === data.length - 1
            }
            arrow={true}
            onClick={() => {
              if (setCurrentTab !== undefined) {
                const index = data.findIndex((e) => e.id === currentTab)
                handleChangeTab(data[index + 1].id)
              }
            }}
            // type={type}
          >
            <ArrowIcon iconType={'teeny'} right={true}></ArrowIcon>
          </PageLink>
        </div>

        <div className="flex items-center">
          {!activeShowAll && optionShowAll}
          <div
            className={`ml-6 text-sm leading-4.5 text-bw-1 underline font-semibold cursor-pointer w-max ${
              activeShowAll && 'absolute -right-28 top-0 translate-y-1/2 '
            }`}
            onClick={() => {
              // setPageNums(activeShowAll ? arrPage : getPagination)
              setActiveShowAll(!activeShowAll)
            }}
          >
            {activeShowAll ? 'Show All' : 'Show Less'}
          </div>
        </div>
      </div>
    </ul>
  )
}
export default TabSlide
