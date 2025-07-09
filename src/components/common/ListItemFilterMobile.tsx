import { CheckIconV2 } from '@assets/icons'
import {
  useInitialSections,
  useSectionData,
} from '@components/mycourses/FilterCourseSection'
import clsx from 'clsx'
import { isEmpty } from 'lodash'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { DEFAULT_PAGE_SIZE } from 'src/constants'
import { SectionDropdownFormValues, SectionField } from 'src/type'

interface IProps {
  setOpenChooseItem: Dispatch<
    SetStateAction<{
      isOpen: boolean
      listItem: any
      name: string
      params: string
    }>
  >
  openChooseItem: {
    isOpen: boolean
    listItem: any
    name: string
    params: string
  }
  watch: UseFormWatch<SectionDropdownFormValues>
  setValue: UseFormSetValue<SectionDropdownFormValues>
  backFilter: string
  setBackFilter: Dispatch<SetStateAction<string>>
}

const ListItemFilterMobile = ({
  setOpenChooseItem,
  openChooseItem,
  watch,
  setValue,
  backFilter,
  setBackFilter,
}: IProps) => {
  const selectedSection = watch('section')
  const selectedSubsection = watch('subsection')
  const selectedUnit = watch('unit')
  const selectedActivity = watch('activity')

  const { sections, fetchInitialSections } = useInitialSections()
  const { sections: subSections, fetchSections: fetchSubsections } =
    useSectionData(selectedSection, 'CHAPTER')
  const { sections: units, fetchSections: fetchUnits } = useSectionData(
    selectedSubsection,
    'UNIT',
  )
  const { sections: activities, fetchSections: fetchActivities } =
    useSectionData(selectedUnit, 'ACTIVITY')

  const [selectedItem, setSelectedItem] = useState<{
    id: string
    type: string
  }>()

  useEffect(() => {
    fetchSubsections(DEFAULT_PAGE_SIZE)
  }, [selectedSection])

  useEffect(() => {
    fetchUnits(DEFAULT_PAGE_SIZE)
  }, [selectedSubsection])

  useEffect(() => {
    fetchActivities(DEFAULT_PAGE_SIZE)
  }, [selectedUnit])

  useEffect(() => {
    if (isEmpty(subSections)) return
    setOpenChooseItem({
      ...openChooseItem,
      listItem: subSections,
      name: 'Subsection',
    })
  }, [subSections])

  useEffect(() => {
    if (isEmpty(units)) return
    setOpenChooseItem({ ...openChooseItem, listItem: units, name: 'Unit' })
  }, [units])

  useEffect(() => {
    if (isEmpty(activities)) return
    setOpenChooseItem({
      ...openChooseItem,
      listItem: activities,
      name: 'Activity',
    })
  }, [activities])

  useEffect(() => {
    if (backFilter && openChooseItem.isOpen) {
      const listItem =
        backFilter === 'Section'
          ? sections
          : backFilter === 'Subsection'
            ? subSections
            : units

      setOpenChooseItem({
        ...openChooseItem,
        listItem: listItem,
        name: backFilter,
      })
    }
  }, [backFilter])

  useEffect(() => {
    if (isEmpty(sections)) return
    setOpenChooseItem({ ...openChooseItem, listItem: sections })
  }, [sections])

  // useEffect(() => {
  //   if (isEmpty(openChooseItem.listItem)) return
  //   const listItem =
  //     openChooseItem.name === 'Section'
  //       ? sections
  //       : openChooseItem.name === 'Subsection'
  //         ? subSections
  //         : units
  //   setOpenChooseItem({ ...openChooseItem, listItem: listItem })
  // }, [openChooseItem.listItem])

  useEffect(() => {
    fetchInitialSections(DEFAULT_PAGE_SIZE)
  }, [])

  if (isEmpty(openChooseItem.listItem)) return null
  return (
    <>
      {openChooseItem.listItem.map((item: any) => {
        const isSelected = selectedItem?.id === item.id
        return (
          <div
            key={item.id}
            className="mt-3 flex items-center justify-between py-2"
            onClick={() => {
              setSelectedItem({ id: item.id, type: openChooseItem.name })
              setOpenChooseItem({
                ...openChooseItem,
                params: item.id,
              })
              setValue(
                openChooseItem.name.toLowerCase() as SectionField,
                item.id,
              )
            }}
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
    </>
  )
}

export default ListItemFilterMobile
