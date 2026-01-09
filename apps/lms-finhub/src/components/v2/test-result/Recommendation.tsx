import { zodResolver } from '@hookform/resolvers/zod'
import { COMMENTS } from '@lms/core'
import { ButtonPrimary, HookFormTextArea } from '@lms/ui'
import { ClassAPI } from '@pages/api/class'
import { Dispatch, SetStateAction, useRef } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
interface IProps {
  classId: string
  quizAttemptId: string
  openRecomendation: boolean
  setOpenRecomendation: Dispatch<SetStateAction<boolean>>
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
}: IProps) => {
  const certificateContentRef = useRef<HTMLDivElement>(null)

  const validationSchema = z.object({
    comment: z.string().optional(),
  })

  const { handleSubmit, control, reset } = useForm<FormData>({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues: {
      comment: '',
    },
  })

  return (
    <>
      {openRecomendation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          ref={certificateContentRef}
        >
          <div className="left-0 top-0 h-96 w-1/4 bg-white shadow-xl ">
            <form
              className="flex h-full flex-col overflow-hidden"
              onSubmit={handleSubmit(async (data) => {
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
              })}
            >
              {/* Header */}
              <div className="flex-shrink-0 border-b px-6 py-4">
                <h3 className="text-gray-70000 text-lg font-semibold">
                  {COMMENTS?.STUDENT_COMMENT}
                </h3>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-6">
                <div className="space-y-6">
                  <div className="w-full">
                    <HookFormTextArea
                      className="h-52 w-full "
                      control={control}
                      name="comment"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 flex flex-shrink-0 items-center justify-between border-t px-6 py-4">
                <button
                  type="button"
                  className="focus:ring-2focus:ring-offset-2 inline-flex items-center px-4 py-2 text-sm font-medium transition-colors  duration-200 focus:outline-none"
                  onClick={() => {
                    reset()
                    setOpenRecomendation(false)
                  }}
                >
                  {COMMENTS?.CANCEL}
                </button>
                <ButtonPrimary
                  htmlType="submit"
                  title={COMMENTS?.SAVE}
                  className="focus:ring-2focus:ring-offset-2 inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors  duration-200 focus:outline-none"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Recommendation
