// ConfirmDialog.tsx
import SappTable from '@components/base/SappTable'
import SappModal from '@components/base/modal/SappModal'
import { Dispatch, FC, SetStateAction } from 'react'
import ResultTableRows from './ResultTableRows'
import Icon from '@components/icons'
import { trackGAEvent } from '@utils/google-analytics'

// define the props for the confirm dialog component
export type ResultRowsModalProps = {
  open: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
}

// define headers
const headers = [
  {
    label: 'Question',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold w-6-percent min-w-62px',
  },
  {
    label: 'Type',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold pl-11 w-18 min-w-165px',
  },
  {
    label: 'Part',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold w-3.6 min-w-400px',
  },
  {
    label: 'Chapter',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold w-17 min-w-190px',
  },
  {
    label: 'Result',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold min-w-132px',
  },
  {
    label: 'Time Spent',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold w-7-percent min-w-78px',
  },
]

// Config ListResults
const listResults = [
  {
    type: 'Matching',
    partName: 'Audit framework and regulation',
    chapter: 'Time value',
    correctStatus: true,
    status: 'Correct',
    statusPercentage: 29,
    statusIcon: 'global',
    time: 94,
  },
  {
    type: 'Multiple Choice',
    partName: 'Planning and risk management',
    chapter: 'Index value',
    correctStatus: false,
    status: 'Incorrect',
    statusPercentage: 14,
    statusIcon: 'global',
    time: 94,
  },
  {
    type: 'True/False',
    partName: 'Audit framework and regulation',
    chapter: 'Time value',
    correctStatus: true,
    status: 'Correct ',
    statusPercentage: 29,
    statusIcon: 'global',
    time: 94,
  },
  {
    type: 'Matching',
    partName: 'Audit framework and regulation',
    chapter: 'Time value',
    correctStatus: true,
    status: 'Correct ',
    statusPercentage: 29,
    statusIcon: 'global',
    time: 94,
  },
  {
    type: 'One Choice',
    partName: 'Audit framework and regulation',
    chapter: 'Time value',
    correctStatus: false,
    status: 'Incorrect',
    statusPercentage: 14,
    statusIcon: 'global',
    time: 94,
  },
  {
    type: 'Fill Up',
    partName: 'Audit framework and regulation',
    chapter: 'Time value',
    correctStatus: true,
    status: 'Correct ',
    statusPercentage: 29,
    statusIcon: 'global',
    time: 94,
  },
  {
    type: 'Drag Drop',
    partName: 'Audit framework and regulation',
    chapter: 'Time value',
    correctStatus: true,
    status: 'Correct ',
    statusPercentage: 29,
    statusIcon: 'global',
    time: 94,
  },
  {
    type: 'One Choice',
    partName: 'Audit framework and regulation',
    chapter: 'Time value',
    correctStatus: false,
    status: 'Incorrect',
    statusPercentage: 14,
    statusIcon: 'global',
    time: 94,
  },
  {
    type: 'Multiple Choice',
    partName: 'Audit framework and regulation',
    chapter: 'Time value',
    correctStatus: true,
    status: 'Correct ',
    statusPercentage: 29,
    statusIcon: 'global',
    time: 94,
  },
  {
    type: 'Fill Up',
    partName: 'Audit framework and regulation',
    chapter: 'Time value',
    correctStatus: true,
    status: 'Correct ',
    statusPercentage: 29,
    statusIcon: 'global',
    time: 94,
  },
  {
    type: 'One Choice',
    partName: 'Audit framework and regulation',
    chapter: 'Time value',
    correctStatus: true,
    status: 'Incorrect',
    statusPercentage: 14,
    statusIcon: 'global',
    time: 94,
  },
  {
    type: 'One Choice',
    partName: 'Audit framework and regulation',
    chapter: 'Time value',
    correctStatus: true,
    status: 'Incorrect',
    statusPercentage: 14,
    statusIcon: 'global',
    time: 94,
  },
  {
    type: 'Constructed',
    partName: 'Audit framework and regulation',
    chapter: 'Time value',
    correctStatus: true,
    status: 'Submitted',
    statusPercentage: 0,
    statusIcon: 'global',
    time: 94,
  },
  {
    type: 'Constructed',
    partName: 'Audit framework and regulation',
    chapter: 'Time value',
    correctStatus: true,
    status: 'Submitted',
    statusPercentage: 0,
    statusIcon: 'global',
    time: 0,
  },
  {
    type: 'Constructed',
    partName: 'Audit framework and regulation',
    chapter: 'Time value',
    correctStatus: false,
    status: 'Unfinished',
    statusPercentage: 0,
    statusIcon: 'global',
    time: 94,
  },
]

// create the confirm dialog component
const ResultRowsModal: FC<ResultRowsModalProps> = ({ open, setOpen }) => {
  const handleOnClick = () => {
    setOpen && setOpen(false)
  }

  return (
    <>
      <SappModal
        open={open}
        setOpen={setOpen}
        size="max-w-full w-full"
        refClass="max-h-100vh animate-jump-in relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all"
        childClass=""
        parentChildClass="max-w-xxl mx-auto px-6 2xl:px-0"
        footerButtonClassName="justify-center flex flex-row-reverse"
        color="danger"
        showHeader={false}
        showFooter={false}
      >
        <h2 className="text-xl font-bold text-bw-1 py-6">Your Score Details</h2>
        <div
          className="absolute right-4 top-2.5 p-2 cursor-pointer"
          onClick={() => {
            handleOnClick()
            trackGAEvent('Click Icon Close Your Score Details')
          }}
        >
          <Icon type="cross" />
        </div>
        <SappTable
          headers={headers}
          loading={false}
          data={[{}]}
          isCheckedAll={false}
          hasCheck={false}
          hasCheckAll={false}
          theadClass=""
          tbodyClass=""
          classTableRes="max-h-[calc(100vh-73px)]"
          onChange={() => {}}
        >
          <ResultTableRows resultTablerows={listResults} />
        </SappTable>
      </SappModal>
    </>
  )
}

export default ResultRowsModal
