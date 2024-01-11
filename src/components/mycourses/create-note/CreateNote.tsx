import React, { useState } from 'react'
import { useRouter } from 'next/router'
import MovableWindow from '@components/base/window'
import { SaveIcon, PlusIcon, CloseIconNote } from '@assets/icons'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import CourseAPI from 'src/pages/api/courses'
import toast from 'react-hot-toast'
import { pushNotes, closeNote } from 'src/redux/slice/Course/NotesList'
import { useAppSelector, useAppDispatch } from 'src/redux/hook'
import { v4 as uuidv4 } from 'uuid'

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

  const validationSchema = z.object({
    [`description_${id ? id : uuid}`]: z
      .string()
      .trim()
      .min(1, VALIDATE_REQUIRED),
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
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
      const params = {
        course_section_id: activityId,
        name: 'Note',
        description: data?.[`description_${id ? id : uuid}`],
      }
      const res = await CourseAPI.createNote(params)
      setActiveSectionId(res?.data?.id)
      toast.success('Tạo thành công!')
    } catch (error) {
      toast.error('Tạo không thành công!')
    }
  }

  const updateNote = async (data: any) => {
    try {
      const params = {
        name: 'Note',
        description: data?.[`description_${id ? id : uuid}`],
      }
      const res = await CourseAPI.updateCourseNotesList(
        id || activeSectionId,
        params,
      )
      toast.success('Cập nhật thành công!')
    } catch (error) {
      toast.error('Cập nhật không thành công!')
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
      >
        <div className="absolute h-full w-full  top-0 left-0 border bg-white">
          <div className="flex w-6-percent items-center bg-gray-3 w-full h-10 justify-between px-2.5">
            <button
              className="text-gray-1"
              onClick={() => {
                handleAddNote()
              }}
            >
              <PlusIcon />
            </button>
            <div className="flex items-center">
              <button
                className="text-gray-1"
                onClick={() => {
                  handleSubmit((data: any) => {
                    onSubmit(data)
                  })()
                }}
              >
                <SaveIcon />
              </button>
              <span className="h-4 w-px bg-gray-1 mx-4"></span>
              <button
                className="text-gray-1"
                onClick={() => {
                  removeNote()
                }}
              >
                <CloseIconNote />
              </button>
            </div>
          </div>
          <HookFormTextArea
            placeholder="Take a note..."
            control={control}
            name={`description_${id ? id : uuid}`}
            className="w-full h-[calc(100%-40px)] sapp-text-area px-4 py-4 placeholder:text-medium-sm placeholder:font-medium placeholder:text-gray-1 whitespace-pre-wrap"
            defaultValue={content}
          />
        </div>
      </MovableWindow>
    </>
  )
}

export default CreateNote
