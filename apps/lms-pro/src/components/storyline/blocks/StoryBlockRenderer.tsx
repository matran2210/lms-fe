import { useFeature } from '@lms/contexts'
import QuizBlock from './QuizBlock'
import TextBlock from './TextBlock'
import VideoBlock from './VideoBlock'
import { DocumentItem, IMultiChoiceQuestion } from '@lms/core'

export function StoryBlockRenderer({
  doc,
  docIndex,
  storylinyeDocument,
}: {
  doc: DocumentItem
  docIndex: number
  storylinyeDocument: DocumentItem[]
}) {
  const { videoUrl } = useFeature()
  switch (doc.type) {
    case 'TEXT':
      return <TextBlock text={doc.content} />
    case 'VIDEO':
      const videoResource = doc.videos?.[0]?.file.resource
      const src =
        videoResource?.url
          ?.replace(videoUrl || '', '')
          .replace('/manifest/video.m3u8', '') || ''
      return <VideoBlock src={src} />

    case 'QUIZ':
      const quiz = doc.quiz
      const minimalQuestion =
        // quiz?.quiz_question_type === QUESTION_TYPES.MULTIPLE_CHOICE
        quiz?.multiple_choice_questions[0] ||
        (quiz?.constructed_questions[0] as IMultiChoiceQuestion)

      return (
        <QuizBlock
          minimalQuestion={minimalQuestion}
          quiz_id={quiz?.id as string}
          document_id={doc.id}
          docIndex={docIndex}
          storylinyeDocument={storylinyeDocument}
        />
      )

    default:
      return null
  }
}
