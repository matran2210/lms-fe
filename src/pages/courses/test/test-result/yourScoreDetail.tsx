import SappTable from '@components/base/SappTable'
import { Dispatch } from '@reduxjs/toolkit'
import { SetStateAction } from 'react'

interface IProps {
  currentPage?: number
  setCurrentPage?: Dispatch<SetStateAction<any>>
  DetailScoreList: any
  loading: boolean
  setLoading?: Dispatch<SetStateAction<any>>
  handleChangeParams?: (currenPage: number, size: number) => void
  fetchClassList?: (
    currentPage: number,
    pageSize: number,
    params?: Object,
  ) => void
  filterParams?: Object
  pageSize?: number
  getParams?: any
  queryParams?: any
  checkedList?: any
  toggleCheck?: any
  toggleCheckAll?: any
  isCheckedAll?: boolean
}
const headers = [
  {
    label: '#',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold min-w-62px',
  },
  {
    label: 'Question',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold min-w-[210px]',
  },
  {
    label: 'Section',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold min-w-[210px]',
  },
  {
    label: 'Type',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold  min-w-[117px]',
  },
  {
    label: 'Result',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold  min-w-[70px]',
  },
  {
    label: '',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold min-w-[117px]',
  },
  {
    label: 'Time Spent',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold min-w-62px',
  },
]

// Config ListResults

const Data = [
  {
    id: '1',
    question: 'Quantitative methods',
    type: 'Multiple Choice',
    section: 'EU',
    result: 'Correct',
    progress: '23%',
    timespent: 120,
    page_index: 1,
    page_size: 10,
  },
  {
    id: '2',
    question: 'Quantitative methods',
    type: 'Multiple Choice',
    section: 'EU',
    result: 'Incorrect',
    progress: '23%',
    timespent: 142,
    page_index: 2,
    page_size: 10,
  },
  {
    id: '2',
    question: 'Quantitative methods',
    type: 'Multiple Choice',
    section: 'EU',
    result: 'Unfinished',
    timespent: '',
    page_index: 2,
    page_size: 10,
  },
]

const YourScoreDetail = () => {
  return (
    <div className="bg-white px-24 py-6 max-w-[1144px] max-h-[700px]">
      <div className="">
        <SappTable
          headers={headers}
          loading={true}
          data={Data}
          isCheckedAll={true}
          onChange={() => {}}
          hasCheck={false}
        >
          <>
            {Data?.map((e: any, index: number) => {
              //const isChecked = checkedList.includes(e.id)
              return (
                <tr key={e.id}>
                  <td className="text-start m-6">{e.id}</td>
                  {/* <td>
                    {index + 1 + (Data.page_index - 1) * Data.page_size}
                  </td> */}
                  <td className="text-start m-6">
                    <div className="text-gray-600 sapp-text-truncate-1">
                      {e?.question}
                    </div>
                  </td>
                  <td className="text-start m-6">{e.section}</td>
                  <td className="text-start m-6">
                    <div className="mt-6 mr-6 mb-6">{e.type}</div>
                  </td>
                  <td
                    className="text-start m-6"
                    style={{
                      color:
                        e.result === 'Correct'
                          ? '#008000'
                          : e.result === 'Incorrect'
                            ? '#D35563'
                            : '#D35563',
                    }}
                  >
                    {e?.result ?? '-'}
                  </td>
                  <td className="text-start m-6 text-gray-1">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '5px',
                      }}
                    >
                      {e.result === 'Correct' && (
                        <img
                          src="https://file.rendit.io/n/OiFcovF8STzKyMYRzNk0.svg"
                          alt="Correct"
                          className="w-4"
                          style={{ color: '#008000', marginRight: '5px' }}
                        />
                      )}
                      {e.result === 'Incorrect' && (
                        <img
                          src="https://file.rendit.io/n/OiFcovF8STzKyMYRzNk0.svg"
                          alt="Incorrect"
                          className="w-4"
                          style={{ color: '#D35563', marginRight: '5px' }}
                        />
                      )}
                      {e.progress}
                    </div>
                  </td>
                  <td className="text-start m-6">
                    <div>
                      {(() => {
                        if (
                          typeof e.timespent !== 'undefined' &&
                          e.timespent !== ''
                        ) {
                          const hours = Math.floor(Number(e.timespent) / 60)
                          const minutes = Number(e.timespent) % 60
                          return `${hours.toString().padStart(2, '0')}:${minutes
                            .toString()
                            .padStart(2, '0')}`
                        } else {
                          return '---'
                        }
                      })()}
                    </div>
                  </td>
                </tr>
              )
            })}
          </>
        </SappTable>
      </div>
    </div>
  )
}

export default YourScoreDetail
