import { EditorReader } from '@lms/ui'

type Props = {
  text_editor_content?: string
  className?: string
}

const TextDocument = ({ text_editor_content, className }: Props) => {
  return (
    <EditorReader
      text_editor_content={text_editor_content}
      className={className}
    ></EditorReader>
  )
}

export default TextDocument
