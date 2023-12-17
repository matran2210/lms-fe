import blankAvatar from '@assets/images/blank_avatar.webp'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  courseActivityReducer,
  createDiscussion,
  getDiscussion,
  reactDiscussion,
} from 'src/redux/slice/Course/MyCourse/Activity/Activity'
import {
  ICreateDiscussionResReact,
  IDiscussion,
} from 'src/redux/types/Course/MyCourse/Activity/activity'
import DiscussionElement from './DiscussionElement'
import { userReducer } from 'src/redux/slice/User/User'
import SappIcon from 'src/common/SappIcon'
import SappModal from '@components/base/modal/SappModal'

type Props = {}

/**
 * Component chức năng đại diện cho phần discussion.
 * @param {Props} props - Props của component.
 */
const Discussion = (props: Props) => {
  const router = useRouter()
  const { control, handleSubmit, reset } = useForm<{
    comment: string
    commentRoot: string
  }>()
  const dispatch = useAppDispatch()
  const selector = useAppSelector(courseActivityReducer)
  const [idReply, setIdReply] = useState<string>()
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const { user } = useAppSelector(userReducer)
  const [stream, setStream] = useState<MediaStream | null>(null)

  /**
   * Xử lý sự thay đổi của ID phản hồi và đặt lại biểu mẫu.
   * @param {string} idReply - ID của phản hồi.
   */
  const handleChangeIdReply = (idReply: string) => {
    setIdReply(idReply)
    reset({ comment: '' })
  }

  /**
   * Gửi bình luận discussion và cập nhật luồng discussion.
   * @param {{ comment: string }} data - Dữ liệu bình luận cần gửi.
   */
  const onSubmit = async (
    { comment, commentRoot }: { comment: string; commentRoot: string },
    isRoot?: boolean,
  ) => {
    if (router.query.id) {
      let parent_id = idReply
      let content = comment
      if (isRoot) {
        parent_id = undefined
        content = commentRoot
      }
      try {
        await dispatch(
          createDiscussion({
            course_section_id: router.query.id as string,
            content: content?.trim(),
            parent_id,
          }),
        ).unwrap()

        if (isRoot) {
          reset({ commentRoot: '' })
        } else {
          reset({ comment: '' })
        }
        await dispatch(getDiscussion(router.query.id as string))
      } catch (error) {}
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
        await dispatch(getDiscussion(router.query.id as string))
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
   * Hàm mở camera và cập nhật state với video stream.
   */
  const openCamera = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      })
      setStream(cameraStream)
    } catch (error) {}
  }

  /**
   * Hàm đóng camera và cập nhật state với video stream.
   */
  const closeCamera = () => {
    if (stream) {
      // Stop the media stream tracks
      stream.getTracks().forEach((track) => {
        track.stop()
      })
      // Set the stream state to null
      setStream(null)
    }
  }

  return (
    <div className="p-6 bg-white">
      <div className="text-xl font-bold mb-4">Discussion</div>
      {selector.discussion?.map((e) => {
        return (
          <div className="mt-6" key={e.id}>
            <DiscussionElement
              onReact={onReact}
              discussion={e}
              idReply={idReply}
              handleChangeIdReply={handleChangeIdReply}
            />
            <div
              className={`${
                e.children?.[0] ? 'mt-6' : ''
              } ' relative ml-13 pl-5 overflow-hidden`}
            >
              {e.children?.[0] && (
                <div>
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[2px] -mt-1 bg-size-100-30"
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
                        />
                      </div>
                    )
                  })}
                </div>
              )}
              <div
                className={`flex items-center gap-3 overflow-hidden transition-max-height duration-300 ${
                  idReply === e.id ? `max-h-96 mt-6` : 'max-h-0'
                }`}
              >
                <div className="flex-none leading-0">
                  <Image
                    width={40}
                    height={40}
                    className="rounded-full"
                    src={
                      e?.avatar?.['50x50'] ||
                      e?.avatar?.['ORIGIN'] ||
                      blankAvatar
                    }
                    loading="eager"
                  ></Image>
                </div>
                <form
                  onSubmit={handleSubmit((e) => onSubmit(e))}
                  className="flex-1 relative"
                >
                  <HookFormTextField
                    control={control}
                    name={idReply === e.id ? 'comment' : ''}
                    textSize="sm"
                    inputClassName={'max-h-10'}
                    placeholder="Your comment..."
                  ></HookFormTextField>
                  <div
                    onClick={openCamera}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                  >
                    <SappIcon icon="camera"></SappIcon>
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
        className={`mt-6 flex items-center gap-3 overflow-hidden transition-max-height duration-300`}
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
        >
          <HookFormTextField
            control={control}
            name={'commentRoot'}
            textSize="sm"
            inputClassName={'max-h-10'}
            placeholder="Your comment..."
            className="h-fit"
          ></HookFormTextField>
          <button type="submit" className="hidden"></button>
          <div
            onClick={openCamera}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
          >
            <SappIcon icon="camera"></SappIcon>
          </div>
        </form>
      </div>
      <SappModal
        open={!!stream}
        confirmOnclose
        handleSubmit={closeCamera}
        handleCancel={closeCamera}
      >
        <video
          ref={(videoRef) => videoRef && (videoRef.srcObject = stream)}
          autoPlay
        />
      </SappModal>
    </div>
  )
}

export default Discussion
