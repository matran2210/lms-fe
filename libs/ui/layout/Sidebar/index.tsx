import { ExpandIcon } from "@lms/assets";
import { useAppSelector, useFeature } from "@lms/contexts";
import { trackGAEvent } from "@lms/utils";
import { Divider } from "antd";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";
import MenuItemsList from "../MenuItemsList";
import { ExaminationInfo, LearningResource } from "../../components";
type SidebarProps = {
  isOpened: boolean;
  className: string;
  toggleDrawer: () => void;
  setOpenResource: Dispatch<SetStateAction<boolean>>;
  openResource: boolean;
  openExaminationInfo: boolean;
  setOpenExaminationInfo: Dispatch<SetStateAction<boolean>>;
};

export default function Sidebar({
  isOpened,
  className,
  toggleDrawer,
  setOpenResource,
  openResource,
  openExaminationInfo,
  setOpenExaminationInfo,
}: SidebarProps) {
  const { pageLink, menuItems, menuItemsEvent, menuBottom, router } =
    useFeature();
  const guideStatus = useAppSelector((state) => state.userGuideReducer?.status);
  const guideStep = useAppSelector((state) => state.userGuideReducer?.step);
  /**
   * @description lấy state trong context
   */
  const closeSideBar = () => {
    toggleDrawer();
    document.body.classList.add("no-hover");
    setTimeout(() => {
      document.body.classList.remove("no-hover");
    }, 1000);
  };
  const isLevel1 =
    router.pathname === pageLink.COURSES ||
    router.pathname === pageLink.CALENDAR ||
    router.pathname === pageLink.ENTRANCE_TEST ||
    router.pathname === pageLink.EXAM_LIST;
  const isGuideActive = guideStatus && (guideStep === 2 || guideStep === 3);
  return (
    <div className="group relative">
      {/* Thẻ div để hiển thị đúng vị trí modal guide */}
      {guideStatus && guideStep === 2 && (
        <div
          data-guide-id="sidebar"
          className="pointer-events-none absolute left-0 top-4 h-fit w-[126px]"
        />
      )}

      <div
        className={clsx(
          className,
          isGuideActive ? "z-50" : "z-30",
          isOpened || (isGuideActive && "w-[220px]"),
          'peer m-4 rounded-xl before:absolute before:-left-4 before:z-50 before:block before:h-full before:w-5 before:bg-transparent before:content-[""]',
        )}
      >
        <div
          className={`max-h-[calc(100vh-145px)] relative rounded-xl pb-6 pt-[25px] ${
            guideStatus && guideStep === 2
              ? "z-50 bg-white"
              : "overflow-y-auto overflow-x-hidden"
          }`}
        >
          <div
            className="group-logos mx-auto px-5"
            onClick={() => closeSideBar()}
          >
            <div
              className="relative flex h-[50px] items-end justify-center text-center"
              onClick={() => trackGAEvent("Click Logo SAPP Menu")}
            >
              <ExpandIcon
                type="logo-default"
                className={clsx(
                  "transition-transform duration-300 ease-out lg:translate-x-[70%]",
                  // Active on hover
                  "lg:group-hover:left-0 lg:group-hover:translate-x-0",
                  // Active when guideStep is 2 or 3
                  (guideStep === 2 || guideStep === 3) &&
                    "lg:!left-0 lg:!translate-x-0",
                )}
              />
              <ExpandIcon type="logo-full" />
            </div>
          </div>
          {/* Divider */}
          <div className="mx-auto w-[calc(100%-70px)] min-w-[50px] text-center">
            <Divider className="my-6 bg-divider" />
          </div>
          <MenuItemsList
            options={
              Number(localStorage.getItem("countEvent")) <= 0
                ? menuItems
                : menuItems.concat(menuItemsEvent)
            }
            setOpenResource={setOpenResource}
            closeSideBar={closeSideBar}
            setOpenExaminationInfo={setOpenExaminationInfo}
          />
        </div>
        <div
          className={`absolute bottom-0 w-full rounded-xl bg-white pb-6
        ${guideStatus && guideStep === 3 ? "z-50" : ""}`}
        >
          {isLevel1 && (
            <div className="mx-auto w-[calc(100%-48px)] bg-divider text-center">
              <Divider className="mb-8 mt-0 bg-divider" />
            </div>
          )}
          <MenuItemsList
            options={menuBottom}
            setOpenResource={setOpenResource}
            closeSideBar={closeSideBar}
            setOpenExaminationInfo={setOpenExaminationInfo}
          />
        </div>
        {guideStatus && (guideStep === 2 || guideStep === 3) && (
          <div className="absolute inset-0 z-40 animate-fade-in-overlay rounded-xl bg-black opacity-[.55]" />
        )}
      </div>
      <div
        onClick={toggleDrawer}
        className={clsx(
          `sidebar-overlay ${
            isOpened
              ? "pointer-events-auto opacity-100 peer-hover:pointer-events-auto peer-hover:opacity-100 lg:pointer-events-none lg:opacity-0"
              : "pointer-events-none opacity-0 peer-hover:pointer-events-auto peer-hover:opacity-100"
          } fixed inset-0 z-20 cursor-pointer bg-[#00000080] transition-opacity`,
          {
            "!pointer-events-none !opacity-0":
              guideStatus && (guideStep === 2 || guideStep === 3),
          },
        )}
      />
      {/* Thẻ div để hiển thị đúng vị trí modal guide */}
      {guideStatus && guideStep === 3 && (
        <div
          data-guide-id="notification-profile"
          className="pointer-events-none absolute left-0 bottom-4 h-[438px] w-[126px]"
        />
      )}
      <LearningResource open={openResource} setOpenResource={setOpenResource} />
      <ExaminationInfo
        open={openExaminationInfo}
        setOpen={setOpenExaminationInfo}
      />
    </div>
  );
}
