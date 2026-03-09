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


interface StepInitState {
  count: number
  isCompleted: boolean
}


export function StepRenderer({ documents = [] }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const blockRefs = useRef<(HTMLElement | null)[]>([])


  // Key: stepId → value: visibleDocumentCount lúc Effect 1 chạy xong
  const stepInitMapRef = useRef<Record<string, StepInitState>>({})


  const { visibleDocumentCount, currentStep, storylineDocument } = useStoryline()


  // Init AOS
  useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  // Effect retake: total_document_completed reset về 0 → update map về chưa hoàn thành
  useEffect(() => {
    if (!currentStep?.id) return
    const totalCompleted = currentStep?.item_progress?.total_document_completed ?? 0
    if (totalCompleted > 1) return
    stepInitMapRef.current[currentStep.id as string] = {
      count: 1,
      isCompleted: false,
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [currentStep?.item_progress?.total_document_completed])

  // Effect 1: Lần đầu vào hoặc đổi step
  useEffect(() => {
    if (!currentStep?.id) return
    if (!storylineDocument?.length) return


    const totalCompleted = currentStep?.item_progress?.total_document_completed ?? 0
    const visibleDocs = !totalCompleted ? totalCompleted + 1 : totalCompleted
    const isStepCompleted = totalCompleted >= storylineDocument.length

    if (totalCompleted <= 1) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    } else {
      if (isStepCompleted) {
        window.scrollTo({ top: 0, behavior: 'instant' })
      } else {
        // const lastVisibleIndex = visibleDocs - 1
        // const targetBlock = blockRefs.current[lastVisibleIndex]
        // if (targetBlock) {

        requestAnimationFrame(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        })
      }
    }

    // Lưu lại count tại thời điểm Effect 1 chạy cho step này
    stepInitMapRef.current[currentStep.id as string] = {
      count: visibleDocs,
      isCompleted: isStepCompleted,
    }
  }, [currentStep?.id, storylineDocument])

  // Effect 2: Next document
  useEffect(() => {
    const currentDocument = storylineDocument?.[visibleDocumentCount - 1]
    if (!currentDocument) return
    if (!currentStep?.id) return
    if (!documents.length) return

    const stepState = stepInitMapRef.current[currentStep.id as string]
    const totalCompleted = currentStep?.item_progress?.total_document_completed ?? 0

    // Effect 1 chưa chạy cho step này → bỏ qua
    if (stepState === undefined) return

    // Khi reset thì bỏ qua
    if (totalCompleted < 1) return

    // Step đã hoàn thành → không cần scroll
    if (stepState.isCompleted) return


    // Count chưa tăng so với lúc Effect 1 khởi tạo → bỏ qua
    if (visibleDocumentCount < stepState.count) return

    setTimeout(() => {
      const lastVisibleIndex = visibleDocumentCount - 1
      const targetBlock = blockRefs.current[lastVisibleIndex]
      if (targetBlock) {
      // window.scrollTo({
      //   top: document.body.scrollHeight,
      //   behavior: 'smooth',
      // })
      if(currentDocument?.type === "QUIZ") {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        })
      } else {
        targetBlock.scrollIntoView({ behavior: 'smooth', block: 'start' })

      }
        // targetBlock.scrollIntoView({ behavior: 'smooth', block: currentDocument?.type === "QUIZ" ? 'center' : 'start' })
    }
    }, 222)

    stepInitMapRef.current[currentStep.id as string] = {
      ...stepState,
      count: visibleDocumentCount,
    }
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
            className="mb-12 scroll-mt-[100px]"
            data-aos="fade-up"
          >
            <StoryBlockRenderer doc={doc} docIndex={index + 1} />
          </div>
        )
      })}
    </div>
  )
}
