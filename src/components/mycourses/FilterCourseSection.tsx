import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { isEmpty } from 'lodash'
import clsx from 'clsx'
import SAPPSelectV2 from '@components/base/select/SAPPSelectV2'
import { DEFAULT_PAGE_SIZE } from 'src/constants'
import { SectionField, SectionDropdownFormValues } from 'src/type/courses'
import { ISection } from 'src/type'
import { CoursesAPI } from 'src/pages/api/courses'
import useDynamicLoading from 'src/hooks/use-dynamic'

const DEFAULT_SELECT = [{ label: 'All Section', value: '' }]

interface FilterCourseSectionProps {
  setParams: Dispatch<SetStateAction<string>>
  heightCustom?: string
  isPageStateVariables?: boolean
  allowClear?: boolean
}

const useSectionData = (sectionId: string | null, type: string) => {
  const [sections, setSections] = useState<ISection[]>([])
  const router = useRouter()

  const fetchSections = async (page_size: number) => {
    try {
      if (sectionId) {
        const class_id = router.query.courseId || router.query.id
        const res = await CoursesAPI.getCourseSubsectionList(
          page_size,
          type as 'CHAPTER' | 'UNIT' | 'ACTIVITY',
          sectionId,
          class_id as string,
        )
        setSections([...res?.data?.sections].reverse())
      }
    } catch (error) {}
  }

  return { sections, setSections, fetchSections }
}

const useInitialSections = () => {
  const [sections, setSections] = useState<ISection[]>([])
  const isFetchingRef = useRef(false)
  const router = useRouter()

  const fetchInitialSections = async (page_size: number) => {
    try {
      if (
        isEmpty(sections) &&
        (router.query.courseId || router.query.id) &&
        !isFetchingRef.current
      ) {
        isFetchingRef.current = true
        const { data } = await CoursesAPI.getCourseSectionList(
          router.query.courseId || router.query.id,
          page_size || DEFAULT_PAGE_SIZE,
        )
        if (!isEmpty(data?.sections)) {
          setSections([...data?.sections].reverse())
        }
      }
    } catch (error) {
    } finally {
      isFetchingRef.current = false
    }
  }

  return { sections, setSections, fetchInitialSections }
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
    fetchInitialSections(DEFAULT_PAGE_SIZE)
  }, [])

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
