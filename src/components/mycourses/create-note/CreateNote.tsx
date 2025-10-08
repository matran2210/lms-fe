import { CloseIconNote, SaveIcon } from '@assets/icons'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import ModalResizeable from '@components/base/modal/ModalResizeable'
import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { CoursesAPI } from 'src/pages/api/courses'
import { useAppDispatch } from 'src/redux/hook'
import { closeNote } from 'src/redux/slice/Course/NotesList'
import { z } from 'zod'

interface IProps {
  id: string | undefined
  content: string
  uuid: string | number
  count: number
}

const CreateNote = ({ id, content, uuid, count }: IProps) => {
  const router = useRouter()
  const activityId = router.query.activityId
  const [activeSectionId, setActiveSectionId] = useState<string>()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)

  const validationSchema = z.object({
    [`description_${id ? id : uuid}`]: z
      .string()
      .trim()
      .min(1, VALIDATE_REQUIRED),
  })

  const { control, handleSubmit, watch, reset } = useForm<any>({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues: {
      [`description_${id ? id : uuid}`]: content,
    },
  })

  const [baselineContent, setBaselineContent] = useState<string>(content)
  const watchDescription = watch(`description_${id ? id : uuid}`)
  const isChanged = watchDescription !== baselineContent

  const createNewNote = async (data: any) => {
    try {
      setLoading(true)
      const params = {
        course_section_id: activityId,
        name: 'Note',
        description: data?.[`description_${id ? id : uuid}`],
      }
      const res = await CoursesAPI.createNote(params)
      setActiveSectionId(res?.data?.id)
      // Cập nhật baseline để lần gõ tiếp theo hiển thị nút Save chính xác
      const savedValue = data?.[`description_${id ? id : uuid}`] || ''
      setBaselineContent(savedValue)
      reset(
        { [`description_${id ? id : uuid}`]: savedValue },
        { keepDirty: false },
      )
      toast.success('Tạo thành công!')
    } catch (error) {
      toast.error('Tạo không thành công!')
    } finally {
      setLoading(false)
    }
  }

  const updateNote = async (data: any) => {
    try {
      setLoading(true)
      const params = {
        name: 'Note',
        description: data?.[`description_${id ? id : uuid}`],
      }
      await CoursesAPI.updateCourseNotesList(id || activeSectionId, params)
      // Cập nhật baseline sau khi lưu để theo dõi thay đổi mới
      const savedValue = data?.[`description_${id ? id : uuid}`] || ''
      setBaselineContent(savedValue)
      reset(
        { [`description_${id ? id : uuid}`]: savedValue },
        { keepDirty: false },
      )
      toast.success('Cập nhật thành công!')
    } catch (error) {
      toast.error('Cập nhật không thành công!')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: any) => {
    id || activeSectionId ? updateNote(data) : createNewNote(data)
  }

  const removeNote = () => {
    dispatch(closeNote(uuid))
  }

  return (
    <>
      <ModalResizeable
        bodyClassName="h-[calc(100%-8px)]"
        modalIndex={count}
        header={
          <div className="modal-header modal-dragger flex w-full cursor-move items-center justify-between rounded-t-xl bg-gray-100 px-4 py-3">
            <div className="text-sm font-semibold text-gray-800">
              {id || activeSectionId ? 'Edit Note' : 'New Note'}
            </div>
            <button
              className="text-icon"
              onClick={() => {
                removeNote()
              }}
              disabled={loading}
            >
              <CloseIconNote />
            </button>
          </div>
        }
        handleCloseScratchPad={() => {
          removeNote()
        }}
        position="center"
        width={412}
        height={350}
      >
        <div className="flex h-full flex-col p-4">
          <HookFormTextArea
            placeholder="Take a note..."
            control={control}
            name={`description_${id ? id : uuid}`}
            defaultValue={content}
            className="not-resizer sapp-text-area h-[calc(100%-8px)] w-full flex-1 whitespace-pre-wrap placeholder:text-sm placeholder:font-normal placeholder:text-[#A1A1A1]"
          />
          {isChanged && (
            <div className="flex justify-end">
              <ButtonSecondary
                data-aos="fade-in"
                onClick={() => {
                  handleSubmit((data: any) => {
                    onSubmit(data)
                  })()
                }}
                disabled={loading}
                startIcon={<SaveIcon />}
              >
                Save
              </ButtonSecondary>
            </div>
          )}
        </div>
      </ModalResizeable>
    </>
  )
}

export default CreateNote
