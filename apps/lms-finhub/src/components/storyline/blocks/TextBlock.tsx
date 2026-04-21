import React from 'react'

export default function TextBlock({ text }: { text?: string }) {
  return (
    <div
      className="text-lg"
      dangerouslySetInnerHTML={{ __html: text || '' }}
    ></div>
  )
}
