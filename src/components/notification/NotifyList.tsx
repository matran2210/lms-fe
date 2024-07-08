import React, { Dispatch, SetStateAction, useEffect } from 'react'
import Icon from '@components/icons'
import blankAvatar from '@assets/images/blank_avatar_notification.png'
import Image from 'next/image'
import { calculateTimeAgo } from '@utils/helpers'
import { ANIMATION } from 'src/constants'
import Aos from 'aos'
import { isEmpty } from 'lodash'
import NoData from 'src/common/NoData'

interface IProps {
  notifyLists: any[]
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  getApiNotificationDetail: (
    id: string,
    redirect: string | null,
    content: string,
  ) => void
}

const NotifyList = ({
  notifyLists,
  open,
  setOpen,
  getApiNotificationDetail,
}: IProps) => {
  const handleOpen = async (
    id: string,
    redirect: string | null,
    content: string,
    tag: string | null,
  ) => {
    await getApiNotificationDetail(id, redirect, content)
    const regexTagA = /<a\b[^>]*>(.*?)<\/a>/
    const containsAnchorTag = regexTagA.test(content)
    if (containsAnchorTag && tag === 'STRONG') {
      setOpen(false)
    } else if (redirect === null) {
      setOpen(!open)
    }
  }

  useEffect(() => {
    Aos.init({ duration: ANIMATION.DURATION, once: true, offset: 0 })
  }, [open])

  return (
    <div data-aos={ANIMATION.DATA_AOS}>
      {!isEmpty(notifyLists) ? (
        notifyLists?.map((notifyItem, index) => {
          const readStatus = notifyItem?.notification_user_instances?.is_read
          return (
            <div
              key={notifyItem?.id + index}
              className={`w-full p-6 pb-5 cursor-pointer relative flex items-center gap-4 ${
                readStatus ? 'bg-white' : 'bg-secondary'
              }`}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                handleOpen(
                  notifyItem?.id,
                  notifyItem?.created_by ?? null,
                  notifyItem?.content,
                  (e?.target as HTMLElement)?.tagName,
                )
              }}
              data-aos={ANIMATION.DATA_AOS}
            >
              {!readStatus && (
                <Icon
                  type="ellip"
                  className="text-primary absolute left-2 top-1/2"
                />
              )}
              <div className="shrink-0">
                <>{/*Fix image load slow*/}</>
                {notifyItem?.avatar?.ORIGIN ? (
                  <img
                    src={
                      notifyItem?.avatar['50x50'] || notifyItem?.avatar?.ORIGIN
                    }
                    alt="avatar"
                    className="rounded-full w-14 h-14 object-cover bg-gray-3"
                    width={56}
                    height={56}
                  />
                ) : (
                  <Image
                    src={blankAvatar}
                    alt="avatar"
                    className={`rounded-full`}
                    width={56}
                    height={56}
                    layout="fixed"
                    objectFit={'cover'}
                    priority={true}
                  />
                )}
              </div>
              <div className="block">
                <h4
                  className="text-base text-bw-1 mb-1 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: notifyItem?.created_by
                      ? notifyItem?.title
                      : notifyItem?.content,
                  }}
                ></h4>
                <p className="text-gray-1 text-medium-sm text-left">
                  {calculateTimeAgo(notifyItem?.updated_at)}
                </p>
              </div>
            </div>
          )
        })
      ) : (
        <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
          <NoData />
        </div>
      )}
    </div>
  )
}

export default NotifyList
