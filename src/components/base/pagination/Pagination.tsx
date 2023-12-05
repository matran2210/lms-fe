import { getPaginationItems } from '../../common/pagination'
import PageLink from './PageLink'
import { Dispatch, ReactNode, SetStateAction, useRef } from 'react'
import ArrowIcon from './ArrowIcon'
import { useState, useEffect } from 'react'

interface Props {
  currentPage: number
  pageSize: number
  maxLength: any
  setCurrentPage?: Dispatch<SetStateAction<number>>
  totalItems: number
  type: any
  optionShowAll?: ReactNode
}

const Pagination = ({
  currentPage,
  pageSize,
  maxLength,
  setCurrentPage,
  totalItems,
  type,
  optionShowAll,
}: Props) => {
  const elementRef = useRef(null)

  const [pageNums, setPageNums] = useState<any>([])
  const [activeShowAll, setActiveShowAll] = useState<boolean>(true)
  const getPagination = getPaginationItems(currentPage, pageSize, maxLength)
  const arrPage: any[] = []
  for (let i = 1; i <= totalItems; i++) {
    arrPage.push(i)
  }
  const handleHorizantalScroll = (
    element: any,
    speed: any,
    distance: any,
    step: any,
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
  useEffect(() => {
    setPageNums(getPaginationItems(currentPage, pageSize, maxLength))
  }, [pageSize, currentPage, maxLength])

  return (
    <ul
      className={`pagination flex items-center flex-wrap ${
        type === 'row' && 'w-full'
      } ${type === 'table' ? 'gap-5' : 'gap-3'}`}
      aria-label="Pagination"
    >
      <div
        className={`${
          type === 'row' && activeShowAll
            ? 'relative w-[calc(100%-141px)] mx-7'
            : ' flex items-center gap-6'
        }`}
      >
        <div
          className={`${
            type === 'row' &&
            activeShowAll &&
            'absolute top-0.5 -left-3 -translate-x-full'
          }`}
        >
          <PageLink
            disabled={type !== 'row' && currentPage === 1}
            arrow={true}
            onClick={() => {
              if (type === 'row') {
                handleHorizantalScroll(elementRef.current, 25, 200, -20)
              } else if (setCurrentPage !== undefined) {
                setCurrentPage(currentPage - 1)
              }
            }}
            type={type}
          >
            <ArrowIcon
              iconType={`${type === 'table' ? 'chervon' : 'teeny'}`}
            ></ArrowIcon>
          </PageLink>
        </div>
        <div
          className={`${
            type === 'row' && activeShowAll
              ? 'flex gap-2 overflow-hidden w-full'
              : 'flex items-center gap-2 flex-wrap'
          }`}
          ref={elementRef}
        >
          {pageNums.map((pageNum: number, idx: any) => (
            <PageLink
              key={idx}
              active={currentPage === pageNum}
              disabled={isNaN(pageNum)}
              onClick={() => {
                if (setCurrentPage !== undefined) {
                  setCurrentPage(pageNum)
                }
              }}
              type={type}
            >
              {!isNaN(pageNum) ? pageNum : type === 'table' ? '...' : '|'}
            </PageLink>
          ))}
        </div>
        <div
          className={`${
            type === 'row' &&
            activeShowAll &&
            'absolute top-0.5 -right-3 translate-x-full'
          }`}
        >
          <PageLink
            disabled={type !== 'row' && currentPage === pageSize}
            arrow={true}
            onClick={() => {
              if (type === 'row') {
                handleHorizantalScroll(elementRef.current, 25, 200, 20)
              } else if (setCurrentPage !== undefined) {
                setCurrentPage(currentPage + 1)
              }
            }}
            type={type}
          >
            <ArrowIcon
              iconType={`${type === 'table' ? 'chervon' : 'teeny'}`}
              right={true}
            ></ArrowIcon>
          </PageLink>
        </div>
        {type === 'row' && (
          <div className="flex items-center">
            {!activeShowAll && optionShowAll}
            <div
              className={`ml-6 text-sm leading-4.5 text-bw-1 underline font-semibold cursor-pointer w-max ${
                activeShowAll && 'absolute -right-28 top-0 translate-y-1/2 '
              }`}
              onClick={() => {
                setPageNums(activeShowAll ? arrPage : getPagination)
                setActiveShowAll(!activeShowAll)
              }}
            >
              {activeShowAll ? 'Show All' : 'Show Less'}
            </div>
          </div>
        )}
      </div>
    </ul>
  )
}

export default Pagination
