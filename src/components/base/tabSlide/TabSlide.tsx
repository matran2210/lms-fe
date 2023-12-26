import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import Pagination from '../pagination/Pagination'
import PageLink from '../pagination/PageLink'
import ArrowIcon from '../pagination/ArrowIcon'
import { QUESTION_TYPES } from 'src/constants'

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
    if (elementRef?.current && !activeShowAll) {
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
  // const renderTab = useMemo(() => {
  //   let arr = [] as any
  //   for (let i = 1; i <= data.length; i += 2) {
  //     if (i === data.length) {
  //       arr.push([data[i - 1]])
  //     } else {
  //       arr.push([data[i - 1], data[i]])
  //     }
  //   }
  //   return arr
  // }, [data])
  const renderTab = useMemo(() => {
    let arr = [] as any
    let i = 1
    let splited = false
    let splitedPosition
    for (let e of data) {
      if (e.qType === QUESTION_TYPES.ESSAY) {
        splitedPosition = e.index
        break
      }
    }
    while (i <= data.length) {
      if (i === data.length) {
        if (splited === false) {
          arr.push([data[i - 1]])
        } else {
          arr.push([undefined, data[i - 1]])
        }
      } else {
        if (data[i].index === splitedPosition && splited == false) {
          arr.push([data[i - 1], 'split'])
          i--
          splited = true
        } else {
          if (splited === false) {
            arr.push([data[i - 1], data[i]])
          } else {
            arr.push([data[i], data[i - 1]])
          }
        }
      }
      i += 2
    }
    // for (let i = 1; i <= data.length ; i += 2) {

    // }
    return arr
  }, [data])

  const firstEssayPosition = useMemo(() => {
    for (let e of data) {
      if (e.qType === QUESTION_TYPES.ESSAY) {
        return e.index
      }
    }
    return undefined
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
            ? data.map((pageNum: any, idx: any) =>
                firstEssayPosition !== undefined &&
                pageNum.index === firstEssayPosition ? (
                  <div className="flex" key={pageNum.id}>
                    <div className="h-full border me-2"></div>
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
                  </div>
                ) : (
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
                ),
              )
            : renderTab.map((pageNum: any, idx: number) => {
                // if (pageNum) {
                return (
                  <div className="flex flex-col gap-2" key={idx}>
                    {pageNum[0] ? (
                      pageNum[0] !== 'split' ? (
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
                      ) : (
                        <div className="flex items-center h-full justify-center">
                          <div className="h-full border w-[1px]"></div>
                        </div>
                      )
                    ) : (
                      <div className="h-full w-[40px]"></div>
                    )}
                    {pageNum[1] ? (
                      pageNum[1] !== 'split' ? (
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
                      ) : (
                        <div className="flex items-center h-full justify-center">
                          <div className="h-full border w-[1px]"></div>
                        </div>
                      )
                    ) : (
                      <div className="h-full w-[40px]"></div>
                    )}
                  </div>
                )
                // }
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
