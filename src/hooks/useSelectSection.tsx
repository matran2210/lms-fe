import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { CoursesAPI } from 'src/pages/api/courses'
import { CourseKey } from 'src/pages/api/queryKey'
import { ISection } from 'src/type/courses'

const DEFAULT_PAGESIZE = 20
const useSelectedSectionCombo = (courseId: string | string[] | undefined) => {
  const [sections, setSections] = useState<ISection[]>([])
  const [subSections, setSubsections] = useState<ISection[]>([])
  const [unit, setUnit] = useState<ISection[]>([])
  const [activity, setActivity] = useState<ISection[]>([])

  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [selectedSubsection, setSelectedSubsection] = useState<any>(null)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)

  const { data, isSuccess } = useQuery({
    queryKey: [CourseKey.sectionList],
    queryFn: async () => {
      const res: any = await CoursesAPI.getCourseSectionList(
        courseId,
        DEFAULT_PAGESIZE,
      )
      return res
    },
    // enabled: courseId !== undefined,
  })
  if (isSuccess) {
    setSections([...data?.data?.sections].reverse())
    // setSelectedSubsection(null)
    // setSelectedUnit(null)
    // setSelectedActivity(null)
  }
  //   async function getCourseSections(page_size: number) {
  //     try {
  //       if (!sections.length) {
  //         const res = await CoursesAPI.getCourseSectionList(
  //           courseId || queryId,
  //           page_size || DEFAULT_PAGESIZE,
  //         )
  //         setSections([...res?.data?.sections].reverse())
  //         setSelectedSubsection(null)
  //         setSelectedUnit(null)
  //         setSelectedActivity(null)
  //       }
  //     } catch (error) {}
  //   }

  //   async function getCourseSubsections(page_size: number) {
  //     try {
  //       const res = await CoursesAPI.getCourseSubsectionList(
  //         page_size,
  //         'CHAPTER',
  //         selectedSection.value,
  //       )
  //       setSubsections([...res?.data?.sections].reverse())
  //       setSelectedUnit(null)
  //       setSelectedActivity(null)
  //     } catch (error) {}
  //   }

  //   async function getCourseUnit() {
  //     try {
  //       const res = await CoursesAPI.getCourseSubsectionList(
  //         DEFAULT_PAGESIZE,
  //         'UNIT',
  //         selectedSubsection.value,
  //       )
  //       setUnit([...res?.data?.sections].reverse())
  //       setSelectedActivity(null)
  //     } catch (error) {
  //       setSelectedUnit(null)
  //       setSelectedActivity(null)
  //     }
  //   }

  //   async function getCourseActivity(page_size: number) {
  //     try {
  //       const res = await CoursesAPI.getCourseSubsectionList(
  //         page_size,
  //         'ACTIVITY',
  //         selectedUnit.value,
  //       )
  //       setActivity([...res?.data?.sections].reverse())
  //     } catch (error) {
  //       setSelectedActivity(null)
  //     }
  //   }

  return { sections, selectedSection }
}

export default useSelectedSectionCombo
