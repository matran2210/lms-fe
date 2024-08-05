import { CloseIconPreview, IconSend } from '@assets/icons'
import blankAvatar from '@assets/images/blank_avatar.webp'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { VerifiedIcon } from '@components/icons'
import { trackGAEvent } from '@utils/google-analytics'
import { calculateTimeAgo } from '@utils/helpers'
import Image from 'next/image'
import { SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SappIcon from 'src/common/SappIcon'
import { ActivityAPI } from 'src/pages/api/activity'
import { useAppDispatch } from 'src/redux/hook'
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
import { getDiscussion } from 'src/redux/slice/Course/MyCourse/Activity/Activity'
import {
  ICreateDiscussionResReact,
  IDiscussion,
  IDiscussionFile,
} from 'src/redux/types/Course/MyCourse/Activity/activity'
import { IUser } from 'src/redux/types/User/urser'
import ModalDeleteComment from './ModalDeleteComment'
import SappButtonIcon from '@components/base/button/SappButtonIcon'
import SappButton from '@components/base/button/SappButton'
import clsx from 'clsx'

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
  const [selectFile, setSelectFile] = useState<File[]>([])
  const [discussionFile, setDiscussionFile] = useState<IDiscussionFile[]>([])

  const canEdit = profile?.username === discussion?.username

  const { control, handleSubmit } = useForm<IEventData>({})

  const onSubmit = async (e: IEventData) => {
    try {
      const params = {
        content: e?.editData,
      }
      if (selectFile) {
        await CourseActivityApi.uploadImagesDiscussion({
          discussion_id: discussion?.id,
          new_discussion_file: selectFile,
          discussion_file_ids: discussion.course_discussion_files
            .filter((el) => {
              const isNotDelete = discussionFile.find(
                (item) => item.id === el.id,
              )
              if (isNotDelete?.id) {
                return el
              }
            })
            .map((item) => item.id),
        })
      }
      const res = await ActivityAPI.updateDiscussionComment(
        discussion?.id,
        params,
      )
      handleRefresh()
      if (res?.success) {
        setDiscussionContent(res?.data?.content)
        setIsEdit(false)
        setSelectFile([])
      }
    } catch (error) {}
  }

  const handleRefresh = () => {
    dispatch(
      getDiscussion({
        id: classId,
        sectionId: discussion?.course_section_id,
      }),
    )
  }

  const onDeleteComment = async () => {
    setLoading(true)
    try {
      const res = await ActivityAPI.deleteDiscussion(discussion?.id)
      if (res) {
        handleRefresh()
        setIsDelete(false)
        setLoading(false)
      }
    } catch (error) {}
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files
    if (files) {
      const imageFiles = Array.from(files).filter((file) =>
        file?.type?.startsWith('image/'),
      )
      if (imageFiles.length > 1) {
        toast.error('Vui lòng chỉ chọn 1 ảnh từ thiết bị.')
        return
      }

      // Loại bỏ các file có định dạng .webp
      const filteredFiles = imageFiles?.filter(
        (file) => !file?.name?.toLowerCase()?.endsWith('.webp'),
      )

      // Kiểm tra kích thước file không vượt quá 20MB
      const validFiles = filteredFiles?.filter(
        (file) => file?.size < 20 * 1024 * 1024,
      )

      if (validFiles?.length > 0) {
        setSelectFile(validFiles)
      } else {
        toast.error('Vui lòng chọn ảnh từ thiết bị, không quá 20MB')
        return
      }
    }
  }

  const handleDeleteFile = (id: string | number, isFile: boolean) => {
    if (isFile) {
      setSelectFile((prev: File[]) => {
        return prev.filter((_, i) => i !== id)
      })
    } else {
      setDiscussionFile((prev) => {
        return prev?.filter((e) => e.id !== id)
      })
    }
  }

  const handleEdit = () => {
    setEditValue(discussionContent)
    setIsEdit(true)
    trackGAEvent('Click Edit Comment Activity')
  }

  const handleCancelEdit = () => {
    setIsEdit(false)
    handleRefresh()
    setSelectFile([])
    trackGAEvent('Click Cancel Edit Comment Activity')
  }

  const handleDeleteComment = () => {
    setIsDelete(true)
    trackGAEvent('Click Delete Comment Activity')
  }

  useEffect(() => {
    setIsLike(discussion.is_like)
    setTimeAgo(() => calculateTimeAgo(discussion.created_at))
    setDiscussionFile(discussion.course_discussion_files)
  }, [discussion])

  return (
    <div className="flex gap-3 text-bw-1">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
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
          <div>
            <div className="flex flex-row">
              <div className="text-base font-semibold mb-1">
                {discussion?.full_name}
              </div>
              {discussion?.is_staff_support && (
                <div className="text-primary font-semibold bg-secondary h-6 ml-2 min-w-132px px-2 content-center">
                  <div className="flex flex-row">
                    <div className="content-center">
                      <VerifiedIcon />
                    </div>
                    <div className="content-center text-ssm px-2">
                      SAPP Supporter
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 flex-wrap mb-3">
              {discussionFile?.map((e) => (
                <div key={e.id} className={`relative bg-cover bg-no-repeat `}>
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
                  {isEdit && (
                    <div
                      className="absolute top-[-10px] right-[-10px] p-[5px] rounded-[80px] bg-white shadow-md"
                      onClick={() => handleDeleteFile(e.id, false)}
                    >
                      <CloseIconPreview width={12} height={12} />
                    </div>
                  )}
                </div>
              ))}
              {selectFile.map((file: File, index: number) => (
                <div
                  key={`comemnt-${index}`}
                  className={`relative bg-cover bg-no-repeat `}
                >
                  <Image
                    width={100}
                    height={100}
                    src={URL.createObjectURL(file)}
                    loading="eager"
                    blurDataURL={blankAvatar.src}
                    objectFit="contain"
                    onClick={() => setImageSrc(URL.createObjectURL(file))}
                    priority={true}
                    alt="file"
                  ></Image>
                  {isEdit && (
                    <div
                      className="absolute top-[-10px] right-[-10px] p-[5px] rounded-[80px] bg-white shadow-md"
                      onClick={() => {
                        handleDeleteFile(index, true)
                      }}
                    >
                      <CloseIconPreview width={12} height={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!isEdit && discussionContent && (
              <div className={`text-base mb-2 `}>{discussionContent}</div>
            )}

            {isEdit && (
              <div>
                <div className="relative border flex">
                  <HookFormTextField
                    control={control}
                    name={'editData'}
                    textSize="sm"
                    inputClassName={'max-h-10 !pr-9 border-none px-0'}
                    className=""
                    defaultValue={editValue}
                  ></HookFormTextField>
                  <div className="flex gap-x-2 items-center pr-1">
                    <div
                      className={`relative cursor-pointer select-none ${clsx({ hidden: discussionFile?.length > 0 || selectFile?.length > 0 })}`}
                    >
                      <SappIcon icon="camera"></SappIcon>
                      <input
                        type="file"
                        className="block absolute top-0 left-0 right-0 bottom-0 w-full h-full cursor-pointer opacity-0"
                        accept="image/jpeg, image/png, image/gif"
                        onChange={(e) => handleFileChange(e)}
                      />
                    </div>
                    <SappButtonIcon
                      type="submit"
                      ishover={false}
                      className="border-none !min-w-1 h-fit"
                    >
                      <IconSend className="hover:fill-yellow-500" />
                    </SappButtonIcon>
                  </div>
                </div>
                <SappButton
                  title=""
                  type="submit"
                  className="hidden"
                ></SappButton>
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
