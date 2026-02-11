import TextBlock from './TextBlock'
import ImageBlock from './ImageBlock'
import VideoBlock from './VideoBlock'
import QuizBlock from './QuizBlock'
import { Block, DocumentItem } from 'src/type/storyline'
import { QUESTION_TYPES } from '@lms/core'

export function StoryBlockRenderer({ doc }: { doc: DocumentItem }) {
  switch (doc.type) {
    case 'TEXT':
    case 'IMAGE':
    case 'VIDEO':
      return <TextBlock text={doc.content} />

    // case "QUIZ":
    //   return <QuizBlock question={doc.question!} />

    default:
      return null
  }
}
