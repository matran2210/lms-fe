import React, { useState } from 'react'
import { SaveIcon, PlusIcon, CloseIconNote } from '@lms/assets'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import toast from 'react-hot-toast'
import { closeNote, pushNotes, useAppDispatch } from '@lms/contexts'
import { v4 as uuidv4 } from 'uuid'
import { HookFormTextArea, MovableWindow } from '@lms/ui'
import { useParams, useRouter } from 'next/navigation'
import { CoursesAPI } from 'src/api/courses'

interface IProps {
  id: string | undefined
  content: string
  uuid: string | number
  count: number
}

const CreateNote = ({ id, content, uuid, count }: IProps) => {
  const router = useRouter()
  const params = useParams()
  const activityId = params.activityId
  const [activeSectionId, setActiveSectionId] = useState<string>()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)

  const validationSchema = z.object({
    [`description_${id ? id : uuid}`]: z
      .string()
      .trim()
      .min(1, VALIDATE_REQUIRED),
  })

  const { control, handleSubmit } = useForm<any>({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit',
  })

  const handleAddNote = () => {
    const note = {
      uuid: uuidv4(),
      id: '',
      name: 'Note',
      description: '',
    }
    dispatch(pushNotes(note))
  }

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
      <MovableWindow
        position={{
          width: '412px',
          height: '350px',
          top: 'calc(50% - 150px)',
          left: `calc(${22 + count}% - 200px)`,
        }}
        key={'testtesttest'}
        onClick={() => {}}
        zIndex={40}
        fixed
      >
        <div className="absolute left-0 top-0  h-full w-full border bg-white">
          <div className="bg-gray-100px-2.5 flex h-10 w-full items-center justify-between">
            <button
              className="text-gray"
              onClick={() => {
                handleAddNote()
              }}
            >
              <PlusIcon />
            </button>
            <div className="flex items-center">
              <button
                className="text-gray"
                onClick={() => {
                  handleSubmit((data: any) => {
                    onSubmit(data)
                  })()
                }}
                disabled={loading}
              >
                <SaveIcon />
              </button>
              <span className="mx-4 h-4 w-px bg-gray"></span>
              <button
                className="text-gray"
                onClick={() => {
                  removeNote()
                }}
                disabled={loading}
              >
                <CloseIconNote />
              </button>
            </div>
          </div>
          <div className="h-[calc(100%-30px)]">
            <HookFormTextArea
              placeholder="Take a note..."
              control={control}
              name={`description_${id ? id : uuid}`}
              className="not-resizer sapp-text-area h-[calc(100%-40px)] w-full whitespace-pre-wrap px-4 py-4 placeholder:text-sm placeholder:font-normal placeholder:text-gray"
              defaultValue={content}
            />
          </div>
        </div>
      </MovableWindow>
    </>
  )
}

export default CreateNote
