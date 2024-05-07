import blankAvatar from '@assets/images/blank_avatar.webp'
import { calculateTimeAgo } from '@utils/helpers'
import Image from 'next/image'
import { SetStateAction, useEffect, useState } from 'react'
import {
  ICreateDiscussionResReact,
  IDiscussion,
} from 'src/redux/types/Course/MyCourse/Activity/activity'

type Props = {
  rank?: number
  discussion: IDiscussion
  idReply?: string
  handleChangeIdReply?: (idReply: string) => void
  onReact: (data: ICreateDiscussionResReact) => Promise<void>
  setImageSrc: (value: SetStateAction<string | undefined>) => void
}

function DiscussionElement({
  rank = 0,
  discussion,
  idReply,
  handleChangeIdReply,
  setImageSrc,
}: Props) {
  const [isLike, setIsLike] = useState<boolean>(discussion.is_like)
  const [timeAgo, setTimeAgo] = useState<string>('')

  useEffect(() => {
    setIsLike(discussion.is_like)
    setTimeAgo(() => calculateTimeAgo(discussion.created_at))
  }, [discussion])

  return (
    <div className="flex gap-3 text-bw-1">
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
        ></Image>
      </div>
      <div>
        <div className="text-base font-semibold mb-1">
          {discussion.full_name}
        </div>
        <div className="flex gap-3 flex-wrap">
          {discussion.course_discussion_files?.map((e) => {
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
                ></Image>
              </div>
            )
          })}
        </div>
        {discussion.content && (
          <div className={`text-base mb-2 `}>{discussion.content}</div>
        )}

        <div className="flex gap-y-1 gap-x-6 font-semibold text-medium-sm">
          {/* <div className="relative ">
            <input
              type="checkbox"
              className="peer absolute inset-0 w-full h-full cursor-pointer opacity-0"
              onChange={(e) => {
                setIsLike(e.target.checked)
                onReact({
                  is_like: e.target.checked,
                  course_discussion_id: discussion.id,
                })
              }}
              checked={isLike}
            />
            <div role="button" className="peer-checked:text-primary">
              Like
            </div>
          </div> */}
          {rank < 1 && (
            <div
              role="button"
              className={`${
                discussion.id === idReply ? 'text-primary' : ''
              } select-none`}
              onClick={() =>
                handleChangeIdReply && handleChangeIdReply(discussion.id)
              }
            >
              Reply
            </div>
          )}
          <div className="font-normal text-gray-1">{timeAgo}</div>
        </div>
      </div>
    </div>
  )
}

export default DiscussionElement
