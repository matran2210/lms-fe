import { DocumentItem } from '@lms/core'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { useEffect, useRef, useState } from 'react'
import { StoryBlockRenderer } from './StoryBlockRenderer'
import { useStoryline } from '@contexts/StorylineContext'

interface Props {
  documents: DocumentItem[] | undefined
  storylineDocument: DocumentItem[] | undefined
}

export function StepRenderer({ documents = [] }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const blockRefs = useRef<(HTMLElement | null)[]>([])
  const prevVisibleDocsRef = useRef<number>(0)
  const prevStepRef = useRef<string | null>('')

  const { visibleDocumentCount, currentStep, storylineDocument } =
    useStoryline()
  useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
      // disableMutationObserver: true,
    })
  }, [])

  useEffect(() => {
    const docs = storylineDocument?.slice(0, visibleDocumentCount)
    if (!docs?.length) return
    if (!currentStep?.id) return
    if (!storylineDocument?.length) return

    const visibleDocs =
      currentStep?.item_progress?.total_document_completed || 1
    if (prevStepRef.current === currentStep?.id) return
    if (prevVisibleDocsRef.current === visibleDocs) return

    const isCompleted = visibleDocs >= (storylineDocument?.length || 0)

    if (isCompleted) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } else {
      const targetIndex = isCompleted ? 0 : docs.length - 1
      const targetBlock = blockRefs.current[targetIndex]
      if (targetBlock) {
        requestAnimationFrame(() => {
          targetBlock.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        })
      }
    }

    prevStepRef.current = currentStep?.id as string
    prevVisibleDocsRef.current = visibleDocs
  }, [currentStep?.id, storylineDocument])

  useEffect(() => {
    if (!documents.length) return
    if (!storylineDocument?.length) return

    const visibleDocs =
      currentStep?.item_progress?.total_document_completed || 1

    const isCompleted = visibleDocs >= storylineDocument?.length

    if (isCompleted) return
    const lastIndex = documents.length - 1
    const newBlock = blockRefs.current[lastIndex]

    if (!newBlock) return

    // Đợi layout + AOS tính xong
    setTimeout(() => {
      newBlock.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
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
            <StoryBlockRenderer doc={doc} docIndex={index + 1} />
          </div>
        )
      })}
    </div>
  )
}
