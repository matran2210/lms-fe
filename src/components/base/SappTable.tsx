import { ReactNode } from 'react'
import SAPPCheckbox from './checkbox/SAPPCheckbox'

interface IProps {
  headers?: Array<{ label: string; className?: string }>
  children: ReactNode
  loading?: boolean
  isCheckedAll: any
  onChange?: (e: any) => void
  hasCheckAll?: boolean
  hasCheck?: boolean
  showHeader?: boolean
  showHashtag?: boolean
  classTableRes?: string
  classTable?: string
  theadClass?: string
  tbodyClass?: string
  classString?: string
}

const SappTable = ({
  children,
  headers,
  loading,
  isCheckedAll,
  onChange,
  hasCheckAll = true,
  hasCheck = true,
  showHeader = true,
  showHashtag = false,
  classTableRes,
  classTable = 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer',
  theadClass,
  tbodyClass = '',
  classString = '',
}: IProps) => {
  return (
    <div
      className={`table-responsive relative overflow-x-auto ${classTableRes}`}
    >
      <table className={classTable}>
        {showHeader && (
          <thead className={`${theadClass}`}>
            <tr
              className={`text-muted fw-bolder fs-7 text-uppercase gs-0 text-start ${classString}`}
            >
              {hasCheck && (
                <th className="w-50px pr-5" scope="col">
                  {hasCheckAll && (
                    <SAPPCheckbox checked={isCheckedAll} onChange={onChange} />
                  )}
                </th>
              )}
              {showHashtag && (
                <th className="w-40px" style={{ lineHeight: '12px' }}>
                  #
                </th>
              )}
              {headers?.map((column) => (
                <th
                  key={column.label}
                  className={`${column.className} fs-7 fw-bold pr-4`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className={`fw-semibold text-bw-1 ${tbodyClass}`}>
          {children}
        </tbody>
      </table>
    </div>
  )
}

export default SappTable
