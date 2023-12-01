import Pagination from 'src/components/base/pagination/Pagination'
import { Dispatch, SetStateAction, ReactNode } from 'react'

interface IProps {
  currentPage: number
  setCurrentPage?: Dispatch<SetStateAction<number>>
  pageSize: number
  setPageSize?: Dispatch<SetStateAction<number>>
  totalItems: number
  type?: 'row' | 'table'
  children?: ReactNode
}

const PaginationSAPP = ({
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  totalItems,
  type,
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
      <div
        className={`flex items-center justify-center md:justify-between mt-4 flex-wrap gap-4 overflow-hidden`}
      >
        {type === 'table' && (
          <label className="flex items-center">
            <span className="text-xsm font-semibold text-gray-5 mr-2.5">
              Show
            </span>
            <select
              className="rounded-md shadow-0 border-0 bg-gray-4 py-0 px-2.5 cursor-pointer w-[70px]"
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
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={Math.ceil(totalItems / pageSize)}
          maxLength={`${type === 'table' ? 9 : 35}`}
          totalItems={totalItems}
          type={type}
        />
      </div>
    </>
  )
}

export default PaginationSAPP
