import { ISection } from 'src/type/courses'

export interface IGetCourseSectionList {
  success: boolean
  data: Data
}

export interface IGetCourseSubSectionList extends IGetCourseSectionList {}
export interface IGetCourseUnitList extends IGetCourseSectionList {}
export interface IGetCourseActivityList extends IGetCourseSectionList {}

export interface ISelect {
  label: string
  value: string
}

interface Data {
  meta: Meta
  sections: ISection[]
}

interface Meta {
  total_pages: number
  total_records: number
  page_index: number
  page_size: number
}
