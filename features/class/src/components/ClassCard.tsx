import { CalendarIcon, GeoLocationIcon } from "@lms/assets";
import { IClassCard, ITabsTeacher, statusMap } from "@lms/core";
import { formatDateFromUTC } from "@lms/utils";
import { Typography } from "antd";
import ClassProgress from "./ClassProgress";
import { SappTabs, StatusTag } from "@lms/ui";

const { Title } = Typography;
interface IProps {
  dataDetail?: IClassCard | undefined;
  tabs?: ITabsTeacher[];
  setSelected: React.Dispatch<React.SetStateAction<number>>;
  selected: number;
}

const ClassCard = ({
  dataDetail,
  tabs = [],
  setSelected,
  selected,
}: IProps) => {
  const InfoCourse = () => (
    <div className="mb-5 flex justify-between">
      <div className="flex items-center text-sm text-[#6b7280]">
        <div className="mr-6">
          {dataDetail?.status && (
            <StatusTag status={dataDetail?.status as keyof typeof statusMap} />
          )}
        </div>
        {dataDetail?.facility?.address && (
          <>
            <GeoLocationIcon />
            <span className="ml-1 mr-6 text-sm font-medium text-zinc-400">
              {dataDetail?.facility?.address}
            </span>
          </>
        )}
        {dataDetail?.started_at && dataDetail?.finished_at && (
          <>
            <CalendarIcon />
            <span className="ml-1  text-sm font-medium text-zinc-400">
              {formatDateFromUTC(dataDetail?.started_at)}&nbsp;-&nbsp;
              {formatDateFromUTC(dataDetail?.finished_at)}
            </span>
          </>
        )}
      </div>
      <div>
        <ClassProgress title="Progress" percent={dataDetail?.progress} />
      </div>
    </div>
  );

  return (
    <div className="h-fit w-full rounded-xl bg-white">
      <div className="flex flex-col">
        <Title level={4} className="text-gray-700">
          {dataDetail?.course?.name}
        </Title>
        <InfoCourse />
        <SappTabs tabs={tabs} setSelected={setSelected} selected={selected} />
      </div>
    </div>
  );
};

export default ClassCard;
