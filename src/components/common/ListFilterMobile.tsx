import { CollapseArrowIcon } from '@assets/icons'
import clsx from 'clsx'
import { isEmpty, set } from 'lodash'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { DEFAULT_PAGE_SIZE } from 'src/constants'
import { useInitialSections } from 'src/hooks/useInitialSections'
import { useSectionData } from 'src/hooks/useSectionData'
import { IOpenChooseItem, ISection, SectionField } from 'src/type'

interface IList {
  id: number
  name: string
  isDisabled: boolean
  type: SectionField
}

const ListFilterMobile = ({
  setOpenChooseItem,
  listSection,
  listSubsection,
  listUnit,
  listActivity,
  setListSection,
  setListSubsection,
  setListUnit,
  setListActivity,
}: {
  setOpenChooseItem: Dispatch<SetStateAction<any>>
  listSection: ISection[]
  listSubsection: ISection[]
  listUnit?: ISection[]
  listActivity: ISection[]
  setListSection: Dispatch<SetStateAction<ISection[]>>
  setListSubsection: Dispatch<SetStateAction<ISection[]>>
  setListUnit?: Dispatch<SetStateAction<ISection[]>>
  setListActivity: Dispatch<SetStateAction<ISection[]>>
}) => {
  const { sections, fetchInitialSections, isLoading } = useInitialSections()
  const { watch } = useFormContext()
  const [list, setList] = useState<IList[]>([])
  const selected = {
    section: watch('section'),
    subsection: watch('subsection'),
    unit: watch('unit'),
    activity: watch('activity'),
  }
  const subsectionData = useSectionData(selected.section, 'CHAPTER')
  const unitData = useSectionData(selected.subsection, 'UNIT')
  const activityData = useSectionData(selected.subsection, 'ACTIVITY')
  const sectionNameSection = listSection?.find(
    (item) => item.id === selected.section,
  )?.name
  const sectionNameSubsection = listSubsection?.find(
    (item) => item.id === selected.subsection,
  )?.name
  const sectionNameUnit = listUnit?.find(
    (item) => item.id === selected.unit,
  )?.name
  const sectionNameActivity = listActivity?.find(
    (item) => item.id === selected.activity,
  )?.name

  const handleClick = (item: IList) => {
    if (item.isDisabled) return
    setOpenChooseItem({
      isOpen: true,
      type: item.type as SectionField,
      name: item.name,
    })
  }

  useEffect(() => {
    setList([
      {
        id: 1,
        name: sectionNameSection || 'Section',
        isDisabled: false,
        type: 'section',
      },
      {
        id: 2,
        name: sectionNameSubsection || 'Subsection',
        isDisabled: !watch('section'),
        type: 'subsection',
      },
      {
        id: 3,
        name: sectionNameUnit || 'Unit',
        isDisabled: !watch('subsection'),
        type: 'unit',
      },
      {
        id: 4,
        name: sectionNameActivity || 'Activity',
        isDisabled: !watch('unit'),
        type: 'activity',
      },
    ])
  }, [
    sectionNameSection,
    sectionNameSubsection,
    sectionNameUnit,
    sectionNameActivity,
  ])

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
