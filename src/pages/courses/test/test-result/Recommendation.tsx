import { useRef } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import ButtonPrimary from 'src/components/base/button/ButtonPrimary'
import { Dispatch, SetStateAction } from 'react'
import { COMMENTS } from 'src/constants/grade'
import { ClassAPI } from '@pages/api/class'
import toast from 'react-hot-toast'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import ResizableComponent from './ResizableComponent'
interface IProps {
  classId: string
  quizAttemptId: string
  openRecomendation: boolean
  setOpenRecomendation: Dispatch<SetStateAction<boolean>>
  componentPosition: object
  setComponentPosition: Dispatch<SetStateAction<object>>
}

interface FormData {
  comment?: string
  recommendation?: string
}

const Recommendation = ({
  classId,
  quizAttemptId,
  openRecomendation,
  setOpenRecomendation,
  componentPosition,
  setComponentPosition,
}: IProps) => {
  const certificateContentRef = useRef<HTMLDivElement>(null)

  const validationSchema = z.object({
    comment: z.string().optional(),
  })

  const { handleSubmit, control } = useForm<FormData>({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues: {
      comment: '',
    },
  })

  const handleResize = (
    data: { top: number; left: number; width: number; height: number },
    index: number,
  ) => {
    setComponentPosition(data)
  }

  return (
    <>
      {openRecomendation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          ref={certificateContentRef}
        >
          <ResizableComponent
            key={'resizable-recommendation'}
            index={1}
            getResize={handleResize}
            parentContentRef={certificateContentRef}
            position={componentPosition}
          >
            <div className="absolute left-0 top-0 h-full w-full rounded-lg bg-white shadow-xl">
              <form
                className="flex h-full flex-col overflow-hidden"
                onSubmit={handleSubmit(async (data) => {
                  try {
                    const reason = data.comment?.trim() || ''
                    if (!reason) {
                      toast.error('Please enter a comment')
                      return
                    }
                    await ClassAPI.sendMailRequestRegrading(
                      classId,
                      quizAttemptId,
                      reason,
                    )
                    toast.success('Request sent successfully')
                    setOpenRecomendation(false)
                  } catch (error) {
                    toast.error('Failed to send request')
                  }
                })}
              >
                {/* Header */}
                <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {COMMENTS?.REQUEST_REGRADING}
                  </h3>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                  <div className="space-y-6">
                    <div className="not-resizer w-full">
                      <HookFormTextField
                        control={control}
                        name="comment"
                        label={COMMENTS?.STUDENT_COMMENT}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="not-resizer flex flex-shrink-0 items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
                  <button
                    type="button"
                    className="focus:ring-2focus:ring-offset-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:outline-none"
                    onClick={() => {
                      setOpenRecomendation(false)
                    }}
                  >
                    {COMMENTS?.CANCEL}
                  </button>
                  <ButtonPrimary
                    type="submit"
                    title={COMMENTS?.SAVE}
                    className="focus:ring-2focus:ring-offset-2 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white transition-colors  duration-200 focus:outline-none"
                  />
                </div>
              </form>
            </div>
          </ResizableComponent>
        </div>
      )}
    </>
  )
}

export default Recommendation
