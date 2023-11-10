import { getPaginationItems } from '../../common/pagination'
import PageLink from './PageLink'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  currentPage: number
  pageSize: number
  maxLength: number
  setCurrentPage?: Dispatch<SetStateAction<number>>
}

const Pagination = ({
  currentPage,
  pageSize,
  maxLength,
  setCurrentPage,
}: Props) => {
  const pageNums = getPaginationItems(currentPage, pageSize, maxLength)

  return (
    <ul className="pagination flex items-center gap-3" aria-label="Pagination">
      <PageLink
        disabled={currentPage === 1}
        onClick={() => {
          if (setCurrentPage !== undefined) {
            setCurrentPage(currentPage - 1)
          }
        }}
      >
        {'<'}
      </PageLink>
      {pageNums.map((pageNum, idx) => (
        <PageLink
          key={idx}
          active={currentPage === pageNum}
          disabled={isNaN(pageNum)}
          onClick={() => {
            if (setCurrentPage !== undefined) {
              setCurrentPage(pageNum)
            }
          }}
        >
          {!isNaN(pageNum) ? pageNum : '...'}
        </PageLink>
      ))}
      <PageLink
        disabled={currentPage === pageSize}
        onClick={() => {
          if (setCurrentPage !== undefined) {
            setCurrentPage(currentPage + 1)
          }
        }}
      >
        {'>'}
      </PageLink>
    </ul>
  )
}

export default Pagination
