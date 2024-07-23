import EditorReader from '@components/base/editor/EditorReader'

type Props = {
  text_editor_content?: string
}

const TextDocument = ({ text_editor_content }: Props) => {
  return (
    <EditorReader text_editor_content={text_editor_content}></EditorReader>
  )
}

export default TextDocument
