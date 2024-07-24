import { useEffect, useState } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'
import { CoursesAPI } from 'src/pages/api/courses'
import { CourseKey } from 'src/pages/api/queryKey'
import {
  IGetCourseActivityList,
  IGetCourseSectionList,
  IGetCourseSubSectionList,
  IGetCourseUnitList,
  ISection,
  ISelect,
} from 'src/type'

const DEFAULT_PAGESIZE = 2
const useSelectFilter = (courseId: string | string[] | undefined) => {
  const [selected, setSelected] = useState<ISelect | null>(null)

  const [sections, setSections] = useState<ISection[]>([])
  const [subSections, setSubSections] = useState<ISection[]>([])
  const [units, setUnits] = useState<ISection[]>([])
  const [activities, setActivities] = useState<ISection[]>([])

  const [selectedSection, setSelectedSection] = useState<ISelect | null>(null)
  const [selectedSubsection, setSelectedSubsection] = useState<ISelect | null>(
    null,
  )
  const [selectedUnit, setSelectedUnit] = useState<ISelect | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<ISelect | null>(null)

  const getCourseSectionList = async (page: any) => {
    const { data, success }: IGetCourseSectionList =
      await CoursesAPI.getCourseSectionList(
        courseId,
        DEFAULT_PAGESIZE,
        page.pageParam,
      )

    if (success) {
      setSections([...data?.sections].reverse())
      setSelectedSubsection(null)
      setSelectedUnit(null)
      setSelectedActivity(null)
    }
    return data
  }
  // Get Section List
  const { hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [CourseKey.SectionList, selectedSection],
    queryFn: getCourseSectionList,
    enabled: !!courseId,
    getNextPageParam: (lastPage: any, pages: any) => {
      return lastPage?.meta.page_index < lastPage.meta.total_pages
        ? lastPage.meta.page_index + 1
        : undefined
    },
  })

  // Get Subsection List
  useQuery({
    queryKey: [CourseKey.SubsectionList, selectedSection],
    queryFn: async () => {
      try {
        const { data, success }: IGetCourseSubSectionList =
          await CoursesAPI.getCourseSubsectionList(
            DEFAULT_PAGESIZE,
            'CHAPTER',
            selectedSection?.value,
          )

        if (success) {
          setSubSections([...data?.sections])
          setSelectedUnit(null)
          setSelectedActivity(null)
        }
        return data
      } catch (err) {}
    },
    enabled: !!selectedSection && selectedSection.value !== '',
  })

  // Get Course Unit
  useQuery({
    queryKey: [CourseKey.UnitList, selectedSubsection],
    queryFn: async () => {
      try {
        const { data, success }: IGetCourseUnitList =
          await CoursesAPI.getCourseSubsectionList(
            DEFAULT_PAGESIZE,
            'UNIT',
            selectedSubsection?.value,
          )

        if (success) {
          setUnits([...data?.sections])
          setSelectedActivity(null)
          return data
        }
      } catch {
        setSelectedUnit(null)
        setSelectedActivity(null)
      }
    },
    enabled: !!selectedSubsection,
  })

  // Get Course Activity
  useQuery({
    queryKey: [CourseKey.ActivityList, selectedUnit],
    queryFn: async () => {
      try {
        const { data, success }: IGetCourseActivityList =
          await CoursesAPI.getCourseSubsectionList(
            DEFAULT_PAGESIZE,
            'ACTIVITY',
            selectedUnit?.value,
          )

        if (success) {
          setActivities([...data?.sections])
          return data
        }
      } catch {
        setSelectedActivity(null)
      }
    },
    enabled: !!selectedUnit,
  })

  useEffect(() => {
    setSelectedSubsection(null)
    setSelectedUnit(null)
    setSelectedActivity(null)
  }, [selectedSection])

  useEffect(() => {
    setSelectedUnit(null)
    setSelectedActivity(null)
  }, [selectedSubsection])

  useEffect(() => {
    setSelectedActivity(null)
  }, [selectedUnit])

  return {
    selected,
    setSelected,
    sections,
    selectedSection,
    setSelectedSection,
    subSections,
    selectedSubsection,
    setSelectedSubsection,
    units,
    selectedUnit,
    setSelectedUnit,
    activities,
    selectedActivity,
    setSelectedActivity,
    fetchNextPage,
  }
}

export default useSelectFilter
