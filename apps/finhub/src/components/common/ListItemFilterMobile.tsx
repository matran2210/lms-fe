import { CheckIconV2 } from '@assets/icons'
import {
  allTypes,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SELECT_SECTION,
  DEFAULT_SELECT_SECTION_NAME,
  getTypeName,
  IOpenChooseItem,
  ISection,
  nextTypeMap,
  SectionField,
} from '@lms/core'
import clsx from 'clsx'
import { isEmpty } from 'lodash'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useInitialSections } from 'src/hooks/useInitialSections'
import { useSectionData } from 'src/hooks/useSectionData'

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
  const { watch, setValue } = useFormContext()
  const selected = {
    section: watch('section'),
    subsection: watch('subsection'),
    unit: watch('unit'),
    activity: watch('activity'),
  }

  const [list, setList] = useState<ISection[]>([])

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

  // SECTION FETCHING HOOKS
  const { sections, fetchInitialSections, isLoading } = useInitialSections()
  const subsectionData = useSectionData(selected.section, 'CHAPTER')
  const unitData = useSectionData(selected.subsection, 'UNIT')
  const activityData = useSectionData(selected.subsection, 'ACTIVITY')

  // FETCH section on mount
  useEffect(() => {
    if (isEmpty(listSection)) {
      fetchInitialSections(DEFAULT_PAGE_SIZE)
    }
  }, [])

  // FETCH dynamic based on selection
  useEffect(() => {
    if (selected.section && isEmpty(listSubsection)) {
      subsectionData.fetchSections(DEFAULT_PAGE_SIZE)
    }
  }, [selected.section])

  useEffect(() => {
    if (selected.subsection && isEmpty(listUnit)) {
      unitData.fetchSections(DEFAULT_PAGE_SIZE)
    }
  }, [selected.subsection])

  useEffect(() => {
    if (selected.subsection && isEmpty(listActivity)) {
      //Đạt check
      activityData.fetchSections(DEFAULT_PAGE_SIZE)
    }
  }, [selected.subsection])

  // SET list after fetch
  useEffect(() => {
    if (!isEmpty(sections)) setListSection(sections)
  }, [sections])

  useEffect(() => {
    if (!isEmpty(subsectionData.sections))
      setListSubsection(subsectionData.sections)
  }, [subsectionData.sections])

  useEffect(() => {
    if (!isEmpty(unitData.sections))
      setListUnit && setListUnit(unitData.sections)
  }, [unitData.sections])

  useEffect(() => {
    if (!isEmpty(activityData.sections)) setListActivity(activityData.sections)
  }, [activityData.sections])

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
  const isAnyLoading =
    isLoading || subsectionData.isLoading || activityData.isLoading

  if (isAnyLoading) return null

  return (
    <div className="flex min-h-1 flex-1 flex-col">
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
