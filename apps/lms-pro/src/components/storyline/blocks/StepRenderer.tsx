import { DocumentItem } from '@lms/core'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { useEffect, useRef } from 'react'
import { StoryBlockRenderer } from './StoryBlockRenderer'
import { useStoryline } from '@contexts/StorylineContext'

interface Props {
  documents: DocumentItem[] | undefined
  storylinyeDocument: DocumentItem[] | undefined
}

export function StepRenderer({
  documents = [],
  storylinyeDocument = [],
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const blockRefs = useRef<(HTMLElement | null)[]>([])
  const { visibleDocumentCount } = useStoryline()

  console.log(visibleDocumentCount, storylinyeDocument.length)
  // ✅ Init AOS chỉ 1 lần
  useEffect(() => {
    Aos.init({
      duration: 650,
      once: true,
      easing: 'ease-out-cubic',
      // disableMutationObserver: true,
    })
  }, [])

  // ✅ Khi documents thay đổi → refresh AOS + scroll block mới
  useEffect(() => {
    if (!documents.length) return

    const lastIndex = documents.length - 1
    const newBlock = blockRefs.current[lastIndex]

    if (!newBlock) return

    // Đợi layout + AOS tính xong
    setTimeout(() => {
      newBlock.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })

      // onNewBlockMounted?.(newBlock)
    }, 200)
  }, [visibleDocumentCount])

  return (
    <div ref={containerRef} className="mx-auto" data-aos="fade-up">
      {documents.map((doc, index) => {
        return (
          <div
            key={doc.id}
            ref={(el) => {
              blockRefs.current[index] = el
            }}
            className="mb-12"
            data-aos="fade-up"
          >
            <StoryBlockRenderer
              doc={doc}
              docIndex={index + 1}
              storylinyeDocument={storylinyeDocument}
            />
          </div>
        )
      })}
    </div>
  )
}
