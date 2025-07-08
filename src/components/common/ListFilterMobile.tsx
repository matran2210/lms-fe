import { CollapseArrowIcon } from '@assets/icons'
import clsx from 'clsx'
import { UseFormWatch } from 'react-hook-form'
import { SectionDropdownFormValues } from 'src/type'

interface IProps {
  watch: UseFormWatch<SectionDropdownFormValues>
}

const ListFilterMobile = ({ watch }: IProps) => {
  const list = [
    {
      id: 1,
      name: 'Section',
      isDisabled: false,
    },
    {
      id: 2,
      name: 'Subsection',
      isDisabled: watch('subsection') === null,
    },
    {
      id: 3,
      name: 'Unit',
      isDisabled: watch('unit') === null,
    },
    {
      id: 4,
      name: 'Activity',
      isDisabled: watch('activity') === null,
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
