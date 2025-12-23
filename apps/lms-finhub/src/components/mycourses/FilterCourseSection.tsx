import { DEFAULT_PAGE_SIZE, SectionField } from '@lms/core'
import { useDynamicLoading } from '@lms/hooks'
import { SAPPSelectV2 } from '@lms/ui'
import clsx from 'clsx'
import { isEmpty } from 'lodash'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useInitialSections } from 'src/hooks/useInitialSections'
import { useSectionData } from 'src/hooks/useSectionData'

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
      resetFormFields(['subsection', 'unit', 'activity'])
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
      fetchUnits(DEFAULT_PAGE_SIZE)
    }
  }, [selectedSubsection])

  useEffect(() => {
    if (!isEmpty(selectedUnit)) {
      fetchActivities(DEFAULT_PAGE_SIZE)
    }
  }, [selectedUnit])

  useEffect(() => {
    setParams(
      selectedActivity ||
        selectedUnit ||
        selectedSubsection ||
        selectedSection ||
        '',
    )
  }, [selectedActivity, selectedUnit, selectedSubsection, selectedSection])

  const {
    handleMenuScrollToBottom: handleMenuScrollToSections,
    setPage: setPageSection,
  } = useDynamicLoading(fetchInitialSections, DEFAULT_PAGE_SIZE)

  const {
    handleMenuScrollToBottom: handleMenuScrollToSubsections,
    setPage: setPageSubsection,
  } = useDynamicLoading(fetchSubsections, DEFAULT_PAGE_SIZE)

  const {
    handleMenuScrollToBottom: handleMenuScrollToUnit,
    setPage: setPageUnit,
  } = useDynamicLoading(fetchUnits, DEFAULT_PAGE_SIZE)

  const {
    handleMenuScrollToBottom: handleMenuScrollToActivity,
    setPage: setPageActivity,
  } = useDynamicLoading(fetchActivities, DEFAULT_PAGE_SIZE)

  useEffect(() => {
    if (isPageStateVariables) {
      const pageStateVariables = [
        setPageSection,
        setPageSubsection,
        setPageUnit,
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
        'grid w-full grid-cols-4',
        heightCustom ? 'gap-2' : 'gap-4',
      )}
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
          handleDropdownChange('section', selected, [
            'subsection',
            'unit',
            'activity',
          ])
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
          handleDropdownChange('subsection', selected, ['unit', 'activity'])
        }
        allowClear={allowClear}
        onMenuScrollToBottom={handleMenuScrollToSubsections}
        disabled={!selectedSection}
        heightCustom={heightCustom}
      />
      <SAPPSelectV2
        control={control}
        name="unit"
        placeholder="Unit"
        options={
          selectedSubsection
            ? units?.map((u) => ({ label: u.name, value: u.id }))
            : []
        }
        onChange={(selected) =>
          handleDropdownChange('unit', selected, ['activity'])
        }
        onMenuScrollToBottom={handleMenuScrollToUnit}
        disabled={!selectedSubsection}
        heightCustom={heightCustom}
        allowClear={allowClear}
      />
      <SAPPSelectV2
        control={control}
        name="activity"
        placeholder="Activity"
        options={
          selectedUnit
            ? activities?.map((a) => ({ label: a.name, value: a.id }))
            : []
        }
        onChange={(selected) => handleDropdownChange('activity', selected, [])}
        onMenuScrollToBottom={handleMenuScrollToActivity}
        disabled={!selectedUnit}
        heightCustom={heightCustom}
        allowClear={allowClear}
      />
    </div>
  )
}

export default FilterCourseSection
