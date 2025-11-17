import { IMetaData } from "../../api-response"
import { ISection } from "../../courses"

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
  meta: IMetaData
  sections: ISection[]
}
