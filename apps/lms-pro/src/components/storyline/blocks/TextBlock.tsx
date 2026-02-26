import { EditorReader } from '@lms/ui'
import React from 'react'

export default function TextBlock({ text }: { text?: string }) {
  return <EditorReader className="text-lg" text_editor_content={text || ''} />
}
