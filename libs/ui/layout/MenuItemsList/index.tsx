import { Dispatch, SetStateAction } from "react";
import { MenuItem as MenuItemType } from "@lms/core";
import MenuItem from "../MenuItem";
import NotificationMenuItem from "../MenuItem/NotificationMenuItem";

type MenuItemsListProps = {
  options: MenuItemType[];
  setOpenResource?: Dispatch<SetStateAction<boolean>>;
  closeSideBar: () => void;
  setOpenExaminationInfo?: Dispatch<SetStateAction<boolean>>;
};

export default function MenuItemsList({
  options,
  setOpenResource,
  closeSideBar,
  setOpenExaminationInfo,
  
}: MenuItemsListProps) {

  return (
    <div className="menu-items-list flex flex-col short:gap-1 gap-4 px-3">
      {options?.map((option, index) =>
        !option.url ? (
          <NotificationMenuItem
            menuItem={option}
            key={option.id + index}
            setOpenResource={setOpenResource}
            closeSideBar={closeSideBar}
            setOpenExaminationInfo={setOpenExaminationInfo}
          />
        ) : (
          <MenuItem
            menuItem={option}
            key={option.id + index}
            setOpenResource={setOpenResource}
            closeSideBar={closeSideBar}
            setOpenExaminationInfo={setOpenExaminationInfo}
          />
        ),
      )}
    </div>
  );
}
