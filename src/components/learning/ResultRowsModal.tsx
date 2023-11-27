// ConfirmDialog.tsx
import SappTable from '@components/base/SappTable'
import SappModal from '@components/base/modal/SappModal'
import router from 'next/router'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import ResultTableRows from './ResultTableRows'
import Icon from '@components/icons'

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
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold w-[62px]',
  },
  {
    label: 'Type',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold pl-[45px]',
  },
  {
    label: 'Part',
    className: 'text-left pb-3 text-medium-sm text-gray-1 font-semibold',
  },
  {
    label: 'Chapter',
    className: 'text-left pb-3 text-medium-sm text-gray-1 font-semibold',
  },
  {
    label: 'Result',
    className: 'text-left pb-3 text-medium-sm text-gray-1 font-semibold',
  },
  {
    label: 'Time Spent',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold w-[78px]',
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
        size="max-w-full"
        refClass="max-h-100vh animate-jump-in relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all"
        childClass=""
        parentChildClass="max-w-6xl mx-auto"
        footerButtonClassName="justify-center flex flex-row-reverse"
        footerButtonState="danger"
        showHeader={false}
      >
        <h2 className="text-xl font-bold text-bw-1 py-6">Your Score Details</h2>
        <div
          className="absolute right-6 top-4 p-2 cursor-pointer"
          onClick={() => {
            handleOnClick()
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
          classTable="w-full"
          onChange={() => {}}
        >
          <ResultTableRows resultTablerows={listResults} />
        </SappTable>
      </SappModal>
    </>
  )
}

export default ResultRowsModal
