import { IContentCompleted, ICourseSections } from 'src/type/progress'

export const sortSectionsByPosition = (data: IContentCompleted[]) => {
  if (!Array.isArray(data) || data.length === 0) return []

  data.forEach((schedule) => {
    schedule.course_sections.forEach((section) => {
      sortChildrenRecursive(section)
    })
  })

  return data
}

export const sortChildrenRecursive = (section: ICourseSections) => {
  if (section.children && section.children.length > 0) {
    section.children.sort((a, b) => a.position - b.position)

    section.children.forEach((child) => sortChildrenRecursive(child))
  }
}
