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


  // Effect 1: Lần đầu vào hoặc đổi step
  useEffect(() => {
    if (!currentStep?.id) return
    if (!storylineDocument?.length) return


    const totalCompleted = currentStep?.item_progress?.total_document_completed ?? 0
    const visibleDocs = !totalCompleted ? totalCompleted + 1 : totalCompleted
    const isStepCompleted = totalCompleted >= storylineDocument.length


    console.log(totalCompleted, storylineDocument, "99999")
    if (!totalCompleted) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    if (isStepCompleted) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    } else {
      const lastVisibleIndex = visibleDocs - 1
      const targetBlock = blockRefs.current[lastVisibleIndex]
      if (targetBlock) {
        requestAnimationFrame(() => {
          // targetBlock.scrollIntoView({
          //   behavior: 'smooth',
          //   block: 'end',
          // })
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


  // Effect retake: total_document_completed reset về 0 → update map về chưa hoàn thành
  useEffect(() => {
    if (!currentStep?.id) return
    const totalCompleted = currentStep?.item_progress?.total_document_completed ?? 0
    if (totalCompleted !== 0) return
    stepInitMapRef.current[currentStep.id as string] = {
      count: 1,
      isCompleted: false,
    }
  }, [currentStep?.item_progress?.total_document_completed])


  // Effect 2: Next document
  useEffect(() => {
    if (!currentStep?.id) return
    if (!documents.length) return


    const stepState = stepInitMapRef.current[currentStep.id as string]


    console.log(stepState, visibleDocumentCount, "2222")
    // Effect 1 chưa chạy cho step này → bỏ qua
    if (stepState === undefined) return


    // Step đã hoàn thành → không cần scroll
    if (stepState.isCompleted) return


    // Count chưa tăng so với lúc Effect 1 khởi tạo → bỏ qua
    if (visibleDocumentCount < stepState.count) return


    const lastIndex = documents.length - 1
    const newBlock = blockRefs.current[lastIndex]
    if (!newBlock) return


    setTimeout(() => {
      // newBlock.scrollIntoView({ behavior: 'smooth', block: 'end' })
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 200)


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
