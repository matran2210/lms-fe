import { Dispatch, SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'
import SAPPSelectV2 from '@components/base/select/SAPPSelectV2'
import { SectionField, SectionDropdownFormValues } from 'src/type/courses'

import { useSectionData } from 'src/hooks/useSelectSection'
import { useInitialSections } from 'src/hooks/useInitialSections'

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
  const { control, watch, setValue } = useForm<SectionDropdownFormValues>({
    defaultValues: {
      section: null,
      subsection: null,
      unit: null,
      activity: null,
    },
  })

  const selectedSection = watch('section')
  const selectedSubsection = watch('subsection')
  const selectedUnit = watch('unit')
  const selectedActivity = watch('activity')

  const { sections } = useInitialSections()
  const { sections: subSections } = useSectionData(selectedSection, 'CHAPTER')
  const { sections: units } = useSectionData(selectedSubsection, 'UNIT')
  const { sections: activities } = useSectionData(selectedUnit, 'ACTIVITY')

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
    setParams(
      selectedActivity ||
        selectedUnit ||
        selectedSubsection ||
        selectedSection ||
        '',
    )
  }, [selectedActivity, selectedUnit, selectedSubsection, selectedSection])

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
        disabled={!selectedUnit}
        heightCustom={heightCustom}
        allowClear={allowClear}
      />
    </div>
  )
}

export default FilterCourseSection
