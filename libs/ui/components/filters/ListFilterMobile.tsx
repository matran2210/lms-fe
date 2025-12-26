"use client";
import { CollapseArrowIcon } from "@lms/assets";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useCourseSectionsData } from "@lms/hooks";
import { getTypeName, ISection, SectionField } from "@lms/core";
import { useFeature } from "@lms/contexts";

interface IList {
  id: number;
  name: string;
  isDisabled: boolean;
  type: SectionField;
}

const ListFilterMobile = ({
  setOpenChooseItem,
  listSection,
  listSubsection,
  listUnit,
  listActivity,
  setListSection,
  setListSubsection,
  setListUnit,
  setListActivity,
}: {
  setOpenChooseItem: Dispatch<SetStateAction<any>>;
  listSection: ISection[];
  listSubsection: ISection[];
  listUnit?: ISection[];
  listActivity: ISection[];
  setListSection: Dispatch<SetStateAction<ISection[]>>;
  setListSubsection: Dispatch<SetStateAction<ISection[]>>;
  setListUnit?: Dispatch<SetStateAction<ISection[]>>;
  setListActivity: Dispatch<SetStateAction<ISection[]>>;
}) => {
  const { courseApi } = useFeature();

  const { watch } = useFormContext();
  const [list, setList] = useState<IList[]>([]);
  const { selected } = useCourseSectionsData({
    listSection,
    listSubsection,
    listUnit,
    listActivity,
    setListSection,
    setListSubsection,
    setListUnit,
    setListActivity,
    api: courseApi,
  });
  const sectionNameSection = listSection?.find(
    (item) => item?.id === selected.section,
  )?.name;
  const sectionNameSubsection = listSubsection?.find(
    (item) => item?.id === selected.subsection,
  )?.name;
  const sectionNameUnit = listUnit?.find(
    (item) => item?.id === selected.unit,
  )?.name;
  const sectionNameActivity = listActivity?.find(
    (item) => item?.id === selected.activity,
  )?.name;

  const handleClick = (item: IList) => {
    if (item.isDisabled) return;
    const name = getTypeName[item.type];
    setOpenChooseItem({
      isOpen: true,
      type: item.type as SectionField,
      name,
    });
  };

  useEffect(() => {
    setList([
      {
        id: 1,
        name: sectionNameSection || "Section",
        isDisabled: false,
        type: "section",
      },
      {
        id: 2,
        name: sectionNameSubsection || "Subsection",
        isDisabled: !watch("section"),
        type: "subsection",
      },
      {
        id: 3,
        name: sectionNameUnit || "Unit",
        isDisabled: !watch("subsection"),
        type: "unit",
      },
      {
        id: 4,
        name: sectionNameActivity || "Activity",
        isDisabled: !watch("unit"),
        type: "activity",
      },
    ]);
  }, [
    sectionNameSection,
    sectionNameSubsection,
    sectionNameUnit,
    sectionNameActivity,
  ]);

  return (
    <div className="flex flex-1 flex-col">
      {list.map((item) => (
        <div
          key={item.id}
          className={clsx(
            "flex items-center justify-between py-2",
            item.isDisabled ? "text-gray-400" : "text-gray-800",
          )}
          onClick={() => handleClick(item)}
        >
          <div className="text-sm font-normal">{item.name}</div>
          <div>
            <CollapseArrowIcon className="rotate-[270deg]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListFilterMobile;
