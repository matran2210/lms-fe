import Pagination from 'src/components/base/pagination/Pagination'
import { Dispatch, SetStateAction, ReactNode } from 'react'

interface IProps {
  currentPage: number
  setCurrentPage?: Dispatch<SetStateAction<number>>
  pageSize: number
  setPageSize?: Dispatch<SetStateAction<number>>
  totalItems: number
  children?: ReactNode
}

const PaginationSAPP = ({
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  totalItems,
}: IProps) => {
  const options = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ]

  const handlePageChange = (size: number) => {
    setCurrentPage && setCurrentPage(1)
    setPageSize && setPageSize(size)
  }

  return (
    <>
      <div className="flex items-center justify-between mt-5 flex-wrap gap-4 ">
        <label className="flex items-center">
          <span className="text-xsm font-semibold text-gray-5 mr-2.5">
            Show
          </span>
          <select
            onChange={(e) => {
              const pageNumber = parseInt(e.target.value)
              handlePageChange(pageNumber)
            }}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="text-xsm font-semibold text-gray-5 ml-2.5">
            of {totalItems} entries
          </span>
        </label>
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={Math.ceil(totalItems / pageSize)}
          maxLength={9}
        />
      </div>
    </>
  )
}

export default PaginationSAPP
