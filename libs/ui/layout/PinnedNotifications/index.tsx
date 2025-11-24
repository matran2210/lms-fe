import { CloseIconNote, IconLoudSpeaker } from "@lms/assets";
import { usePinnedNotifyContext } from "@lms/contexts";
import { PageLink } from "@lms/core";
import { Col, Row } from "antd";
import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import Marquee from "react-fast-marquee";
import { EditorReader } from "../../components/base";

function PinnedNotifications() {
  const router = useRouter();
  const { openPinned, setOpenPinned, pinnedNotifications } =
    usePinnedNotifyContext();

  const handleClosePinned = () => {
    localStorage.setItem("openPinned", "false");
    setOpenPinned(false);
  };

  const showPinNoti = pinnedNotifications?.data?.content?.length < 200;

  const isEnablePinnedPages = [
    PageLink.COURSES,
    PageLink.USERPAGE,
    PageLink.COURSE_DETAIL,
    PageLink.COURSE_PART_DETAIL,
    PageLink.COURSE_ACTIVITY,
  ].includes(router.pathname);

  return (
    <React.Fragment>
      {isEnablePinnedPages &&
        openPinned &&
        pinnedNotifications?.data?.content && (
          <React.Fragment>
            <div
              className={`sticky top-0 z-50 h-[60px] w-full bg-secondary-600 text-xs font-medium text-white md:text-base`}
            >
              <Row className="flex h-[60px] flex-row">
                <Col span={1}></Col>
                <Col span={22}>
                  <div className="flex h-[60px] flex-row justify-items-center">
                    <div className="mx-auto flex flex-row">
                      <div className="flex content-center items-center text-center">
                        <IconLoudSpeaker />
                      </div>
                      <div className="flex w-[225px] flex-row content-center items-center lg:w-full">
                        <Marquee
                          gradient={false}
                          speed={showPinNoti ? 0 : 50}
                          pauseOnHover={true}
                          className={clsx({ "leading-5": showPinNoti })}
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
                <Col span={1}>
                  <div
                    onClick={handleClosePinned}
                    className="float-right flex h-full cursor-pointer content-center items-center pr-6"
                  >
                    <CloseIconNote color="#FFFFFF" />
                  </div>
                </Col>
              </Row>
            </div>
          </React.Fragment>
        )}
    </React.Fragment>
  );
}

export default PinnedNotifications;
