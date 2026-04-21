import TextBlock from './TextBlock'
import ImageBlock from './ImageBlock'
import VideoBlock from './VideoBlock'
import QuizBlock from './QuizBlock'
import { Block } from 'src/type/storyline'
import { QUESTION_TYPES } from '@lms/core'

export function StoryBlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return <TextBlock text={block.text!} />

    case 'image':
      return <ImageBlock src={block.src!} />

    case 'video':
      return <VideoBlock src={block.src!} />

    case 'quiz':
      return <QuizBlock question={block.question!} />

    default:
      return null
  }
}
