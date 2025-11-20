import { CheckIconV2 } from '@assets/icons'
import clsx from 'clsx'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  DEFAULT_SELECT_SECTION,
  DEFAULT_SELECT_SECTION_NAME,
} from 'src/constants'
import {
  IOpenChooseItem,
  getTypeName,
  SectionField,
  nextTypeMap,
  allTypes,
  ISection,
} from 'src/type'
import { useCourseSectionsData } from 'src/hooks/useCourseSectionsData'

interface IProps {
  setOpenChooseItem: Dispatch<SetStateAction<any>>
  openChooseItem: IOpenChooseItem
  listSection: ISection[]
  listSubsection: ISection[]
  listUnit?: ISection[]
  listActivity: ISection[]
  setListSection: Dispatch<SetStateAction<ISection[]>>
  setListSubsection: Dispatch<SetStateAction<ISection[]>>
  setListUnit?: Dispatch<SetStateAction<ISection[]>>
  setListActivity: Dispatch<SetStateAction<ISection[]>>
}

const ListItemFilterMobile = ({
  setOpenChooseItem,
  openChooseItem,
  listSection,
  listSubsection,
  listUnit,
  listActivity,
  setListSection,
  setListSubsection,
  setListUnit,
  setListActivity,
}: IProps) => {
  const { setValue } = useFormContext()
  const [list, setList] = useState<ISection[]>([])
  const { isLoading, selected } = useCourseSectionsData({
    listSection,
    listSubsection,
    listUnit,
    listActivity,
    setListSection,
    setListSubsection,
    setListUnit,
    setListActivity,
  })
  const resetFormFields = (fields: SectionField[]) => {
    fields.forEach((field) => setValue(field, null))
  }

  const handleChange = (
    fieldName: SectionField,
    selectedId: string | null,
    fieldsToReset: SectionField[],
  ) => {
    setValue(fieldName, selectedId)
    resetFormFields(fieldsToReset)

    const clearMap = {
      section: () => {
        setListSubsection([])
        setListUnit && setListUnit([])
        setListActivity([])
      },
      subsection: () => {
        setListUnit && setListUnit([])
        setListActivity([])
      },
      unit: () => setListActivity([]),
    }

    clearMap[fieldName as keyof typeof clearMap]?.()
  }

  const handleSelect = (item: ISection, isSelected: boolean) => {
    if (!isSelected) {
      const currentIndex = allTypes.indexOf(
        openChooseItem.type as (typeof allTypes)[number],
      )
      const childTypes =
        currentIndex >= 0 ? allTypes.slice(currentIndex + 1) : []
      handleChange(openChooseItem.type, item.id, childTypes)
    }

    const type =
      openChooseItem.type === 'activity'
        ? 'activity'
        : nextTypeMap[openChooseItem.type]
    const name = getTypeName[type]

    setOpenChooseItem({
      ...openChooseItem,
      params: item.id,
      type,
      name,
    })
  }

  // SELECT list to render
  useEffect(() => {
    const map: Record<string, ISection[]> = {
      section: (DEFAULT_SELECT_SECTION as unknown as ISection[]).concat(
        listSection,
      ),
      subsection: listSubsection,
      unit: listUnit ?? [],
      activity: listActivity,
    }
    setList(map[openChooseItem.type] ?? [])
  }, [openChooseItem.type, listSection, listSubsection, listUnit, listActivity])

  const hasSelectedOption = Object.values(selected).some((value) => !!value)

  // COMBINED loading check
  const isAnyLoading = isLoading

  if (isAnyLoading) return null

  return (
    <div className="flex max-h-[230px] min-h-1 flex-1 flex-col overflow-y-auto">
      {list?.map((item) => {
        const isSelectedValue =
          selected.section === item.id ||
          selected.subsection === item.id ||
          selected.activity === item.id || 
          selected.unit === item.id

        const isSelected =
          item.name === DEFAULT_SELECT_SECTION_NAME
            ? !hasSelectedOption
            : isSelectedValue

        return (
          <div
            key={item.id}
            className="flex items-center justify-between py-2"
            onClick={() => handleSelect(item, isSelected)}
          >
            <div
              className={clsx(
                'text-sm font-medium text-gray-800',
                isSelected && 'text-primary',
              )}
            >
              {item.name}
            </div>
            <div>{isSelected && <CheckIconV2 />}</div>
          </div>
        )
      })}
    </div>
  )
}

export default ListItemFilterMobile
