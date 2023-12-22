import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import Pagination from '../pagination/Pagination'
import PageLink from '../pagination/PageLink'
import ArrowIcon from '../pagination/ArrowIcon'

interface IProps {
  data: Array<any>
  setCurrentTab?: any
  optionShowAll?: ReactNode
  currentTab: string
  handleChangeTab?: any
  activeShowAll: boolean
  setActiveShowAll: any
}

const TabSlide = ({
  data,
  setCurrentTab,
  optionShowAll,
  currentTab,
  handleChangeTab,
  activeShowAll,
  setActiveShowAll,
}: IProps) => {
  const elementRef = useRef(null) as any

  useEffect(() => {
    if (elementRef?.current) {
      elementRef.current.scrollTo(
        elementRef?.current.offsetWidth *
          Math.floor(
            (49 * data.findIndex((e: any) => e.id === currentTab)) /
              elementRef?.current.offsetWidth,
          ),
        0,
      )
    }
  }, [currentTab, elementRef?.current])
  const renderTab = useMemo(() => {
    let arr = [] as any
    for (let i = 1; i <= data.length; i += 2) {
      if (i === data.length) {
        arr.push([data[i - 1]])
      } else {
        arr.push([data[i - 1], data[i]])
      }
    }
    return arr
  }, [data])

  return (
    <ul
      className={`pagination flex items-center flex-wrap w-full gap-3 min-h-[40px]`}
      aria-label="Pagination"
    >
      <div
        className={`${
          !activeShowAll
            ? 'relative w-[calc(100%-141px)] mx-7'
            : ' flex items-center gap-6 w-full'
        }`}
      >
        {data.length > 0 && (
          <div
            className={`${
              !activeShowAll && 'absolute top-0.5 -left-3 -translate-x-full'
            }`}
          >
            <PageLink
              disabled={
                (data.length > 0 &&
                  data.findIndex((e) => e.id === currentTab) === 0) ||
                data.length === 0
              }
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
        )}
        <div
          className={`${'flex gap-2 overflow-auto w-full'}`}
          ref={elementRef}
        >
          {!activeShowAll
            ? data.map((pageNum: any, idx: any) => (
                <PageLink
                  key={pageNum.id}
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
                  {pageNum.index + 1}
                </PageLink>
              ))
            : renderTab.map((pageNum: any, idx: number) => {
                return (
                  <div className="flex flex-col gap-2" key={idx}>
                    <PageLink
                      key={pageNum[0].id}
                      active={currentTab === pageNum[0].id}
                      // disabled={isNaN(pageNum)}
                      onClick={() => {
                        if (setCurrentTab !== undefined) {
                          handleChangeTab(pageNum[0].id)
                        }
                      }}
                      isViewedProp={pageNum[0].viewed}
                      isFlagedProp={pageNum[0].flaged}
                      //   type={type}
                    >
                      {pageNum[0].index + 1}
                    </PageLink>
                    {pageNum[1] && (
                      <PageLink
                        key={pageNum[1].id}
                        active={currentTab === pageNum[1].id}
                        // disabled={isNaN(pageNum)}
                        onClick={() => {
                          if (setCurrentTab !== undefined) {
                            handleChangeTab(pageNum[1].id)
                          }
                        }}
                        isViewedProp={pageNum[1].viewed}
                        isFlagedProp={pageNum[1].flaged}
                        //   type={type}
                      >
                        {pageNum[1].index + 1}
                      </PageLink>
                    )}
                  </div>
                )
              })}
        </div>
        {data.length > 0 && (
          <div
            className={`${
              !activeShowAll && 'absolute top-0.5 -right-3 translate-x-full'
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
        )}

        <div className="flex items-center">
          {activeShowAll && optionShowAll}
          <div
            className={`ml-6 text-sm leading-4.5 text-bw-1 underline font-semibold cursor-pointer w-max ${
              !activeShowAll && 'absolute -right-28 top-1/2 -translate-y-1/2 '
            }`}
            onClick={() => {
              // setPageNums(activeShowAll ? arrPage : getPagination)
              setActiveShowAll(!activeShowAll)
            }}
          >
            {!activeShowAll ? 'Show All' : 'Show Less'}
          </div>
        </div>
      </div>
    </ul>
  )
}
export default TabSlide
