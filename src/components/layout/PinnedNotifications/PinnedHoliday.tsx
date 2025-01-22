import { CloseHoliday, SoundPrimary } from '@assets/icons'
import EditorReader from '@components/base/editor/EditorReader'
import { usePinnedNotifyContext } from '@contexts/PinnedNotifyContext'
import { Col, Row } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'
import { PageLink } from 'src/constants'
import Marquee from 'react-fast-marquee'
import clsx from 'clsx'

function PinnedHoliday({
  isTablet,
  isIpadPro,
  isMobile,
}: {
  isTablet: boolean
  isIpadPro: boolean
  isMobile: boolean
}) {
  const router = useRouter()
  const { openPinned, setOpenPinned, pinnedNotifications } =
    usePinnedNotifyContext()

  const handleClosePinned = () => {
    localStorage.setItem('openPinned', 'false')
    setOpenPinned(false)
  }

  const showPinNoti = pinnedNotifications?.data?.content?.length < 200

  const isEnablePinnedPages = [
    PageLink.COURSES,
    PageLink.USERPAGE,
    PageLink.COURSE_DETAIL,
    PageLink.COURSE_PART_DETAIL,
    PageLink.COURSE_ACTIVITY,
  ].includes(router.pathname)

  return (
    <React.Fragment>
      {isEnablePinnedPages &&
        openPinned &&
        pinnedNotifications?.data?.content && (
          <React.Fragment>
            <div
              className={`fixed z-50 h-12 w-full`}
              style={{
                backgroundImage: `url(${isTablet || isMobile ? 'pined_tablet.svg' : isIpadPro ? 'holiday_ipadpro.svg' : 'pined_desktop.svg'})`,
                backgroundPosition: 'center center', // Căn giữa cả theo chiều ngang và dọc
                backgroundSize: '100%', // Chiều cao 100%, chiều rộng tự động giữ đúng tỷ lệ
              }}
            >
              <Row className="flex h-12 flex-row">
                <Col xl={3} lg={3} md={1} xs={3}></Col>
                <Col xl={18} lg={18} md={20} xs={15}>
                  <div className="flex h-12 flex-row justify-items-center">
                    <div className="mx-auto flex flex-row">
                      <div className="flex content-center items-center text-center">
                        <SoundPrimary />
                      </div>
                      <div className="flex flex-row content-center items-center xs:w-[250px] md:w-[500px] xl:w-[1000px] 3.5xl:w-[1380px]">
                        <Marquee
                          gradient={false}
                          speed={showPinNoti ? 0 : 50}
                          pauseOnHover={true}
                          className={clsx({ 'leading-5': showPinNoti })}
                          delay={2}
                        >
                          <EditorReader
                            text_editor_content={
                              pinnedNotifications?.data?.content
                            }
                            pinned
                            className="me-60 ml-3"
                          />
                        </Marquee>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xl={3} md={3} lg={3} xs={6} className="h-full">
                  <div
                    onClick={handleClosePinned}
                    className="float-right flex h-full cursor-pointer content-center items-center rounded-full pr-9"
                  >
                    <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white">
                      <CloseHoliday />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </React.Fragment>
        )}
    </React.Fragment>
  )
}

export default PinnedHoliday
