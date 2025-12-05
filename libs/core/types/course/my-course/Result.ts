import { IMetaData } from "../../api-response"
import { ISection } from "../../courses"

export interface IGetCourseSectionList {
  success: boolean
  data: Data
}

export type IGetCourseSubSectionList = IGetCourseSectionList
export type IGetCourseUnitList = IGetCourseSectionList
export type IGetCourseActivityList = IGetCourseSectionList

export interface ISelect {
  label: string
  value: string
}

interface Data {
  meta: IMetaData
  sections: ISection[]
}
