import blankAvatar from '@assets/images/blank_avatar.webp'
import SappModalV2 from '@components/base/modal/SappModalV2'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { VerifiedIcon } from '@components/icons'
import { trackGAEvent } from '@utils/google-analytics'
import { calculateTimeAgo } from '@utils/helpers'
import Image from 'next/image'
import { SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ActivityAPI } from 'src/pages/api/activity'
import { useAppDispatch } from 'src/redux/hook'
import { getDiscussion } from 'src/redux/slice/Course/MyCourse/Activity/Activity'
import {
  ICreateDiscussionResReact,
  IDiscussion,
} from 'src/redux/types/Course/MyCourse/Activity/activity'
import { IUser } from 'src/redux/types/User/urser'
import ModalDeleteComment from './ModalDeleteComment'

type Props = {
  rank?: number
  discussion: IDiscussion
  idReply?: string
  handleChangeIdReply?: (idReply: string) => void
  onReact: (data: ICreateDiscussionResReact) => Promise<void>
  setImageSrc: (value: SetStateAction<string | undefined>) => void
  classId?: string
  profile?: IUser
  setLoading: (isLoading: boolean) => void
}

type IEventData = {
  editData?: string
}
function DiscussionElement({
  rank = 0,
  discussion,
  idReply,
  handleChangeIdReply,
  setImageSrc,
  classId,
  profile,
  setLoading,
}: Props) {
  const [isLike, setIsLike] = useState<boolean>(discussion.is_like)
  const [timeAgo, setTimeAgo] = useState<string>('')
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isDelete, setIsDelete] = useState<boolean>(false)
  const [editValue, setEditValue] = useState('')
  const [discussionContent, setDiscussionContent] = useState(
    discussion?.content,
  )
  const dispatch = useAppDispatch()

  const canEdit = profile?.username === discussion?.username

  const { control, handleSubmit } = useForm<IEventData>({})

  const onSubmit = async (e: IEventData) => {
    try {
      const params = {
        content: e?.editData,
      }
      const res = await ActivityAPI.updateDiscussionComment(
        discussion?.id,
        params,
      )

      if (res?.success) {
        setDiscussionContent(res?.data?.content)
        setIsEdit(false)
      }
    } catch (error) {}
  }

  const onDeleteComment = async () => {
    setLoading(true)
    try {
      const res = await ActivityAPI.deleteDiscussion(discussion?.id)
      if (res) {
        dispatch(
          getDiscussion({
            id: classId,
            sectionId: discussion?.course_section_id,
          }),
        )
        setIsDelete(false)
        setLoading(false)
      }
    } catch (error) {}
  }

  const handleEdit = () => {
    setEditValue(discussionContent)
    setIsEdit(true)
    trackGAEvent('Click Edit Comment Activity')
  }

  const handleCancelEdit = () => {
    setIsEdit(false)
    trackGAEvent('Click Cancel Edit Comment Activity')
  }

  const handleDeleteComment = () => {
    setIsDelete(true)
    trackGAEvent('Click Delete Comment Activity')
  }

  useEffect(() => {
    setIsLike(discussion.is_like)
    setTimeAgo(() => calculateTimeAgo(discussion.created_at))
  }, [discussion])

  return (
    <div className="flex gap-3 text-bw-1">
      <form
        className="w-full"
        onSubmit={handleSubmit((e: IEventData) => onSubmit(e))}
      >
        <div className="flex flex-row gap-3">
          <div className="flex-none leading-0">
            <Image
              width={40}
              height={40}
              className="rounded-full"
              src={
                discussion?.avatar?.['50x50'] ||
                discussion?.avatar?.['ORIGIN'] ||
                blankAvatar
              }
              loading="eager"
              blurDataURL={blankAvatar.src}
              priority={true}
              alt="avatar"
            ></Image>
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold mb-1">
              {discussion?.full_name}
            </div>
            <div className="flex gap-3 flex-wrap">
              {discussion?.course_discussion_files?.map((e) => {
                return (
                  <div key={e.id}>
                    <Image
                      width={100}
                      height={100}
                      src={e.url}
                      loading="eager"
                      blurDataURL={blankAvatar.src}
                      objectFit="contain"
                      onClick={() => setImageSrc(e.url)}
                      priority={true}
                      alt="file"
                    ></Image>
                  </div>
                )
              })}
            </div>

            {!isEdit && discussionContent && (
              <div className={`text-base mb-2 `}>{discussionContent}</div>
            )}

            {isEdit && (
              <div>
                <HookFormTextField
                  control={control}
                  name={'editData'}
                  textSize="sm"
                  inputClassName={'max-h-10 !pr-9'}
                  placeholder="Edit your comment..."
                  className=""
                  defaultValue={editValue}
                ></HookFormTextField>
                <button type="submit" className="hidden"></button>
                <div className="relative w-full top-2 right-3 cursor-pointer select-none pb-2">
                  <input type="text" className="absolute w-full opacity-0" />
                </div>
              </div>
            )}

            <div className="flex gap-y-1 gap-x-6 font-semibold text-medium-sm">
              {!isEdit && rank < 1 && (
                <div
                  role="button"
                  className={`${
                    discussion?.id === idReply ? 'text-primary' : ''
                  } select-none`}
                  onClick={() => {
                    handleChangeIdReply && handleChangeIdReply(discussion?.id)
                    trackGAEvent('Click Reply Comment Activity')
                  }}
                >
                  Reply
                </div>
              )}

              {canEdit && (
                <div className="relative">
                  <div className="flex flex-row">
                    {!isEdit ? (
                      <>
                        <div
                          className="pr-6 font-semibold text-medium-sm text-bw-1 cursor-pointer"
                          onClick={handleEdit}
                        >
                          Edit
                        </div>
                        <div
                          className="font-semibold text-medium-sm cursor-pointer"
                          onClick={handleDeleteComment}
                        >
                          Delete
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="font-semibold text-medium-sm cursor-pointer hover:underline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </div>
                        <span className="text-gray-1 font-normal pl-1">
                          edit this comment
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              <div className="font-normal text-gray-1 cursor-default">
                {timeAgo}
              </div>
            </div>
          </div>
        </div>
      </form>
      {isDelete && (
        <ModalDeleteComment
          isDelete={isDelete}
          setIsDelete={setIsDelete}
          onDeleteComment={onDeleteComment}
        />
      )}
    </div>
  )
}

export default DiscussionElement
