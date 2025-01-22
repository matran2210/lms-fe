import Pagination from 'src/components/base/pagination/Pagination'
import { Dispatch, SetStateAction, ReactNode } from 'react'
import clsx from 'clsx'

interface IProps {
  currentPage: number
  setCurrentPage?: Dispatch<SetStateAction<number>>
  pageSize: number
  setPageSize?: Dispatch<SetStateAction<number>>
  totalItems: number
  type?: 'row' | 'table'
  children?: ReactNode
  optionShowAll?: ReactNode
  classname?: string
}

const PaginationSAPP = ({
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  totalItems,
  type,
  optionShowAll,
  classname,
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
        className={clsx(
          `flex flex-wrap items-center justify-center gap-4 overflow-hidden md:justify-between`,
          classname,
        )}
      >
        {type === 'table' && (
          <label className="flex items-center">
            <span className="mr-2.5 text-xsm text-gray-1">Show</span>
            <select
              className="w-[4.375rem] cursor-pointer border-0 bg-gray-4 px-2.5 py-1 shadow-0"
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
            <span className="ml-2.5 text-xsm text-gray-1">
              of {totalItems} entries
            </span>
          </label>
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={Math.ceil(totalItems / pageSize)}
          maxLength={`${type === 'table' ? 9 : totalItems}`}
          totalItems={totalItems}
          type={type}
          optionShowAll={optionShowAll}
        />
      </div>
    </>
  )
}

export default PaginationSAPP
