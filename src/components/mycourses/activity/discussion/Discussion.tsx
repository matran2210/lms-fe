import blankAvatar from '@assets/images/blank_avatar.webp'
import sappAvatar from '@assets/images/blank_avatar_notification.png'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import SappIcon from 'src/common/SappIcon'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  courseActivityReducer,
  createDiscussion,
  getDiscussion,
  reactDiscussion,
  uploadImagesDiscussion,
} from 'src/redux/slice/Course/MyCourse/Activity/Activity'
import { userReducer } from 'src/redux/slice/User/User'
import {
  ICreateDiscussionResReact,
  IDiscussion,
} from 'src/redux/types/Course/MyCourse/Activity/activity'
import DiscussionElement from './DiscussionElement'
import SappModalImage from '@components/base/modal/SappModalImage'
import toast from 'react-hot-toast'
import { Skeleton } from 'antd'
import { CameraIcon, IconSend } from '@assets/icons'
import SappButtonIcon from '@components/base/button/SappButtonIcon'
import SappButton from '@components/base/button/SappButton'
import clsx from 'clsx'
import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import ActionDiscussion from './ActionDiscussion'
import SendComment from './SendComment'

type Props = {
  class_id: string
}

/**
 * Component chức năng đại diện cho phần discussion.
 * @param {Props} props - Props của component.
 */
const Discussion = ({ class_id }: Props) => {
  const router = useRouter()

  const dispatch = useAppDispatch()
  const selector = useAppSelector(courseActivityReducer)
  const [idReply, setIdReply] = useState<string>()
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const { user } = useAppSelector(userReducer)
  // const [stream, setStream] = useState<MediaStream | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [rootSelectedFiles, setRootSetSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const rootFileInputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const [imageSrc, setImageSrc] = useState<string>()

  const { control, handleSubmit, reset, setError, clearErrors } = useForm<{
    comment: string
    commentRoot: string
  }>({})

  /**
   * Xử lý sự thay đổi của ID phản hồi và đặt lại biểu mẫu.
   * @param {string} idReply - ID của phản hồi.
   */
  const handleChangeIdReply = (idReply: string) => {
    setIdReply(idReply)
    reset({ comment: '' })
    setSelectedFiles([])
  }

  /**
   * Gửi bình luận discussion và cập nhật luồng discussion.
   * @param {{ comment: string }} data - Dữ liệu bình luận cần gửi.
   */
  const onSubmit = async (
    { comment, commentRoot }: { comment: string; commentRoot: string },
    isRoot?: boolean,
  ) => {
    if (router.query.activityId) {
      let parent_id = idReply
      let content = comment
      let fieldToReset

      if (isRoot) {
        parent_id = undefined
        content = commentRoot
        fieldToReset = 'commentRoot'
      } else {
        fieldToReset = 'comment'
      }

      try {
        // Trước khi gửi, clear lỗi của trường comment và commentRoot
        clearErrors('comment')
        clearErrors('commentRoot')

        // Nếu isRoot là true và commentRoot không có giá trị, đặt lỗi cho trường commentRoot
        if (isRoot && !commentRoot?.trim() && !rootSelectedFiles?.[0]) {
          setError('commentRoot', {
            type: 'manual',
            message: 'This field is required',
          })
          return
        }
        if (!isRoot && !comment?.trim() && !selectedFiles?.[0]) {
          setError('comment', {
            type: 'manual',
            message: 'This field is required',
          })
          return
        }

        const getSelectedFiles = selectedFiles
        const getRootSelectedFiles = rootSelectedFiles

        // Clear comment data
        reset({ [fieldToReset]: '' })
        isRoot ? setRootSetSelectedFiles([]) : setSelectedFiles([])

        await dispatch(
          createDiscussion({
            course_section_id: router.query.activityId as string,
            class_id: class_id,
            content: content?.trim(),
            parent_id,
          }),
        )
          .unwrap()
          .then((e) => {
            if (
              !e?.id ||
              (isRoot && !getRootSelectedFiles?.[0]) ||
              (!isRoot && !getSelectedFiles?.[0])
            ) {
              dispatch(
                getDiscussion({
                  id: class_id,
                  sectionId: router.query.activityId as string,
                }),
              )
              return
            }

            dispatch(
              uploadImagesDiscussion({
                discussion_id: e?.id,
                new_discussion_file: isRoot
                  ? getRootSelectedFiles
                  : getSelectedFiles,
              }),
            )
              .unwrap()
              .then(() => {
                dispatch(
                  getDiscussion({
                    id: class_id,
                    sectionId: router.query.activityId as string,
                  }),
                )
                if (isRoot) {
                  setRootSetSelectedFiles([])
                } else {
                  setSelectedFiles([])
                }
              })
          })
      } catch (error) {
        // Sử dụng setError để đặt lỗi cho trường comment hoặc commentRoot tùy thuộc vào isRoot
        const fieldName = isRoot ? 'commentRoot' : 'comment'
        setError(fieldName, {
          type: 'manual',
          message: 'Có lỗi xảy ra khi gửi bình luận',
        })
      }
    }
  }

  /**
   * React vào một bình luận discussion và cập nhật luồng discussion.
   * @param {ICreateDiscussionResReact} data - Dữ liệu react cần gửi.
   */
  const onReact = async (data: ICreateDiscussionResReact) => {
    // Xóa bất kỳ timeout debounce hiện tại nào
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }
    debounceTimeout.current = setTimeout(async () => {
      const currentDiscussion = findDiscussionById(
        data?.course_discussion_id,
        selector?.discussion,
      )
      if (currentDiscussion?.is_like === data?.is_like) {
        return
      }
      try {
        await dispatch(reactDiscussion(data))
      } catch (error) {
      } finally {
        await dispatch(getDiscussion(router.query.activityId as string))
      }
    }, 1000)
  }

  /**
   * Tìm kiếm một discussion trong danh sách dựa trên ID.
   *
   * @param idToFind - ID của discussion cần tìm kiếm.
   * @param data - Danh sách discussion để tìm kiếm trong đó.
   * @returns - discussion có ID tương ứng hoặc null nếu không tìm thấy.
   */
  const findDiscussionById = (
    idToFind: string,
    data?: IDiscussion[],
  ): IDiscussion | null => {
    // Nếu không có dữ liệu, trả về null ngay lập tức
    if (!data) {
      return null
    }

    // Duyệt qua danh sách discussion
    for (const item of data) {
      // Nếu ID trùng khớp, trả về discussion
      if (item?.id === idToFind) {
        return item
      }

      // Nếu có discussion con, đệ quy để tìm trong discussion con
      if (item?.children && item?.children?.length > 0) {
        const childResult = findDiscussionById(idToFind, item?.children)
        if (childResult) {
          return childResult
        }
      }
    }

    // Nếu không tìm thấy, trả về null
    return null
  }

  /**
   * Xử lý sự kiện thay đổi file khi người dùng chọn file từ hộp thoại
   *
   * @param {ChangeEvent<HTMLInputElement>} e - Sự kiện thay đổi file từ input element
   * @param {boolean} [isRoot] - Biến xác định xem có phải là root file hay không
   */
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    isRoot?: boolean,
  ) => {
    const files = e?.target?.files

    if (files) {
      // Kiểm tra và chỉ chấp nhận ảnh từ thiết bị
      const imageFiles = Array.from(files).filter((file) =>
        file?.type?.startsWith('image/'),
      )

      // Loại bỏ các file có định dạng .webp
      const filteredFiles = imageFiles?.filter(
        (file) => !file?.name?.toLowerCase()?.endsWith('.webp'),
      )

      // Kiểm tra kích thước file không vượt quá 20MB
      const validFiles = filteredFiles?.filter(
        (file) => file?.size <= 20 * 1024 * 1024,
      )

      if (validFiles?.length > 0) {
        if (isRoot) {
          setRootSetSelectedFiles([...rootSelectedFiles, ...validFiles])
        } else {
          setSelectedFiles([...selectedFiles, ...validFiles])
        }
      } else {
        // Hiển thị thông báo lỗi sử dụng react-hot-toast
        toast.error('Vui lòng chọn ảnh từ thiết bị, không quá 20MB')
        return
      }
    }

    // Xóa giá trị của input để làm sạch
    if (fileInputRef?.current) {
      fileInputRef.current.value = ''
    }

    if (rootFileInputRef?.current) {
      rootFileInputRef.current.value = ''
    }

    e.target.value = ''
  }

  const handleRemoveSelectedFiles = (
    indexToRemove: number,
    isRoot?: boolean,
  ) => {
    let updatedFiles: File[] = []
    if (isRoot) {
      updatedFiles = [...rootSelectedFiles]
      updatedFiles?.splice(indexToRemove, 1)
      setRootSetSelectedFiles(updatedFiles)
    } else {
      updatedFiles = [...selectedFiles]
      updatedFiles?.splice(indexToRemove, 1)
      setSelectedFiles(updatedFiles)
    }
  }

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>,
    isRoot?: boolean,
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Kiểm tra nếu nhấn Enter và không nhấn Shift
      e.preventDefault() // Ngăn chặn hành động mặc định của Enter
      handleSubmit((data) => onSubmit(data, isRoot ? true : false))()
    }
  }

  return (
    <div className="mb-15 flex h-full flex-col justify-between bg-white">
      <div className="mb-6 hidden text-lg font-medium md:block">Discussion</div>
      <Skeleton loading={loading}>
        {selector?.discussion?.map((e, i) => {
          return (
            <div className={` ${i !== 0 ? 'mt-6' : ''}`} key={e.id}>
              <DiscussionElement
                onReact={onReact}
                discussion={e}
                idReply={idReply}
                handleChangeIdReply={handleChangeIdReply}
                setImageSrc={setImageSrc}
                classId={class_id}
                profile={user}
                setLoading={setLoading}
                isSappSupporterUserCurrent={
                  selector?.userInDiscussion?.is_sapp_supporter
                }
              />
              <div
                className={`${
                  e?.children?.[0] ? 'mt-6' : ''
                } relative overflow-hidden pl-5 md:ml-[52px]`}
              >
                {e?.children?.[0] && (
                  <div>
                    <div
                      className="bg-size-100-30 absolute bottom-0 left-0 top-0 -mt-1 w-0.5"
                      style={{
                        background:
                          'repeating-linear-gradient(to bottom, #DCDDDD, #DCDDDD 12px, white 6px, white 25px)',
                      }}
                    ></div>
                    {e?.children?.map((f, index) => {
                      return (
                        <div className={index === 0 ? '' : 'mt-5'} key={f?.id}>
                          <DiscussionElement
                            rank={2}
                            discussion={f}
                            onReact={onReact}
                            setImageSrc={setImageSrc}
                            classId={class_id}
                            profile={user}
                            setLoading={setLoading}
                            isSappSupporterUserCurrent={
                              selector?.userInDiscussion?.is_sapp_supporter
                            }
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
                <div
                  className={`transition-max-height flex items-start gap-3 overflow-visible duration-300 ${
                    idReply === e.id ? `mt-6 max-h-96` : 'max-h-0'
                  }`}
                >
                  <div className="flex-none leading-0">
                    <Image
                      width={50}
                      height={50}
                      className="rounded-full"
                      src={
                        selector?.userInDiscussion?.is_sapp_supporter
                          ? e?.avatar?.['50x50'] ||
                            e?.avatar?.['ORIGIN'] ||
                            sappAvatar
                          : user?.detail?.avatar?.['50x50'] ||
                            user?.detail?.avatar?.['ORIGIN'] ||
                            blankAvatar
                      }
                      loading="eager"
                      priority={true}
                      alt="avatar"
                    ></Image>
                  </div>
                  <form
                    onSubmit={handleSubmit((e) => onSubmit(e))}
                    className="flex-1"
                    encType="multipart/form-data"
                  >
                    {selectedFiles?.length > 0 && (
                      <div>
                        <ul className="flex flex-wrap gap-4">
                          {selectedFiles.map((file, index) => (
                            <li key={index} className="relative mb-2 leading-0">
                              <div
                                className="absolute right-0 top-0 z-40 flex h-6 w-6 -translate-y-1/2 translate-x-1/2 cursor-pointer select-none items-center justify-center rounded-full bg-white shadow-box hover:text-error"
                                role="button"
                                onClick={() => handleRemoveSelectedFiles(index)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="h-4 w-4 "
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </div>
                              <Image
                                width={100}
                                height={100}
                                src={URL.createObjectURL(file)}
                                loading="eager"
                                objectFit="contain"
                                alt="Discussion file"
                                onClick={() => {
                                  setImageSrc(URL.createObjectURL(file))
                                }}
                                priority={true}
                              ></Image>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="relative">
                      <HookFormTextArea
                        control={control}
                        name={idReply === e?.id ? 'comment' : ''}
                        placeholder="Input Text..."
                        handleKeyDown={handleKeyDown}
                        className="w-fill--available comment-scrollbar h-[50px] min-h-[50px] rounded-lg px-4 py-3"
                        actions={
                          <div className="flex items-center gap-x-3">
                            <SappButtonIcon
                              type="submit"
                              ishover={false}
                              className="sapp-custom-hover h-fit !min-w-1 cursor-pointer select-none border-none bg-transparent"
                              classTitle="!m-0"
                            >
                              <SendComment />
                            </SappButtonIcon>
                            <div
                              className={`relative cursor-pointer select-none hover:text-primary ${clsx({ hidden: selectedFiles?.length > 0 })}`}
                            >
                              <CameraIcon />
                              <input
                                type="file"
                                className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 block h-full w-full opacity-0 "
                                accept="image/png, image/gif, image/jpeg, image/png, image/svg+xml"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                              />
                            </div>
                          </div>
                        }
                      />
                      <ActionDiscussion
                        titlePrimary={'reply this comment'}
                        onClick={() => handleChangeIdReply('')}
                      />
                    </div>
                    <SappButton
                      title=""
                      type="submit"
                      className="hidden"
                    ></SappButton>
                  </form>
                </div>
              </div>
            </div>
          )
        })}
      </Skeleton>
      <div
        className={`transition-max-height mt-6 flex items-start gap-3 overflow-visible duration-300`}
      >
        <div className="flex-none leading-0">
          <Image
            width={50}
            height={50}
            className="rounded-full"
            src={
              selector.userInDiscussion?.is_sapp_supporter &&
              selector.userInDiscussion?.avatar
                ? selector.userInDiscussion?.avatar['50x50'] ||
                  selector.userInDiscussion?.avatar['ORIGIN'] ||
                  sappAvatar
                : user?.detail?.avatar['50x50'] ||
                  user?.detail?.avatar['ORIGIN'] ||
                  blankAvatar
            }
            loading="eager"
            priority={true}
            alt="user avatar"
          ></Image>
        </div>
        <form
          onSubmit={handleSubmit((e) => onSubmit(e, true))}
          className="relative flex-1"
          encType="multipart/form-data"
        >
          {rootSelectedFiles?.length > 0 && (
            <div>
              <ul className="flex flex-wrap gap-4">
                {rootSelectedFiles?.map((file, index) => (
                  <li key={index} className="relative mb-2 leading-0">
                    <div
                      className="absolute right-0 top-0 z-40 flex h-6 w-6 -translate-y-1/2 translate-x-1/2 cursor-pointer select-none items-center justify-center rounded-full bg-white shadow-box hover:text-error"
                      role="button"
                      onClick={() => handleRemoveSelectedFiles(index, true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-4 w-4 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <Image
                      width={100}
                      height={100}
                      src={URL.createObjectURL(file)}
                      loading="eager"
                      objectFit="contain"
                      onClick={() => {
                        setImageSrc(URL.createObjectURL(file))
                      }}
                      priority={true}
                      alt=""
                    ></Image>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="relative">
            <HookFormTextArea
              control={control}
              name={'commentRoot'}
              placeholder="Input Text1..."
              handleKeyDown={(e: any) => handleKeyDown(e, true)}
              className="w-fill--available comment-scrollbar h-[50px] min-h-[50px] rounded-lg px-4 py-3"
              actions={
                <div className="flex items-center gap-x-3">
                  <SappButtonIcon
                    type="submit"
                    ishover={false}
                    className="sapp-custom-hover h-fit !min-w-1 cursor-pointer select-none border-none bg-transparent"
                    classTitle="!m-0"
                  >
                    <SendComment />
                  </SappButtonIcon>
                  <div
                    className={`relative cursor-pointer select-none hover:text-primary ${clsx({ hidden: rootSelectedFiles?.length > 0 })}`}
                  >
                    <span
                      className="cursor-pointer"
                      onClick={() => rootFileInputRef?.current?.click()}
                    >
                      <CameraIcon />
                    </span>
                    <input
                      type="file"
                      className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 block h-full w-full opacity-0"
                      accept="image/jpeg, image/png, image/gif"
                      multiple
                      onChange={(e) => handleFileChange(e, true)}
                      ref={rootFileInputRef}
                    />
                  </div>
                </div>
              }
            />
          </div>
        </form>
      </div>
      <SappModalImage setSrc={setImageSrc} src={imageSrc}></SappModalImage>
    </div>
  )
}

export default Discussion
