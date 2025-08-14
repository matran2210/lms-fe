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
    const container = elementRef?.current as HTMLElement | null
    if (!container || activeShowAll) return

    const activeItem = container.querySelector(
      `[data-tab-id="${currentTab}"]`,
    ) as HTMLElement | null
    if (!activeItem) return

    const containerWidth = container.clientWidth
    const itemWidth = activeItem.clientWidth
    const itemLeft = activeItem.offsetLeft

    let targetLeft = isScrollCenter
      ? itemLeft - (containerWidth - itemWidth) / 2
      : itemLeft - (containerWidth - itemWidth)

    const maxScrollLeft = container.scrollWidth - containerWidth
    if (targetLeft < 0) targetLeft = 0
    if (targetLeft > maxScrollLeft) targetLeft = maxScrollLeft

    container.scrollTo({ left: targetLeft, behavior: 'smooth' })
  }, [currentTab, activeShowAll, isScrollCenter, data?.length])

  // Loại bỏ trùng id, sau đó sắp xếp theo index tăng dần để tránh trùng item active
  const uniqueData = useMemo(() => {
    const seenIds = new Set<string>()
    const result: any[] = []
    for (const item of data || []) {
      const id = item?.id
      if (id == null) continue
      if (!seenIds.has(id)) {
        seenIds.add(id)
        result.push(item)
      }
    }
    return result
  }, [data])

  const sortedData = useMemo(() => {
    return [...uniqueData].sort((a, b) => a.index - b.index)
  }, [uniqueData])

  useEffect(() => {
    if (elementRef?.current && sortedData.length > 0) {
      const el = elementRef.current
      el &&
        setHasScrollBar(
          el.scrollWidth > el.getBoundingClientRect().width &&
            sortedData?.length > 0,
        )
    }
  }, [sortedData.length, setHasScrollBar])

  // Chia sortedData thành các dòng liên tiếp theo chiều ngang
  const numberPerRow = numberDisplayData
  const rows = useMemo(() => {
    if (!activeShowAll || sortedData.length <= numberPerRow) return []
    const result = []
    for (let i = 0; i < sortedData.length; i += numberPerRow) {
      result.push(sortedData.slice(i, i + numberPerRow))
    }
    return result
  }, [sortedData, activeShowAll, numberPerRow])

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
              className={clsx(
                sortedData.findIndex((e) => e.id === currentTab) === 0
                  ? 'pointer-events-none opacity-50'
                  : '',
                'cursor-pointer',
              )}
            >
              <ArrowIconV2 />
            </PageLink>
          </div>
        )}
        {/* Phần render các số */}
        <div
          className={clsx(
            'flex w-fit select-none justify-start gap-2 pt-1 duration-300 ease-in-out will-change-auto',
            {
              '!w-fit': activeShowAll,
              'h-[44px] overflow-hidden': !activeShowAll,
              'overflow-visible': activeShowAll,
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
                  <div
                    className="flex"
                    key={pageNum.id}
                    data-tab-id={pageNum.id}
                  >
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
                  <div
                    className="flex"
                    key={pageNum.id}
                    data-tab-id={pageNum.id}
                  >
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
                  </div>
                ),
              )
            ) : (
              // Show-all: multi-rows by numberPerRow (25 on desktop, 14 on tablet)
              <div className="flex flex-col gap-2">
                {rows.map((row, rowIdx) => (
                  <div className="flex flex-row gap-2" key={rowIdx}>
                    {row.map((pageNum: any) => (
                      <div
                        className="flex"
                        key={pageNum.id}
                        data-tab-id={pageNum.id}
                      >
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
                      </div>
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
              className={clsx(
                sortedData.findIndex((e) => e.id === currentTab) ===
                  sortedData.length - 1
                  ? 'pointer-events-none opacity-50'
                  : '',
                'cursor-pointer',
              )}
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
