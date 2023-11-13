import { getPaginationItems } from '../../common/pagination'
import PageLink from './PageLink'
import { Dispatch, SetStateAction } from 'react'
import ArrowIcon from './ArrowIcon'
import { useState, useEffect } from 'react'

interface Props {
  currentPage: number
  pageSize: number
  maxLength: any
  setCurrentPage?: Dispatch<SetStateAction<number>>
  totalItems: number
  type: any
}

const Pagination = ({
  currentPage,
  pageSize,
  maxLength,
  setCurrentPage,
  totalItems,
  type,
}: Props) => {
  const [pageNums, setPageNums] = useState<any>([])
  const [activeShowAll, setActiveShowAll] = useState<boolean>(true)
  const getPagination = getPaginationItems(currentPage, pageSize, maxLength)
  const arrPage: any[] = []
  for (let i = 1; i <= totalItems; i++) {
    arrPage.push(i)
  }

  useEffect(() => {
    setPageNums(getPaginationItems(currentPage, pageSize, maxLength))
  }, [pageSize, currentPage])

  return (
    <ul
      className={`pagination flex items-center flex-wrap ${
        type === 'table' ? 'gap-5' : 'gap-3'
      }`}
      aria-label="Pagination"
    >
      <PageLink
        disabled={currentPage === 1}
        arrow={true}
        onClick={() => {
          if (setCurrentPage !== undefined) {
            setCurrentPage(currentPage - 1)
          }
        }}
        type={type}
      >
        <ArrowIcon
          iconType={`${type === 'table' ? 'chervon' : 'teeny'}`}
        ></ArrowIcon>
      </PageLink>
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
      <PageLink
        disabled={currentPage === pageSize}
        arrow={true}
        onClick={() => {
          if (setCurrentPage !== undefined) {
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
      {type === 'row' && (
        <li
          className="ml-6 text-sm leading-4.5 text-bw-1 underline font-semibold cursor-pointer"
          onClick={() => {
            setPageNums(activeShowAll ? arrPage : getPagination)
            setActiveShowAll(!activeShowAll)
          }}
        >
          {activeShowAll ? 'Show All' : 'Show Less'}
        </li>
      )}
    </ul>
  )
}

export default Pagination
