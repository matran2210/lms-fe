import { DocumentItem, IResponse, IStoryline } from '@lms/core'
import { fetcher } from '@services/requestV2'

export class StorylineAPI {
  static getListStoryline({
    class_id,
    section_storyline_id,
  }: {
    class_id: string
    section_storyline_id: string
  }): Promise<IResponse<IStoryline>> {
    return fetcher(`/courses/${class_id}/storyline/${section_storyline_id}`)
  }
  static getStorylineDocument({
    class_id,
    item_id,
  }: {
    class_id: string
    item_id: string
  }): Promise<IResponse<DocumentItem[]>> {
    return fetcher(`/course-sections/${class_id}/storyline/${item_id}`)
  }
  static retakeStoryline({
    class_id,
    course_section_id,
  }: {
    class_id: string
    course_section_id: string
  }): Promise<IResponse<IStoryline>> {
    return fetcher(
      `course-sections/${class_id}/storyline/${course_section_id}/retake`,
      {
        method: 'PUT',
      },
    )
  }
}
