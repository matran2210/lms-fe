import { Dispatch, SetStateAction } from 'react'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import clsx from 'clsx'
import { SectionField } from 'src/type/courses-3-level/course'
import { useInitialSections } from 'src/hooks/useInitialSections'
import { useSectionData } from 'src/hooks/useSectionData'
import { isEmpty } from 'lodash'
import { ANIMATION, DEFAULT_PAGE_SIZE } from '@lms/core'
import { useDynamicLoading } from '@lms/hooks'
import { SAPPSelectV2 } from '@lms/ui'

const DEFAULT_SELECT = [{ label: 'All Section', value: '' }]

interface FilterCourseSectionProps {
  setParams: Dispatch<SetStateAction<string>>
  heightCustom?: string
  isPageStateVariables?: boolean
  allowClear?: boolean
}

const FilterCourseSection = ({
  setParams,
  heightCustom,
  isPageStateVariables,
  allowClear = false,
}: FilterCourseSectionProps) => {
  const { control, watch, setValue } = useFormContext()

  const selectedSection = watch('section')
  const selectedSubsection = watch('subsection')
  const selectedActivity = watch('activity')

  const { sections, fetchInitialSections } = useInitialSections()
  const { sections: subSections, fetchSections: fetchSubsections } =
    useSectionData(selectedSection, 'CHAPTER')
  const { sections: activities, fetchSections: fetchActivities } =
    useSectionData(selectedSubsection, 'ACTIVITY')

  const resetFormFields = (fields: SectionField[]) => {
    fields.forEach((field) => setValue(field, null))
  }

  const handleDropdownChange = (
    fieldName: SectionField,
    selected: string | null,
    fieldsToReset: SectionField[],
  ) => {
    setValue(fieldName, selected)
    resetFormFields(fieldsToReset)
  }

  useEffect(() => {
    if (!selectedSection) {
      resetFormFields(['subsection', 'activity'])
    }
  }, [selectedSection])

  useEffect(() => {
    if (isEmpty(sections)) {
      fetchInitialSections(DEFAULT_PAGE_SIZE)
    }
  }, [])

  useEffect(() => {
    if (!isEmpty(selectedSection)) {
      fetchSubsections(DEFAULT_PAGE_SIZE)
    }
  }, [selectedSection])

  useEffect(() => {
    if (!isEmpty(selectedSubsection)) {
      fetchActivities(DEFAULT_PAGE_SIZE)
    }
  }, [selectedSubsection])

  useEffect(() => {
    setParams(selectedActivity || selectedSubsection || selectedSection || '')
  }, [selectedActivity, selectedSubsection, selectedSection])

  const {
    handleMenuScrollToBottom: handleMenuScrollToSections,
    setPage: setPageSection,
  } = useDynamicLoading(fetchInitialSections, DEFAULT_PAGE_SIZE)

  const {
    handleMenuScrollToBottom: handleMenuScrollToSubsections,
    setPage: setPageSubsection,
  } = useDynamicLoading(fetchSubsections, DEFAULT_PAGE_SIZE)

  const {
    handleMenuScrollToBottom: handleMenuScrollToActivity,
    setPage: setPageActivity,
  } = useDynamicLoading(fetchActivities, DEFAULT_PAGE_SIZE)

  useEffect(() => {
    if (isPageStateVariables) {
      const pageStateVariables = [
        setPageSection,
        setPageSubsection,
        setPageActivity,
      ]
      pageStateVariables.forEach((setPageVariable) => {
        setPageVariable(DEFAULT_PAGE_SIZE * 2)
      })
    }
  }, [isPageStateVariables])

  return (
    <div
      className={clsx(
        'grid w-full grid-cols-3',
        heightCustom ? 'gap-2' : 'gap-4',
      )}
      data-aos={ANIMATION.DATA_AOS}
    >
      <SAPPSelectV2
        control={control}
        name="section"
        placeholder="Section"
        options={DEFAULT_SELECT.concat(
          sections?.map((section) => ({
            label: section.name,
            value: section.id,
          })),
        )}
        onChange={(selected) =>
          handleDropdownChange('section', selected, ['subsection', 'activity'])
        }
        heightCustom={heightCustom}
        onMenuScrollToBottom={handleMenuScrollToSections}
        allowClear={allowClear}
      />
      <SAPPSelectV2
        control={control}
        name="subsection"
        placeholder="Subsection"
        options={
          selectedSection
            ? subSections?.map((s) => ({ label: s.name, value: s.id }))
            : []
        }
        onChange={(selected) =>
          handleDropdownChange('subsection', selected, ['activity'])
        }
        allowClear={allowClear}
        onMenuScrollToBottom={handleMenuScrollToSubsections}
        disabled={!selectedSection}
        heightCustom={heightCustom}
      />
      <SAPPSelectV2
        control={control}
        name="activity"
        placeholder="Activity"
        options={
          selectedSubsection
            ? activities?.map((a) => ({ label: a.name, value: a.id }))
            : []
        }
        onChange={(selected) => handleDropdownChange('activity', selected, [])}
        onMenuScrollToBottom={handleMenuScrollToActivity}
        disabled={!selectedSubsection}
        heightCustom={heightCustom}
        allowClear={allowClear}
      />
    </div>
  )
}

export default FilterCourseSection
