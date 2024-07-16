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
          `flex items-center justify-center md:justify-between flex-wrap gap-4 overflow-hidden`,
          classname,
        )}
      >
        {type === 'table' && (
          <label className="flex items-center">
            <span className="text-xsm text-gray-1 mr-2.5">Show</span>
            <select
              className="shadow-0 border-0 bg-gray-4 py-1 px-2.5 cursor-pointer w-[70px]"
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
            <span className="text-xsm text-gray-1 ml-2.5">
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
