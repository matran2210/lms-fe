import { Dispatch, SetStateAction } from "react";
import { INotificationAPI, MenuItem as MenuItemType } from "@lms/core";
import MenuItem from "../MenuItem";

type MenuItemsListProps = {
  options: MenuItemType[];
  setOpenResource?: Dispatch<SetStateAction<boolean>>;
  closeSideBar: () => void;
  setOpenExaminationInfo?: Dispatch<SetStateAction<boolean>>;
  pageLink: { [key: string]: string };
  notificationApi: INotificationAPI
};

export default function MenuItemsList({
  options,
  setOpenResource,
  closeSideBar,
  setOpenExaminationInfo,
  notificationApi,
  pageLink
}: MenuItemsListProps) {
  return (
    <div className="menu-items-list flex flex-col gap-4 px-3">
      {options.map((option, index) => (
        <MenuItem
          menuItem={option}
          key={option.id + index}
          setOpenResource={setOpenResource}
          closeSideBar={closeSideBar}
          setOpenExaminationInfo={setOpenExaminationInfo}
          notificationApi={notificationApi}
          pageLink={pageLink}
        />
      ))}
    </div>
  );
}
