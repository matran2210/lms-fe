import { CollapseArrowIcon } from '@assets/icons'
import clsx from 'clsx'
import { Dispatch, SetStateAction } from 'react'
import { useFormContext } from 'react-hook-form'
import { IOpenChooseItem, SectionField } from 'src/type/courses-3-level/course'

interface IProps {
  setOpenChooseItem: Dispatch<SetStateAction<IOpenChooseItem>>
}
interface IList {
  id: number
  name: string
  isDisabled: boolean
  type: SectionField
}

const ListFilterMobile = ({ setOpenChooseItem }: IProps) => {
  const { watch } = useFormContext()
  const list: IList[] = [
    {
      id: 1,
      name: 'Section',
      isDisabled: false,
      type: 'section',
    },
    {
      id: 2,
      name: 'Subsection',
      isDisabled: !watch('section'),
      type: 'subsection',
    },
    {
      id: 4,
      name: 'Activity',
      isDisabled: !watch('unit'),
      type: 'activity',
    },
  ]

  const handleClick = (item: IList) => {
    if (item.isDisabled) return
    setOpenChooseItem({
      isOpen: true,
      type: item.type as SectionField,
      name: item.name,
    })
  }

  return (
    <div className="flex flex-1 flex-col">
      {list.map((item) => (
        <div
          key={item.id}
          className={clsx(
            'flex items-center justify-between py-2',
            item.isDisabled ? 'text-gray-400' : 'text-gray-800',
          )}
          onClick={() => handleClick(item)}
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
