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
import {
  IOpenChooseItem,
  getTypeName,
  SectionDropdownFormValues,
  SectionField,
  nextTypeMap,
  allTypes,
} from 'src/type'
import ItemFilterMobile from './ItemFilterMobile'

interface IProps {
  setOpenChooseItem: Dispatch<SetStateAction<IOpenChooseItem>>
  openChooseItem: IOpenChooseItem
  watch: UseFormWatch<SectionDropdownFormValues>
  setValue: UseFormSetValue<SectionDropdownFormValues>
  backFilter: string
  setBackFilter: Dispatch<SetStateAction<string>>
  listSection: any[]
  listSubsection: any[]
  listUnit: any[]
  listActivity: any[]
  setListSection: Dispatch<SetStateAction<any[]>>
  setListSubsection: Dispatch<SetStateAction<any[]>>
  setListUnit: Dispatch<SetStateAction<any[]>>
  setListActivity: Dispatch<SetStateAction<any[]>>
}

const ListItemFilterMobile = ({
  setOpenChooseItem,
  openChooseItem,
  watch,
  setValue,
  backFilter,
  setBackFilter,
  listSection,
  listSubsection,
  listUnit,
  listActivity,
  setListSection,
  setListSubsection,
  setListUnit,
  setListActivity,
}: IProps) => {
  const selectedSection = watch('section')
  const selectedSubsection = watch('subsection')
  const selectedUnit = watch('unit')
  const selectedActivity = watch('activity')

  const [list, setList] = useState<any[]>([])
  const resetFormFields = (fields: SectionField[]) => {
    fields.forEach((field) => setValue(field, null))
  }
  const handleChange = (
    fieldName: SectionField,
    selected: string | null,
    fieldsToReset: SectionField[],
  ) => {
    setValue(fieldName, selected)
    resetFormFields(fieldsToReset)
    if (fieldName === 'section') {
      setListSubsection([])
      setListUnit([])
      setListActivity([])
    } else if (fieldName === 'subsection') {
      setListUnit([])
      setListActivity([])
    } else if (fieldName === 'unit') {
      setListActivity([])
    }
  }
  const { sections, fetchInitialSections, isLoading } = useInitialSections()
  const {
    sections: subSections,
    fetchSections: fetchSubsections,
    isLoading: isLoadingSubsections,
  } = useSectionData(selectedSection, 'CHAPTER')
  const {
    sections: units,
    fetchSections: fetchUnits,
    isLoading: isLoadingUnits,
  } = useSectionData(selectedSubsection, 'UNIT')
  const {
    sections: activities,
    fetchSections: fetchActivities,
    isLoading: isLoadingActivities,
  } = useSectionData(selectedUnit, 'ACTIVITY')

  useEffect(() => {
    if (!isEmpty(listSubsection)) return
    if (selectedSection) fetchSubsections(DEFAULT_PAGE_SIZE)
    else setListSubsection([])
  }, [selectedSection])
  useEffect(() => {
    if (!isEmpty(listUnit)) return
    if (selectedSubsection) fetchUnits(DEFAULT_PAGE_SIZE)
    else setListUnit([])
  }, [selectedSubsection])
  useEffect(() => {
    if (!isEmpty(listActivity)) return
    if (selectedUnit) fetchActivities(DEFAULT_PAGE_SIZE)
    else setListActivity([])
  }, [selectedUnit])

  useEffect(() => {
    if (isEmpty(subSections)) return
    setListSubsection(subSections)
  }, [subSections])
  useEffect(() => {
    if (isEmpty(units)) return
    setListUnit(units)
  }, [units])
  useEffect(() => {
    if (isEmpty(activities)) return
    setListActivity(activities)
  }, [activities])
  useEffect(() => {
    if (isEmpty(sections)) return
    setListSection(sections)
  }, [sections])

  useEffect(() => {
    if (!isEmpty(listSection)) return
    fetchInitialSections(DEFAULT_PAGE_SIZE)
  }, [])

  useEffect(() => {
    if (
      isEmpty(listSection) &&
      isEmpty(listSubsection) &&
      isEmpty(listUnit) &&
      isEmpty(listActivity)
    )
      return

    switch (openChooseItem.type) {
      case 'section':
        setList(listSection)
        break
      case 'subsection':
        setList(listSubsection)
        break
      case 'unit':
        setList(listUnit)
        break
      case 'activity':
        setList(listActivity)
        break
      default:
        setList(listSection)
        break
    }
  }, [listSection, listSubsection, listUnit, listActivity, openChooseItem.type])

  if (
    isEmpty(list) ||
    isLoading ||
    isLoadingSubsections ||
    isLoadingUnits ||
    isLoadingActivities
  )
    return null
  return (
    <>
      {list.map((item: any) => {
        const isSelected =
          selectedSection === item.id ||
          selectedSubsection === item.id ||
          selectedUnit === item.id ||
          selectedActivity === item.id
        return (
          <div
            key={item.id}
            className="mt-3 flex items-center justify-between py-2"
            onClick={() => {
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
                  ? openChooseItem.type
                  : nextTypeMap[openChooseItem.type]
              const name = getTypeName[type]
              setOpenChooseItem({
                ...openChooseItem,
                params: item.id,
                type: type,
                name: name,
              })
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
