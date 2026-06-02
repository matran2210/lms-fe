import { Pagination, Select } from 'antd'
import { Dispatch, ReactNode, SetStateAction, useCallback } from 'react'
import clsx from 'clsx'
import { RightOutlined, AntSelectIcon } from '@lms/assets'

interface IProps {
  currentPage: number
  setCurrentPage?: (page: number) => void
  pageSize: number
  setPageSize?: (pageSize: number) => void
  totalItems: number
  classname?: string
}

const PaginationSapp = ({
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  totalItems,
  classname = 'mt-8',
}: IProps) => {
  const options = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
  ]
  const handlePageChangeIndex = useCallback(
    (page: number) => {
      setCurrentPage?.(page)
    },
    [currentPage, setCurrentPage],
  )

  const handleChangePageSize = useCallback(
    (value: number) => {
      setPageSize?.(value)
    },
    [setPageSize, pageSize],
  )

  const renderItem = (
    page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    originalElement: ReactNode,
  ) => {
    if (type === 'next') {
      return (
        <div className="flex items-center gap-1">
          <div className="text-base font-medium text-gray-600">Next</div>
          <div>
            <RightOutlined />
          </div>
        </div>
      )
    }
    if (type === 'prev') {
      if (currentPage < 2) return null
      return (
        <div className="flex items-center gap-1">
          <div>
            <RightOutlined className="rotate-180" />
          </div>
          <div className="text-base font-medium text-gray-600">Previous</div>
        </div>
      )
    }

    return <div>{originalElement}</div>
  }

  return (
    <>
      <div className={clsx(`flex justify-end gap-4`, classname)}>
        <label className="flex items-center">
          <span className="mr-2 text-base font-normal leading-normal text-gray-800">
            Columns per page:
          </span>
          <Select
            value={pageSize}
            onChange={(value) => handleChangePageSize(value)}
            options={options}
            className="custom-ant-select"
            popupClassName="select-card-course"
            suffixIcon={<AntSelectIcon />}
            dropdownStyle={{ minWidth: 60 }}
          />
        </label>

        <Pagination
          total={totalItems}
          pageSize={pageSize}
          className="custom-ant-pagination"
          current={currentPage}
          onChange={handlePageChangeIndex}
          showSizeChanger={false}
          itemRender={(page, type, originalElement) => {
            return renderItem(page, type, originalElement)
          }}
        />
      </div>
    </>
  )
}

export default PaginationSapp
