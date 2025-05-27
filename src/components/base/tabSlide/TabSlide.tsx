import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import Pagination from '../pagination/Pagination'
import PageLink from '../pagination/PageLink'
import ArrowIcon from '../pagination/ArrowIcon'
import { QUESTION_TYPES } from 'src/constants'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { ShowLessIcon, ShowMoreIcon } from '@assets/icons'
import clsx from 'clsx'
import { ArrowIconV2 } from '../pagination/ArrowIconV2'

interface IProps {
  data: Array<any>
  setCurrentTab?: any
  currentTab: string
  handleChangeTab?: any
  activeShowAll: boolean
  setActiveShowAll: any
  setValueFilter: UseFormSetValue<FieldValues>
  isScrollCenter?: boolean
  answerSubmitted?: Array<any>
  hasScrollBar: boolean
  setHasScrollBar: any
}

const TabSlide = ({
  data,
  setCurrentTab,
  currentTab,
  handleChangeTab,
  activeShowAll,
  setActiveShowAll,
  setValueFilter,
  isScrollCenter = true,
  hasScrollBar,
  setHasScrollBar,
}: IProps) => {
  const elementRef = useRef(null) as any
  useEffect(() => {
    if (elementRef?.current && !activeShowAll && isScrollCenter) {
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

  useEffect(() => {
    function updateState(hasScrollBar: any) {
      if (hasScrollBar !== undefined) {
        setValueFilter('filter', undefined)
        setActiveShowAll(false)
        const el = elementRef.current
        el &&
          setHasScrollBar(
            el.scrollWidth > el.getBoundingClientRect().width &&
              data?.length > 0,
          )
      }
    }
    updateState(hasScrollBar)
    window.addEventListener('resize', updateState)
    return () => window.removeEventListener('resize', updateState)
  }, [hasScrollBar])

  useEffect(() => {
    if (elementRef?.current && data.length > 0) {
      const el = elementRef.current
      el &&
        setHasScrollBar(
          el.scrollWidth > el.getBoundingClientRect().width && data?.length > 0,
        )
    }
  }, [elementRef?.current])
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

  // const [arrowDisable, setArrowDisable] = useState(true);

  const handleHorizantalScroll = (
    element: HTMLElement,
    speed: number,
    distance: number,
    step: number,
  ) => {
    let scrollAmount = 0
    const slideTimer = setInterval(() => {
      element.scrollLeft += step
      scrollAmount += Math.abs(step)
      if (scrollAmount >= distance) {
        clearInterval(slideTimer)
      }
      // if (element.scrollLeft === 0) {
      //   setArrowDisable(true);
      // } else {
      //   setArrowDisable(false);
      // }
    }, speed)
  }

  /**
   * @description Sử dụng state để theo dõi trạng thái của việc kéo
   */
  const [isDragging, setIsDragging] = useState(false)
  /**
   * @description Lưu trữ vị trí x của chuột khi bắt đầu kéo
   */
  const [startX, setStartX] = useState(0)
  /**
   * @description Lưu trữ giá trị scrollLeft của menu container khi bắt đầu kéo
   */
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (event: React.MouseEvent<any>) => {
    setIsDragging(true) // Đánh dấu rằng việc kéo đã bắt đầu
    setStartX(event.pageX - elementRef.current.offsetLeft) // Lưu trữ vị trí x của chuột khi bắt đầu kéo
    setScrollLeft(elementRef.current.scrollLeft) // Lưu trữ giá trị scrollLeft hiện tại của menu container
  }

  const handleMouseMove = (event: React.MouseEvent<any>) => {
    if (!isDragging) return // Nếu không đang kéo, không thực hiện gì cả
    const x = event.pageX - elementRef.current.offsetLeft // Tính toán vị trí x mới của chuột
    const distance = (x - startX) * 2 // Tính khoảng cách di chuyển của chuột từ vị trí bắt đầu kéo
    elementRef.current.scrollLeft = scrollLeft - distance // Cuộn menu container dựa trên khoảng cách di chuyển của chuột
  }

  return (
    <ul
      className={`pagination flex min-h-[40px] w-full flex-wrap items-center gap-3 ${activeShowAll ? 'max-w-[1222px]' : 'h-[44px] max-w-[1142px]'}`}
      aria-label="Pagination"
    >
      <div
        className={`gap-4 ${
          !activeShowAll
            ? `relative mx-7 w-full`
            : ' flex w-full items-center justify-between'
        }`}
      >
        {hasScrollBar && (
          <div
            className={`${
              !activeShowAll && 'absolute -left-3 top-1 -translate-x-full'
            }`}
          >
            <PageLink
              arrow={true}
              onClick={() => {
                // if (setCurrentTab !== undefined) {
                //   const index = data.findIndex((e) => e.id === currentTab)
                //   handleChangeTab(data[index - 1].id)
                // }
                handleHorizantalScroll(elementRef.current, 25, 100, -10)
              }}
              // type={type}
            >
              <ArrowIconV2></ArrowIconV2>
            </PageLink>
          </div>
        )}
        <div
          className={clsx(
            'flex w-full select-none gap-2 overflow-hidden pt-1 duration-300 ease-in-out will-change-auto',
            {
              'justify-center': !hasScrollBar,
              '!w-fit': activeShowAll,
              'h-[88px]': activeShowAll,
              'h-[44px]': !activeShowAll,
            },
          )}
          ref={elementRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          {data.length > 0 ? (
            !activeShowAll || data?.length <= 25 ? (
              data.map((pageNum: any, idx: any) =>
                firstEssayPosition !== undefined &&
                pageNum.index === firstEssayPosition ? (
                  <div className="flex" key={pageNum.id}>
                    {idx !== 0 && <div className="me-2 h-full border"></div>}
                    <PageLink
                      key={pageNum.id}
                      active={currentTab === pageNum.id}
                      // disabled={isNaN(pageNum)}
                      onClick={() => {
                        if (setCurrentTab !== undefined) {
                          handleChangeTab(pageNum.id)
                        }
                      }}
                      isViewedProp={
                        pageNum.attempted || pageNum.is_viewed_answer
                      }
                      isFlagedProp={pageNum.flag}
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
                    isViewedProp={pageNum.attempted}
                    isFlagedProp={pageNum.flag}
                    //   type={type}
                  >
                    {pageNum.index + 1}
                  </PageLink>
                ),
              )
            ) : (
              renderTab.map((pageNum: any, idx: number) => {
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
                          isViewedProp={pageNum[0].attempted}
                          isFlagedProp={pageNum[0].flag}
                          //   type={type}
                        >
                          {pageNum[0].index + 1}
                        </PageLink>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <div className="h-full w-[1px] border"></div>
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
                          isViewedProp={pageNum[1].attempted}
                          isFlagedProp={pageNum[1].flag}
                          //   type={type}
                        >
                          {pageNum[1].index + 1}
                        </PageLink>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <div className="h-full w-[1px] border"></div>
                        </div>
                      )
                    ) : (
                      <div className="h-full w-[40px]"></div>
                    )}
                  </div>
                )
                // }
              })
            )
          ) : (
            <div className="flex w-full items-center justify-center">
              Your search did not match any questions
            </div>
          )}
        </div>
        {hasScrollBar && (
          <div
            className={`${
              !activeShowAll && 'absolute -right-3 top-1 translate-x-full'
            }`}
          >
            <PageLink
              disabled={
                data.findIndex((e) => e.id === currentTab) === data.length - 1
              }
              arrow={true}
              onClick={() => {
                // if (setCurrentTab !== undefined) {
                //   const index = data.findIndex((e) => e.id === currentTab)
                //   handleChangeTab(data[index + 1].id)
                // }
                handleHorizantalScroll(elementRef.current, 25, 100, 10)
              }}
              // type={type}
            >
              <ArrowIconV2 right={true}></ArrowIconV2>
            </PageLink>
          </div>
        )}
      </div>
    </ul>
  )
}
export default TabSlide
