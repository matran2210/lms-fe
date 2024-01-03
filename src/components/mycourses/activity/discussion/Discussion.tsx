import blankAvatar from '@assets/images/blank_avatar.webp'
import SappModal from '@components/base/modal/SappModal'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ChangeEvent, SetStateAction, useRef, useState } from 'react'
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
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [rootSelectedFiles, setRootSetSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const rootFileInputRef = useRef<HTMLInputElement | null>(null)

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
              (isRoot && !rootSelectedFiles?.[0]) ||
              (!isRoot && !selectedFiles?.[0])
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
                discussion_id: e.id,
                new_discussion_file: isRoot ? rootSelectedFiles : selectedFiles,
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

        reset({ [fieldToReset]: '' })
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
        data.course_discussion_id,
        selector.discussion,
      )
      if (currentDiscussion?.is_like === data.is_like) {
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
      if (item.id === idToFind) {
        return item
      }

      // Nếu có discussion con, đệ quy để tìm trong discussion con
      if (item.children && item.children.length > 0) {
        const childResult = findDiscussionById(idToFind, item.children)
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
    const files = e.target.files

    if (files) {
      // Kiểm tra và chỉ chấp nhận ảnh từ thiết bị
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith('image/'),
      )

      // Loại bỏ các file có định dạng .webp
      const filteredFiles = imageFiles.filter(
        (file) => !file.name.toLowerCase().endsWith('.webp'),
      )

      // Kiểm tra kích thước file không vượt quá 20MB
      const validFiles = filteredFiles.filter(
        (file) => file.size <= 20 * 1024 * 1024,
      )

      if (validFiles.length > 0) {
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    if (rootFileInputRef.current) {
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
      updatedFiles.splice(indexToRemove, 1)
      setRootSetSelectedFiles(updatedFiles)
    } else {
      updatedFiles = [...selectedFiles]
      updatedFiles.splice(indexToRemove, 1)
      setSelectedFiles(updatedFiles)
    }
  }

  return (
    <div className="p-6 bg-white">
      <div className="text-xl font-bold mb-4">Discussion</div>
      {selector.discussion?.map((e, i) => {
        return (
          <div className={` ${i !== 0 ? 'mt-6' : ''}`} key={e.id}>
            <DiscussionElement
              onReact={onReact}
              discussion={e}
              idReply={idReply}
              handleChangeIdReply={handleChangeIdReply}
              setImageSrc={setImageSrc}
            />
            <div
              className={`${
                e.children?.[0] ? 'mt-6' : ''
              } ' relative ml-13 pl-5 overflow-hidden`}
            >
              {e.children?.[0] && (
                <div>
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 -mt-1 bg-size-100-30"
                    style={{
                      background:
                        'repeating-linear-gradient(to bottom, #DCDDDD, #DCDDDD 12px, white 6px, white 25px)',
                    }}
                  ></div>
                  {e.children.map((f, index) => {
                    return (
                      <div className={index === 0 ? '' : 'mt-5'} key={f.id}>
                        <DiscussionElement
                          rank={2}
                          discussion={f}
                          onReact={onReact}
                          setImageSrc={setImageSrc}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
              <div
                className={`flex items-start gap-3 overflow-visible transition-max-height duration-300 ${
                  idReply === e.id ? `max-h-96 mt-6` : 'max-h-0'
                }`}
              >
                <div className="flex-none leading-0">
                  <Image
                    width={40}
                    height={40}
                    className="rounded-full"
                    src={
                      user.detail.avatar['50x50'] ||
                      user.detail.avatar['ORIGIN'] ||
                      blankAvatar
                    }
                    loading="eager"
                  ></Image>
                </div>
                <form
                  onSubmit={handleSubmit((e) => onSubmit(e))}
                  className="flex-1"
                  encType="multipart/form-data"
                >
                  {selectedFiles.length > 0 && (
                    <div>
                      <ul className="flex gap-4 flex-wrap">
                        {selectedFiles.map((file, index) => (
                          <li key={index} className="leading-0 relative mb-2">
                            <div
                              className="absolute top-0 right-0 z-40 translate-x-1/2 -translate-y-1/2 w-6 h-6 select-none bg-white rounded-full shadow-box flex justify-center items-center cursor-pointer hover:text-state-error"
                              role="button"
                              onClick={() => handleRemoveSelectedFiles(index)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-4 h-4 "
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
                            ></Image>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="relative">
                    <HookFormTextField
                      control={control}
                      name={idReply === e.id ? 'comment' : ''}
                      textSize="sm"
                      inputClassName={'max-h-10 !pr-9'}
                      placeholder="Your comment..."
                    ></HookFormTextField>
                    <div className="absolute top-[13px] right-3 cursor-pointer">
                      <SappIcon icon="camera"></SappIcon>
                      <input
                        type="file"
                        className="block absolute top-0 left-0 right-0 bottom-0 w-full h-full cursor-pointer opacity-0"
                        accept="image/png, image/gif, image/jpeg, image/png, image/svg+xml"
                        multiple
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </div>
                  </div>
                  <button type="submit" className="hidden"></button>
                </form>
              </div>
            </div>

            {/* {idReply === e.id && ( */}
          </div>
        )
      })}
      <div
        className={`mt-6 flex items-start gap-3 overflow-visible transition-max-height duration-300`}
      >
        <div className="flex-none leading-0">
          <Image
            width={40}
            height={40}
            className="rounded-full"
            src={
              user.detail.avatar['150x150'] ||
              user.detail.avatar['ORIGIN'] ||
              blankAvatar
            }
            loading="eager"
          ></Image>
        </div>
        <form
          onSubmit={handleSubmit((e) => onSubmit(e, true))}
          className="flex-1 relative"
          encType="multipart/form-data"
        >
          {rootSelectedFiles.length > 0 && (
            <div>
              <ul className="flex gap-4 flex-wrap">
                {rootSelectedFiles.map((file, index) => (
                  <li key={index} className="leading-0 relative mb-2">
                    <div
                      className="absolute top-0 right-0 z-40 translate-x-1/2 -translate-y-1/2 w-6 h-6 select-none bg-white rounded-full shadow-box flex justify-center items-center cursor-pointer hover:text-state-error"
                      role="button"
                      onClick={() => handleRemoveSelectedFiles(index, true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4 "
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
                    ></Image>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="relative">
            <HookFormTextField
              control={control}
              name={'commentRoot'}
              textSize="sm"
              inputClassName={'max-h-10 !pr-9'}
              placeholder="Your comment..."
              className="h-fit"
            ></HookFormTextField>
            <button type="submit" className="hidden"></button>
            <div className="absolute top-[13px] right-3 cursor-pointer select-none">
              <SappIcon icon="camera"></SappIcon>
              <input
                type="file"
                className="block absolute top-0 left-0 right-0 bottom-0 w-full h-full cursor-pointer opacity-0"
                accept="image/jpeg, image/png, image/gif"
                multiple
                onChange={(e) => handleFileChange(e, true)}
                ref={rootFileInputRef}
              />
            </div>
          </div>
        </form>
      </div>
      <SappModalImage setSrc={setImageSrc} src={imageSrc}></SappModalImage>
    </div>
  )
}

export default Discussion
