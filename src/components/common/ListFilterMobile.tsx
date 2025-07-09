import { CollapseArrowIcon } from '@assets/icons'
import clsx from 'clsx'
import { Dispatch, SetStateAction } from 'react'
import { UseFormWatch } from 'react-hook-form'
import { SectionDropdownFormValues } from 'src/type'

interface IProps {
  watch: UseFormWatch<SectionDropdownFormValues>
  setOpenChooseItem: Dispatch<
    SetStateAction<{
      isOpen: boolean
      listItem: any
      name: string
      params: string
    }>
  >
}

const ListFilterMobile = ({ watch, setOpenChooseItem }: IProps) => {
  const list = [
    {
      id: 1,
      name: 'Section',
      isDisabled: false,
    },
    {
      id: 2,
      name: 'Subsection',
      isDisabled: watch('section') === null,
    },
    {
      id: 3,
      name: 'Unit',
      isDisabled: watch('activity') === null,
    },
    {
      id: 4,
      name: 'Activity',
      isDisabled: watch('unit') === null,
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
              listItem: [],
              name: item.name,
              params: '',
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
