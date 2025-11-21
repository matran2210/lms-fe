import { CheckIconV2 } from '@assets/icons'
import clsx from 'clsx'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import NoData from 'src/common/NoData'
import useSelectExams from 'src/hooks/useSelectExams'

const SelectExamDate = ({
  classId,
  currentValue,
  itemSelected,
  setItemSelected,
}: {
  classId: string
  currentValue?: string
  itemSelected?: string
  setItemSelected: React.Dispatch<React.SetStateAction<string>>
}) => {
  const { watch } = useFormContext()
  const { exams } = useSelectExams(classId)
  const options = exams?.data
    ?.map((exam) => ({
      label: exam?.examination?.name,
      value: exam?.id,
    }))
    ?.filter((item) => {
      return item.value !== currentValue
    })

  useEffect(() => {
    return () => {
      setItemSelected('')
    }
  }, [])

  if (isEmpty(options)) {
    return (
      <div className='flex items-center min-h-[290px] justify-center'>
        <NoData />
      </div>
    )
  }

  return (
    <div className="flex max-h-[240px] flex-1 flex-col overflow-y-auto">
      {options?.map((item) => {
        const isSelectedValue = itemSelected || watch('examination_subject_id')
        const isSelected = isSelectedValue === item.value

        return (
          <div
            key={item.value}
            className="flex items-center justify-between py-2"
            onClick={() => {
              setItemSelected(item.value)
            }}
          >
            <div
              className={clsx(
                'text-sm text-gray-800',
                isSelected && 'font-medium text-primary',
              )}
            >
              {item.label}
            </div>
            <div>{isSelected && <CheckIconV2 />}</div>
          </div>
        )
      })}
    </div>
  )
}

export default SelectExamDate
