import { Dispatch, SetStateAction } from "react";
import { ICourseInfo } from "@lms/core";
import LearningResults from "./LearningResults";
import TopicProgress from "./TopicProgress";
import OverProgress from "./OverProgress";

const ExamDashboard = ({
  setInfoCourse,
}: {
  setInfoCourse: Dispatch<SetStateAction<ICourseInfo>>;
}) => {
  return (
    <div className="mx-auto w-full grow flex-col gap-4 bg-gray-canvas xl:flex-row 3xl:gap-6">
      <div className="flex w-full flex-col gap-4 3xl:gap-6">
        <LearningResults />
      </div>
      <div className="mb-10 mt-6 gap-6 xl:mt-8 xl:flex xl:justify-between xl:gap-8">
        <div className="w-full xl:w-8/12">
          <TopicProgress setInfoCourse={setInfoCourse} />
        </div>
        <OverProgress />
      </div>
    </div>
  );
};

export default ExamDashboard;
