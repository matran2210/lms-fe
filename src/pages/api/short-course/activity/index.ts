import { fetcher } from '@services/requestV2'
import { IActivity } from 'src/type/courses-3-level'
import { ICourseTabDocument, IFile } from 'src/type/courses-3-level'

/**
 * @description fetch activity information by ID.
 * @async
 * @param {string} id - activity ID.
 * @param {string} accessToken - User's access token.
 * @returns {Promise<IActivity>} - Activity data.
 */

export const getActivityById = async (
  id: string | string[] | undefined,
  course_id: string | string[] | undefined,
): Promise<IActivity> => {
  try {
    const responseActivity = await fetcher(
      `courses/${course_id}/activity/${id}?activity_sc_id=true`,
    )
    const courseTabDocuments = [...responseActivity.data.course_tab_documents]
    responseActivity.data.course_tab_documents = []

    responseActivity.data.course_tab_documents = await Promise.all(
      courseTabDocuments.map(async (courseDocument) => {
        try {
          const responseDocument = await getCourseDocumentById(
            courseDocument.id,
          )
          if (responseDocument) {
            return responseDocument
          } else {
            return courseDocument
          }
        } catch (error) {
          return courseDocument
        }
      }),
    )
    return responseActivity.data
  } catch (error) {
    throw new Error('Activity not found')
  }
}

export const getCourseDocumentById = async (
  id: string | string[] | undefined,
): Promise<ICourseTabDocument> => {
  try {
    const responseDocument = await fetcher(`course-sections/tab/document/${id}`)
    return responseDocument.data
  } catch (error) {
    throw new Error('Document not found')
  }
}

export const getFileResourceById = async (
  id: string | string[] | undefined,
): Promise<IFile> => {
  try {
    const responseDocument = await fetcher(`resource/${id}`)
    return responseDocument.data
  } catch (error) {
    throw new Error('Resource not found')
  }
}
