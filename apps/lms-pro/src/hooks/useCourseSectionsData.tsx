import { Dispatch, SetStateAction, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { DEFAULT_PAGE_SIZE } from '@lms/core'
import { ISection } from '@lms/core'
import { useInitialSections } from 'src/hooks/useInitialSections'
import { useSectionData } from 'src/hooks/useSectionData'
import { useFormContext } from 'react-hook-form'

interface IUseCourseSectionsDataProps {
  listSection: ISection[]
  listSubsection: ISection[]
  listUnit?: ISection[]
  listActivity: ISection[]
  setListSection: Dispatch<SetStateAction<ISection[]>>
  setListSubsection: Dispatch<SetStateAction<ISection[]>>
  setListUnit?: Dispatch<SetStateAction<ISection[]>>
  setListActivity: Dispatch<SetStateAction<ISection[]>>
}

/**
 * Hook dùng chung để fetch và cập nhật dữ liệu cho Section/Subsection/Unit/Activity
 */
export const useCourseSectionsData = ({
  listSection,
  listSubsection,
  listUnit,
  listActivity,
  setListSection,
  setListSubsection,
  setListUnit,
  setListActivity,
}: IUseCourseSectionsDataProps) => {
  const { watch } = useFormContext()
  const selected = {
    section: watch('section'),
    subsection: watch('subsection'),
    unit: watch('unit'),
    activity: watch('activity'),
  }
  // Fetch từng cấp
  const {
    sections,
    fetchInitialSections,
    isLoading: isInitialLoading,
  } = useInitialSections()
  const subsectionData = useSectionData(selected.section, 'CHAPTER')
  const unitData = useSectionData(selected.subsection, 'UNIT')
  const activityData = useSectionData(selected.unit, 'ACTIVITY')

  // Fetch sections ban đầu
  useEffect(() => {
    if (isEmpty(listSection)) {
      fetchInitialSections(DEFAULT_PAGE_SIZE)
    }
  }, [])

  // Fetch dynamic theo cấp
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
    if (selected.unit && isEmpty(listActivity)) {
      activityData.fetchSections(DEFAULT_PAGE_SIZE)
    }
  }, [selected.unit])

  // Cập nhật dữ liệu khi fetch xong
  useEffect(() => {
    if (!isEmpty(sections)) setListSection?.(sections)
  }, [sections])

  useEffect(() => {
    if (!isEmpty(subsectionData.sections))
      setListSubsection?.(subsectionData.sections)
  }, [subsectionData.sections])

  useEffect(() => {
    if (!isEmpty(unitData.sections)) setListUnit?.(unitData.sections)
  }, [unitData.sections])

  useEffect(() => {
    if (!isEmpty(activityData.sections))
      setListActivity?.(activityData.sections)
  }, [activityData.sections])

  return {
    isLoading:
      isInitialLoading ||
      subsectionData.isLoading ||
      unitData.isLoading ||
      activityData.isLoading,
    selected,
  }
}
