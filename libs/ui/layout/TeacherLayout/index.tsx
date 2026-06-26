import { Typography } from "antd";
import clsx from "clsx";
import Head from "next/head";
import { useCourseContext } from "@lms/contexts";
import { ITabs } from "@lms/core";
import TeacherMenu from "../MenuItemsList/TeacherMenu";
import { SappBreadCrumbs } from "../../components";
import { memo } from "react";

const { Title } = Typography;
type LayoutTeacherProps = {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: ITabs[];
  className?: string;
  isCourseDetail?: boolean;
  isActivity?: boolean;
  layoutClassname?: string
};

const LayoutTeacher: React.FC<LayoutTeacherProps> = ({
  children,
  title = "",
  breadcrumbs = [],
  className = "",
  isCourseDetail = false,
  isActivity = false,
  layoutClassname
}: LayoutTeacherProps) => {
  const { showPinnedTrial } = useCourseContext();

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex flex-nowrap">
        <TeacherMenu isCourseDetail={isCourseDetail} isActivity={isActivity} />
        <div
          className={clsx(
            "min-h-screen w-full bg-[#F2F4F7]",
            showPinnedTrial && "mt-[54px]",
          )}
        >
          <div className={clsx("px-56 py-6", layoutClassname)}>
            <SappBreadCrumbs breadcrumbs={breadcrumbs} />
            <Title level={3} className="mt-1 pb-2 text-gray-700">
              {title}
            </Title>
            <div
              className={clsx("rounded-xl", className || "bg-white px-8 py-6")}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(LayoutTeacher);
