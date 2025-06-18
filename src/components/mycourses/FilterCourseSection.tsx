import SAPPSelectV2 from '@components/base/select/SAPPSelectV2'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { DEFAULT_PAGE_SIZE } from 'src/constants'
import { SectionField, SectionDropdownFormValues } from 'src/type/courses'
import { ISection } from 'src/type'
import { isEmpty } from 'lodash'
import { CoursesAPI } from 'src/pages/api/courses'
import useDynamicLoading from 'src/hooks/use-dynamic'
import clsx from 'clsx'

const DEFAULT_SELECT = [{ label: 'All Section', value: '' }]

const FilterCourseSection = ({
  setParams,
  heightCustom,
  isPageStateVariables,
}: {
  setParams: Dispatch<SetStateAction<string>>
  heightCustom?: string
  isPageStateVariables?: boolean
}) => {
  const router = useRouter()
  const { control, watch, setValue } = useForm<SectionDropdownFormValues>({
    defaultValues: {
      section: null,
      subsection: null,
      unit: null,
      activity: null,
    },
  })
  const isFetchingRef = useRef(false)
  const selectedSection = watch('section')
  const selectedSubsection = watch('subsection')
  const selectedUnit = watch('unit')
  const selectedActivity = watch('activity')
  const resetFormFields = (fields: SectionField[]) => {
    fields.forEach((field) => setValue(field, null))
  }

  const handleDropdownChange = (
    fieldName: SectionField,
    selected: string | null,
    fieldsToReset: SectionField[],
  ) => {
    setValue(fieldName, selected)

    // Reset the downstream dropdowns
    resetFormFields(fieldsToReset)
  }

  useEffect(() => {
    if (!selectedSection) {
      resetFormFields(['subsection', 'unit', 'activity'])
    }
  }, [selectedSection])

  const [sections, setSections] = useState<ISection[]>([])

  async function getCourseSections(page_size: number) {
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
          resetFormFields(['subsection', 'unit', 'activity'])
        }
      }
    } catch (error) {
    } finally {
      isFetchingRef.current = false
    }
  }

  const [subSections, setSubsections] = useState<ISection[]>([])

  async function getCourseSubsections(page_size: number) {
    try {
      if (selectedSection) {
        const class_id = router.query.courseId || router.query.id
        const res = await CoursesAPI.getCourseSubsectionList(
          page_size,
          'CHAPTER',
          selectedSection || '',
          class_id as string,
        )
        setSubsections([...res?.data?.sections].reverse())
        resetFormFields(['unit', 'activity'])
      }
    } catch (error) {}
  }

  useEffect(() => {
    getCourseSubsections(DEFAULT_PAGE_SIZE)
  }, [selectedSection])

  const [unit, setUnit] = useState<ISection[]>([])

  async function getCourseUnit() {
    try {
      if (selectedSubsection) {
        const class_id = router.query.courseId || router.query.id
        const res = await CoursesAPI.getCourseSubsectionList(
          DEFAULT_PAGE_SIZE,
          'UNIT',
          selectedSubsection || '',
          class_id as string,
        )
        setUnit([...res?.data?.sections].reverse())
        resetFormFields(['activity'])
      }
    } catch (error) {}
  }

  useEffect(() => {
    getCourseUnit()
  }, [selectedSubsection])

  const [activity, setActivity] = useState<ISection[]>([])

  async function getCourseActivity(page_size: number) {
    try {
      if (selectedUnit) {
        const class_id = router.query.courseId || router.query.id
        const res = await CoursesAPI.getCourseSubsectionList(
          page_size,
          'ACTIVITY',
          selectedUnit || '',
          class_id as string,
        )
        setActivity([...res?.data?.sections].reverse())
      }
    } catch (error) {}
  }

  useEffect(() => {
    getCourseActivity(DEFAULT_PAGE_SIZE)
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

  useEffect(() => {
    getCourseSections(DEFAULT_PAGE_SIZE)
  }, [])

  const {
    handleMenuScrollToBottom: handleMenuScrollToSections,
    setPage: setPageSection,
  } = useDynamicLoading(getCourseSections, DEFAULT_PAGE_SIZE)

  const {
    handleMenuScrollToBottom: handleMenuScrollToSubsections,
    setPage: setPageSubsection,
  } = useDynamicLoading(getCourseSubsections, DEFAULT_PAGE_SIZE)
  const {
    handleMenuScrollToBottom: handleMenuScrollToUnit,
    setPage: setPageUnit,
  } = useDynamicLoading(getCourseUnit, DEFAULT_PAGE_SIZE)
  const {
    handleMenuScrollToBottom: handleMenuScrollToActivity,
    setPage: setPageActivity,
  } = useDynamicLoading(getCourseActivity, DEFAULT_PAGE_SIZE)

  const handlePageStateVariables = () => {
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

  useEffect(() => {
    if (isPageStateVariables) {
      handlePageStateVariables()
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
            ? unit?.map((u) => ({ label: u.name, value: u.id }))
            : []
        }
        onChange={(selected) =>
          handleDropdownChange('unit', selected, ['activity'])
        }
        onMenuScrollToBottom={handleMenuScrollToUnit}
        disabled={!selectedSubsection}
        heightCustom={heightCustom}
      />
      <SAPPSelectV2
        control={control}
        name="activity"
        placeholder="Activity"
        options={
          selectedUnit
            ? activity?.map((a) => ({ label: a.name, value: a.id }))
            : []
        }
        onChange={(selected) => handleDropdownChange('activity', selected, [])}
        onMenuScrollToBottom={handleMenuScrollToActivity}
        disabled={!selectedUnit}
        heightCustom={heightCustom}
      />
    </div>
  )
}

export default FilterCourseSection
