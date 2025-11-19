import { useEffect, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { ISection } from '@lms/core'
import {
  IGetCourseActivityList,
  IGetCourseSectionList,
  IGetCourseSubSectionList,
  IGetCourseUnitList,
  ISelect,
} from '@lms/core'

const DEFAULT_PAGESIZE = 10

const getNextPageFilterParam = (lastPage: any, pages: any) => {
  return lastPage?.meta.page_index < lastPage.meta.total_pages
    ? lastPage?.meta.page_index + 1
    : undefined
}

const useSelectFilter = ({ courseId, courseKey, api}: {
  courseId: string | string[] | undefined;
  courseKey: {
    ResultsList: string;
    SectionList: string;
    SubsectionList: string;
    UnitList: string;
    ActivityList: string;
  }
  api: {
    getCourseSectionList: (id: string | string[] | undefined, page_size: number, page_index?: number | undefined) => Promise<any>
    getCourseSubsectionList: (page_size: number, type: "CHAPTER" | "UNIT" | "ACTIVITY", parentId?: string | undefined, classId?: string | undefined, page_index?: number | undefined, params?: Object | undefined) => Promise<any>
  }
}) => {
  const [selected, setSelected] = useState<ISelect | null>(null)

  const [sections, setSections] = useState<ISection[]>([])
  const [selectedSection, setSelectedSection] = useState<ISelect | null>(null)

  const [subSections, setSubSections] = useState<ISection[]>([])
  const [selectedSubsection, setSelectedSubsection] = useState<ISelect | null>(
    null,
  )
  const [units, setUnits] = useState<ISection[]>([])
  const [selectedUnit, setSelectedUnit] = useState<ISelect | null>(null)

  const [activities, setActivities] = useState<ISection[]>([])
  const [selectedActivity, setSelectedActivity] = useState<ISelect | null>(null)

  // Get Section List
  const getCourseSectionList = async (page: any) => {
    const { data, success }: IGetCourseSectionList =
      await api.getCourseSectionList(
        courseId,
        DEFAULT_PAGESIZE,
        page.pageParam,
      )

    if (success) {
      data?.sections.length > 0
        ? setSections((prev) => [...prev, ...[...data?.sections].reverse()])
        : setSections(data?.sections)

      setSelectedSubsection(null)
      setSelectedUnit(null)
      setSelectedActivity(null)
    }
    return data
  }
  const {
    hasNextPage: hasNextSectionPage,
    fetchNextPage: fetchNextSectionPage,
    isLoading: isSectionLoading,
  } = useInfiniteQuery({
    queryKey: [courseKey],
    queryFn: getCourseSectionList,
    enabled: !!courseId,
    getNextPageParam: getNextPageFilterParam,
    retry: false,
  })

  // Get SubSection List
  const getCourseSubsectionList = async (page: any) => {
    try {
      const { data, success }: IGetCourseSubSectionList =
        await api.getCourseSubsectionList(
          DEFAULT_PAGESIZE,
          'CHAPTER',
          selectedSection?.value,
          '',
          page.pageParam,
        )

      if (success) {
        data?.sections.length > 0
          ? setSubSections((prev) => [
              ...prev,
              ...[...data?.sections].reverse(),
            ])
          : setSubSections(data?.sections)
        setSelectedUnit(null)
        setSelectedActivity(null)
      }
      return data
    } catch (err) {}
  }
  const {
    hasNextPage: hasNextSubsectionPage,
    fetchNextPage: fetchNextSubsectionPage,
    refetch: refetchSubsections,
    isLoading: isSubsectionLoading,
  } = useInfiniteQuery({
    queryKey: [courseKey.SubsectionList],
    queryFn: getCourseSubsectionList,
    enabled: !!selectedSection && selectedSection.value !== '',
    getNextPageParam: getNextPageFilterParam,
    retry: false,
  })

  // Get Unit List
  const getCourseUnitList = async (page: any) => {
    try {
      const { data, success }: IGetCourseUnitList =
        await api.getCourseSubsectionList(
          DEFAULT_PAGESIZE,
          'UNIT',
          selectedSubsection?.value,
          '',
          page.pageParam,
        )

      if (success) {
        data?.sections.length > 0
          ? setUnits((prev) => [...prev, ...[...data?.sections].reverse()])
          : setUnits(data?.sections)
        setSelectedActivity(null)
        return data
      }
    } catch {
      setSelectedUnit(null)
      setSelectedActivity(null)
    }
  }
  const {
    hasNextPage: hasNextUnitPage,
    fetchNextPage: fetchNextUnitPage,
    refetch: refetchUnits,
    isLoading: isUnitLoading,
  } = useInfiniteQuery({
    queryKey: [courseKey.UnitList],
    queryFn: getCourseUnitList,
    enabled: !!selectedSubsection,
    getNextPageParam: (lastPage: any) => {
      return lastPage?.meta.page_index < lastPage.meta.total_pages
        ? lastPage?.meta.page_index + 1
        : undefined
    },
    retry: false,
  })

  // Get Activity List
  const getCourseActivityList = async (page: any) => {
    try {
      const { data, success }: IGetCourseActivityList =
        await api.getCourseSubsectionList(
          DEFAULT_PAGESIZE,
          'ACTIVITY',
          selectedUnit?.value,
          '',
          page.pageParam,
        )

      if (success) {
        data?.sections.length > 0
          ? setActivities((prev) => [...prev, ...[...data?.sections].reverse()])
          : setActivities(data?.sections)

        return data
      }
    } catch {
      setSelectedActivity(null)
    }
  }
  const {
    hasNextPage: hasNextActivityPage,
    fetchNextPage: fetchNextActivityPage,
    refetch: refetchActivities,
    isLoading: isActivityLoading,
  } = useInfiniteQuery({
    queryKey: [courseKey.ActivityList, selectedUnit],
    queryFn: getCourseActivityList,
    enabled: !!selectedUnit,
    getNextPageParam: getNextPageFilterParam,
    retry: false,
  })

  useEffect(() => {
    !!selectedSection && selectedSection.value !== '' && refetchSubsections()

    setSelectedSubsection(null)
    setSelectedUnit(null)
    setSelectedActivity(null)
  }, [refetchSubsections, selectedSection])

  useEffect(() => {
    !!selectedSubsection && refetchUnits()
    setSelectedUnit(null)
    setSelectedActivity(null)
  }, [refetchUnits, selectedSubsection])

  useEffect(() => {
    !!selectedUnit && refetchActivities()
    setSelectedActivity(null)
  }, [refetchActivities, selectedUnit])

  return {
    selected,
    setSelected,

    // Sections
    sections,
    setSections,
    selectedSection,
    setSelectedSection,
    hasNextSectionPage,
    fetchNextSectionPage,
    isSectionLoading,

    // Sub-Section
    subSections,
    setSubSections,
    selectedSubsection,
    setSelectedSubsection,
    hasNextSubsectionPage,
    fetchNextSubsectionPage,
    isSubsectionLoading,

    // Units
    units,
    setUnits,
    selectedUnit,
    setSelectedUnit,
    hasNextUnitPage,
    fetchNextUnitPage,
    isUnitLoading,

    // Activities
    activities,
    setActivities,
    selectedActivity,
    setSelectedActivity,
    hasNextActivityPage,
    fetchNextActivityPage,
    isActivityLoading,
  }
}

export default useSelectFilter
