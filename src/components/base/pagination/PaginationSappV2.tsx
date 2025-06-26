import { Pagination, Select } from 'antd'
import { Dispatch, ReactNode, SetStateAction, useCallback } from 'react'
import clsx from 'clsx'
import { RightOutlined, AntSelectIcon } from '@assets/icons'

interface IProps {
  currentPage: number
  setCurrentPage?: Dispatch<SetStateAction<number>>
  pageSize: number
  setPageSize?: Dispatch<SetStateAction<number>>
  totalItems: number
  classname?: string
}

const PaginationSappV2 = ({
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
  const handlePageChange = useCallback(
    (page: number, newSize?: number) => {
      const size = newSize || pageSize
      setPageSize?.(size)
      setCurrentPage?.(page)
    },
    [pageSize, setPageSize, setCurrentPage],
  )

  const renderItem = (
    page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    originalElement: ReactNode,
  ) => {
    if (type === 'next') {
      return (
        <div className="flex items-center gap-1 ">
          <div className="font-medium text-gray-600">Next</div>
          <div>
            <RightOutlined />
          </div>
        </div>
      )
    }
    if (type === 'prev') {
      if (currentPage < 2) return null
      return (
        <div className="flex items-center gap-1 ">
          <div>
            <RightOutlined className="rotate-180" />
          </div>
          <div className="font-medium text-gray-600">Previous</div>
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
            onChange={(value) => handlePageChange(1, value)}
            options={options}
            className="custom-ant-select"
            suffixIcon={<AntSelectIcon />}
            dropdownStyle={{ minWidth: 60 }}
          />
        </label>

        <Pagination
          total={totalItems}
          pageSize={pageSize}
          className="custom-ant-pagination"
          current={currentPage}
          onChange={handlePageChange}
          showSizeChanger={false}
          itemRender={(page, type, originalElement) => {
            return renderItem(page, type, originalElement)
          }}
        />
      </div>
    </>
  )
}

export default PaginationSappV2
