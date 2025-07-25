import { useEffect, useMemo, useRef, useState } from 'react'
import PageLink from '../pagination/PageLink'
import { QUESTION_TYPES } from 'src/constants'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import clsx from 'clsx'
import { ArrowIconV2 } from '../pagination/ArrowIconV2'
import { Grid } from 'antd'

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
  const { useBreakpoint } = Grid
  const screens = useBreakpoint()
  const NUMBER_DISPLAY_DATA_DESKTOP = 25
  const NUMBER_DISPLAY_DATA_TABLET = 14
  const numberDisplayData = screens?.lg
    ? NUMBER_DISPLAY_DATA_DESKTOP
    : NUMBER_DISPLAY_DATA_TABLET
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

  // useEffect(() => {
  //   function updateState(hasScrollBar: any) {
  //     if (hasScrollBar !== undefined) {
  //       setValueFilter('filter', undefined)
  //       setActiveShowAll(false)
  //       const el = elementRef.current
  //       el &&
  //         setHasScrollBar(
  //           el.scrollWidth > el.getBoundingClientRect().width &&
  //             data?.length > 0,
  //         )
  //     }
  //   }
  //   updateState(hasScrollBar)
  //   window.addEventListener('resize', updateState)
  //   return () => window.removeEventListener('resize', updateState)
  // }, [hasScrollBar])

  // Sắp xếp lại thứ tự các câu hỏi theo index tăng dần
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.index - b.index)
  }, [data])

  useEffect(() => {
    if (elementRef?.current && sortedData.length > 0) {
      const el = elementRef.current
      el &&
        setHasScrollBar(
          el.scrollWidth > el.getBoundingClientRect().width &&
            sortedData?.length > 0,
        )
    }
  }, [elementRef?.current, sortedData?.length])

  // Chia sortedData thành các dòng liên tiếp theo chiều ngang
  const numberPerRow = numberDisplayData
  const rows = useMemo(() => {
    if (!activeShowAll || sortedData.length <= numberDisplayData) return []
    const result = []
    for (let i = 0; i < sortedData.length; i += numberPerRow) {
      result.push(sortedData.slice(i, i + numberPerRow))
    }
    return result
  }, [sortedData, activeShowAll, numberDisplayData])

  const firstEssayPosition = useMemo(() => {
    for (let e of sortedData) {
      if (e.qType === QUESTION_TYPES.ESSAY) {
        return e.index
      }
    }
    return undefined
  }, [sortedData])

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

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true) // Đánh dấu rằng việc kéo đã bắt đầu
    setStartX(event.pageX - elementRef?.current?.offsetLeft) // Lưu trữ vị trí x của chuột khi bắt đầu kéo
    setScrollLeft(elementRef?.current?.scrollLeft) // Lưu trữ giá trị scrollLeft hiện tại của menu container
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return // Nếu không đang kéo, không thực hiện gì cả
    const x = event?.pageX - elementRef?.current?.offsetLeft // Tính toán vị trí x mới của chuột
    const distance = (x - startX) * 2 // Tính khoảng cách di chuyển của chuột từ vị trí bắt đầu kéo
    elementRef.current.scrollLeft = scrollLeft - distance // Cuộn menu container dựa trên khoảng cách di chuyển của chuột
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event?.touches[0]
    setIsDragging(true)
    setStartX(touch?.pageX - elementRef?.current?.offsetLeft)
    setScrollLeft(elementRef?.current?.scrollLeft)
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const touch = event?.touches[0]
    const x = touch?.pageX - elementRef?.current?.offsetLeft
    const distance = (x - startX) * 2
    elementRef.current.scrollLeft = scrollLeft - distance
  }

  return (
    <ul
      className={`pagination flex min-h-[40px] w-full flex-wrap items-center gap-3 ${activeShowAll ? 'lg:max-w-[1222px]' : 'h-[44px] lg:max-w-[calc(100vw-88px-32px)]'}`}
      aria-label="Pagination"
    >
      <div className={`flex w-full items-center justify-center gap-4`}>
        {/* Nút mũi tên trái */}
        {data?.length > 0 && (
          <div className="flex items-center">
            <PageLink
              disabled={sortedData.findIndex((e) => e.id === currentTab) === 0}
              arrow={true}
              onClick={() => {
                const index = sortedData.findIndex((e) => e.id === currentTab)
                if (index > 0 && setCurrentTab) {
                  handleChangeTab(sortedData[index - 1].id)
                }
              }}
              className={
                sortedData.findIndex((e) => e.id === currentTab) === 0
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
            >
              <ArrowIconV2 />
            </PageLink>
          </div>
        )}
        {/* Phần render các số */}
        <div
          className={clsx(
            'flex w-fit select-none justify-start gap-2 overflow-hidden pt-1 duration-300 ease-in-out will-change-auto',
            {
              '!w-fit': activeShowAll,
              'h-[88px]':
                activeShowAll && sortedData?.length > numberDisplayData,
              'h-[44px]': !activeShowAll,
            },
          )}
          ref={elementRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(false)}
        >
          {sortedData.length > 0 ? (
            !activeShowAll || sortedData?.length <= numberDisplayData ? (
              sortedData.map((pageNum: any, idx: any) =>
                firstEssayPosition !== undefined &&
                pageNum.index === firstEssayPosition ? (
                  <div className="flex" key={pageNum.id}>
                    {idx !== 0 && <div className="me-2 h-full border"></div>}
                    <PageLink
                      key={pageNum.id}
                      active={currentTab === pageNum.id}
                      onClick={() => {
                        if (setCurrentTab !== undefined) {
                          handleChangeTab(pageNum.id)
                        }
                      }}
                      isViewedProp={
                        pageNum.attempted || pageNum.is_viewed_answer
                      }
                      isFlagedProp={pageNum.flag}
                    >
                      {pageNum.index + 1}
                    </PageLink>
                  </div>
                ) : (
                  <PageLink
                    key={pageNum.id}
                    active={currentTab === pageNum.id}
                    onClick={() => {
                      if (setCurrentTab !== undefined) {
                        handleChangeTab(pageNum.id)
                      }
                    }}
                    isViewedProp={pageNum.attempted}
                    isFlagedProp={pageNum.flag}
                  >
                    {pageNum.index + 1}
                  </PageLink>
                ),
              )
            ) : (
              <div className="flex flex-col gap-2">
                {rows.map((row, rowIdx) => (
                  <div className="flex flex-row gap-2" key={rowIdx}>
                    {row.map((pageNum: any) => (
                      <PageLink
                        key={pageNum.id}
                        active={currentTab === pageNum.id}
                        onClick={() => {
                          if (setCurrentTab !== undefined) {
                            handleChangeTab(pageNum.id)
                          }
                        }}
                        isViewedProp={pageNum.attempted}
                        isFlagedProp={pageNum.flag}
                      >
                        {pageNum.index + 1}
                      </PageLink>
                    ))}
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="flex w-full items-center justify-center">
              Your search did not match any questions
            </div>
          )}
        </div>
        {/* Nút mũi tên phải */}
        {data?.length > 0 && (
          <div className="flex items-center">
            <PageLink
              disabled={
                sortedData.findIndex((e) => e.id === currentTab) ===
                sortedData.length - 1
              }
              arrow={true}
              onClick={() => {
                const index = sortedData.findIndex((e) => e.id === currentTab)
                if (index < sortedData.length - 1 && setCurrentTab) {
                  handleChangeTab(sortedData[index + 1].id)
                }
              }}
              className={
                sortedData.findIndex((e) => e.id === currentTab) ===
                sortedData.length - 1
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
            >
              <ArrowIconV2 right={true} />
            </PageLink>
          </div>
        )}
      </div>
    </ul>
  )
}
export default TabSlide
