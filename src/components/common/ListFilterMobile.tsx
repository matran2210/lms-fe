import { CollapseArrowIcon } from '@assets/icons'
import clsx from 'clsx'
import { Dispatch, SetStateAction } from 'react'
import { UseFormWatch } from 'react-hook-form'
import {
  IOpenChooseItem,
  SectionDropdownFormValues,
  SectionField,
} from 'src/type'

interface IProps {
  watch: UseFormWatch<SectionDropdownFormValues>
  setOpenChooseItem: Dispatch<SetStateAction<IOpenChooseItem>>
}

const ListFilterMobile = ({ watch, setOpenChooseItem }: IProps) => {
  const list = [
    {
      id: 1,
      name: 'Section',
      isDisabled: false,
      type: 'section',
    },
    {
      id: 2,
      name: 'Subsection',
      isDisabled: watch('section') === null,
      type: 'subsection',
    },
    {
      id: 3,
      name: 'Unit',
      isDisabled: watch('activity') === null,
      type: 'unit',
    },
    {
      id: 4,
      name: 'Activity',
      isDisabled: watch('unit') === null,
      type: 'activity',
    },
  ]

  return (
    <div className="flex flex-col">
      {list.map((item) => (
        <div
          key={item.id}
          className={clsx(
            'flex items-center justify-between py-2',
            item.isDisabled ? 'text-gray-400' : 'text-gray-800',
          )}
          onClick={() => {
            if (item.isDisabled) return
            setOpenChooseItem({
              isOpen: true,
              type: item.type as SectionField,
              name: item.name,
            })
          }}
        >
          <div className="text-sm font-normal">{item.name}</div>
          <div>
            <CollapseArrowIcon className="rotate-[270deg]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ListFilterMobile
