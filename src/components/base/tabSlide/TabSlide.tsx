import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import Pagination from '../pagination/Pagination'
import PageLink from '../pagination/PageLink'
import ArrowIcon from '../pagination/ArrowIcon'
import { QUESTION_TYPES } from 'src/constants'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

interface IProps {
  data: Array<any>
  setCurrentTab?: any
  optionShowAll?: ReactNode
  currentTab: string
  handleChangeTab?: any
  activeShowAll: boolean
  setActiveShowAll: any
  setValueFilter: UseFormSetValue<FieldValues>
}

const TabSlide = ({
  data,
  setCurrentTab,
  optionShowAll,
  currentTab,
  handleChangeTab,
  activeShowAll,
  setActiveShowAll,
  setValueFilter,
}: IProps) => {
  const elementRef = useRef(null) as any
  const [hasScrollBar, setHasScrollBar] = useState(undefined) as any

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

  useEffect(() => {
    function updateState(hasScrollBar: any) {
      if (hasScrollBar !== undefined) {
        setValueFilter('filter', undefined)
        setActiveShowAll(false)
        const el = elementRef.current
        el && setHasScrollBar(el.scrollWidth > el.getBoundingClientRect().width)
      }
    }
    updateState(hasScrollBar)
    window.addEventListener('resize', updateState)
    return () => window.removeEventListener('resize', updateState)
  }, [hasScrollBar])
  useEffect(() => {
    if (elementRef?.current && data.length > 0) {
      const el = elementRef.current
      el && setHasScrollBar(el.scrollWidth > el.getBoundingClientRect().width)
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

  const handleHorizantalScroll = (element: any, speed: any, distance: any, step: any) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      element.scrollLeft += step;
      scrollAmount += Math.abs(step);
      if (scrollAmount >= distance) {
        clearInterval(slideTimer);
      }
      // if (element.scrollLeft === 0) {
      //   setArrowDisable(true);
      // } else {
      //   setArrowDisable(false);
      // }
    }, speed);
  };

  return (
    <ul
      className={`pagination flex items-center flex-wrap w-full gap-3 min-h-[40px]`}
      aria-label="Pagination"
    >
      <div
        className={`${
          !activeShowAll
            ? `relative ${
                hasScrollBar ? 'w-[calc(100%-141px)]' : 'w-full'
              } mx-7`
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
              arrow={true}
              onClick={() => {
                // if (setCurrentTab !== undefined) {
                //   const index = data.findIndex((e) => e.id === currentTab)
                //   handleChangeTab(data[index - 1].id)
                // }
                handleHorizantalScroll(elementRef.current, 25, 100, -10);
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
          {data.length > 0 ? (
            !activeShowAll ? (
              data.map((pageNum: any, idx: any) =>
                firstEssayPosition !== undefined &&
                pageNum.index === firstEssayPosition ? (
                  <div className="flex" key={pageNum.id}>
                    {idx !== 0 && <div className="h-full border me-2"></div>}
                    <PageLink
                      key={pageNum.id}
                      active={currentTab === pageNum.id}
                      // disabled={isNaN(pageNum)}
                      onClick={() => {
                        // if (setCurrentTab !== undefined) {
                        //   handleChangeTab(pageNum.id)
                        // }
                        console.log('bbb')
                      }}
                      isViewedProp={pageNum.attempted || pageNum.done}
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
                      console.log('ccc')
                    }}
                    isViewedProp={pageNum.attempted}
                    isFlagedProp={pageNum.flaged}
                    //   type={type}
                  >
                    {pageNum.index + 1}
                  </PageLink>
                ),
              )
            ) : (
              renderTab.map((pageNum: any, idx: number) => {
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
                            // if (setCurrentTab !== undefined) {
                            //   handleChangeTab(pageNum[0].id)
                            // }
                          }}
                          isViewedProp={pageNum[0].attempted}
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
                            // if (setCurrentTab !== undefined) {
                            //   handleChangeTab(pageNum[1].id)
                            // }
                            console.log('dđ')
                          }}
                          isViewedProp={pageNum[1].attempted}
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
              })
            )
          ) : (
            <div className="flex justify-center w-full">
              Your search did not match any questions
            </div>
          )}
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
                // if (setCurrentTab !== undefined) {
                //   const index = data.findIndex((e) => e.id === currentTab)
                //   handleChangeTab(data[index + 1].id)
                // }
                handleHorizantalScroll(elementRef.current, 25, 100, 10);
                console.log('eee')
              }}
              // type={type}
            >
              <ArrowIcon iconType={'teeny'} right={true}></ArrowIcon>
            </PageLink>
          </div>
        )}
        {hasScrollBar && (
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
        )}
      </div>
    </ul>
  )
}
export default TabSlide
