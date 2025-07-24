import { useEffect, useMemo, useRef, useState } from 'react'
import { QUESTION_TYPES } from 'src/constants'
import ArrowIcon from '@components/base/pagination/ArrowIcon'
import PageLink from './PageLink'
import { IQuestionTab, ITabSlideProps, TabItem } from 'src/type/courses-3-level'

export default function TabSlide({
  data,
  setCurrentTab,
  currentTab,
  handleChangeTab,
  activeShowAll,
  setActiveShowAll,
  setValueFilter,
  isScrollCenter = true,
}: ITabSlideProps) {
  const elementRef = useRef<HTMLDivElement | null>(null)
  const [hasScrollBar, setHasScrollBar] = useState<boolean>(false)

  useEffect(() => {
    if (elementRef?.current && !activeShowAll && isScrollCenter) {
      elementRef.current.scrollTo(
        elementRef?.current.offsetWidth *
          Math.floor(
            (49 * data.findIndex((e: IQuestionTab) => e.id === currentTab)) /
              elementRef?.current.offsetWidth,
          ),
        0,
      )
    }
  }, [currentTab, elementRef?.current])

  useEffect(() => {
    function updateState() {
      const el = elementRef.current
      if (!el) return

      const shouldShowScroll =
        el.scrollWidth > el.clientWidth && data.length > 0
      setValueFilter('filter', undefined)
      setActiveShowAll(false)
      setHasScrollBar(shouldShowScroll)
    }

    updateState()
    window.addEventListener('resize', updateState)
    return () => window.removeEventListener('resize', updateState)
  }, [data, setValueFilter, setActiveShowAll])

  useEffect(() => {
    if (elementRef?.current && data.length > 0) {
      const el = elementRef.current
      el && setHasScrollBar(el.scrollWidth > el.clientWidth && data?.length > 0)
    }
  }, [elementRef?.current])

  const renderTab = useMemo<[TabItem, TabItem][]>(() => {
    const result: [TabItem, TabItem][] = []
    let i = 1
    let splited = false
    const splitedPosition = data.find(
      (e) => e.qType === QUESTION_TYPES.ESSAY,
    )?.index

    while (i <= data.length) {
      if (i === data.length) {
        result.push(
          splited ? [undefined, data[i - 1]] : [data[i - 1], undefined],
        )
      } else if (data[i].index === splitedPosition && !splited) {
        result.push([data[i - 1], 'split'])
        i--
        splited = true
      } else {
        result.push(splited ? [data[i], data[i - 1]] : [data[i - 1], data[i]])
      }
      i += 2
    }

    return result
  }, [data])

  const firstEssayPosition = useMemo(() => {
    for (let e of data) {
      if (e.qType === QUESTION_TYPES.ESSAY) {
        return e.index
      }
    }
    return undefined
  }, [data])

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
    }, speed)
  }

  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    if (elementRef.current) {
      setStartX(event.pageX - elementRef.current.offsetLeft)
      setScrollLeft(elementRef.current.scrollLeft)
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    if (elementRef.current) {
      const x = event.pageX - elementRef.current.offsetLeft
      const distance = (x - startX) * 2
      elementRef.current.scrollLeft = scrollLeft - distance
    }
  }

  return (
    <ul
      className={`pagination flex min-h-[40px] w-full flex-wrap items-center gap-3`}
      aria-label="Pagination"
    >
      <div
        className={`${
          !activeShowAll
            ? `relative ${
                hasScrollBar ? 'w-[calc(100%-141px)]' : 'w-full'
              } mx-7`
            : ' flex w-full items-center gap-6'
        }`}
      >
        {hasScrollBar && (
          <div
            className={`${
              !activeShowAll && 'absolute -left-3 top-0.5 -translate-x-full'
            }`}
          >
            <PageLink
              arrow={true}
              onClick={() => {
                if (elementRef.current) {
                  handleHorizantalScroll(elementRef.current, 25, 100, -10)
                }
              }}
              // type={type}
            >
              <ArrowIcon iconType={'teeny'}></ArrowIcon>
            </PageLink>
          </div>
        )}
        <div
          className={'flex w-full select-none gap-2'}
          ref={elementRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          {data.length > 0 ? (
            !activeShowAll ? (
              data.map((pageNum: IQuestionTab, idx: number) =>
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
                          handleChangeTab?.(pageNum.id)
                        }
                      }}
                      isViewedProp={pageNum.attempted || pageNum.done}
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
                        handleChangeTab?.(pageNum.id)
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
              renderTab.map(([first, second], idx: number) => (
                <div className="flex flex-col gap-2" key={idx}>
                  {first ? (
                    first !== 'split' ? (
                      <PageLink
                        key={first.id}
                        active={currentTab === first.id}
                        onClick={() => {
                          setCurrentTab?.(first.id)
                          handleChangeTab?.(first.id)
                        }}
                        isViewedProp={first.attempted}
                        isFlagedProp={first.flag}
                      >
                        {first.index + 1}
                      </PageLink>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="h-full w-[1px] border"></div>
                      </div>
                    )
                  ) : (
                    <div className="h-full w-[40px]"></div>
                  )}

                  {second ? (
                    second !== 'split' ? (
                      <PageLink
                        key={second.id}
                        active={currentTab === second.id}
                        onClick={() => {
                          setCurrentTab?.(second.id)
                          handleChangeTab?.(second.id)
                        }}
                        isViewedProp={second.attempted}
                        isFlagedProp={second.flag}
                      >
                        {second.index + 1}
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
              ))
            )
          ) : (
            <div className="flex w-full justify-center">
              Your search did not match any questions
            </div>
          )}
        </div>
        {hasScrollBar && (
          <div
            className={`${
              !activeShowAll && 'absolute -right-3 top-0.5 translate-x-full'
            }`}
          >
            <PageLink
              disabled={
                data.findIndex((e) => e.id === currentTab) === data.length - 1
              }
              arrow={true}
              onClick={() => {
                if (elementRef.current) {
                  handleHorizantalScroll(elementRef.current, 25, 100, 10)
                }
              }}
            >
              <ArrowIcon iconType={'teeny'} right={true}></ArrowIcon>
            </PageLink>
          </div>
        )}
      </div>
    </ul>
  )
}
