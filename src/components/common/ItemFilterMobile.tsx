import { CheckIconV2 } from '@assets/icons'
import clsx from 'clsx'
import { Dispatch, SetStateAction, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import {
  IOpenChooseItem,
  SectionDropdownFormValues,
  SectionField,
} from 'src/type'

interface IProps {
  openChooseItem: IOpenChooseItem
  item: any
  setOpenChooseItem: Dispatch<SetStateAction<IOpenChooseItem>>
  setValue: UseFormSetValue<SectionDropdownFormValues>
}

const ItemFilterMobile = ({
  openChooseItem,
  item,
  setOpenChooseItem,
  setValue,
}: IProps) => {
  const [selected, setSelected] = useState({
    type: openChooseItem.name,
    id: item.id,
  })
  return (
    <div
      className="mt-3 flex items-center justify-between py-2"
      onClick={() => {
        setOpenChooseItem({
          ...openChooseItem,
          params: item.id,
        })
        setValue(openChooseItem.name.toLowerCase() as SectionField, item.id)
        setSelected({
          type: openChooseItem.name,
          id: item.id,
        })
      }}
    >
      <div
        className={clsx(
          'text-sm font-medium text-gray-800',
          selected.id === item.id && 'text-primary',
        )}
      >
        {item.name}
      </div>
      <div>{selected.id === item.id && <CheckIconV2 />}</div>
    </div>
  )
}

export default ItemFilterMobile
