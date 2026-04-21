import React from "react";
import { ANIMATION } from "@lms/core";
import { NoCoursesAvailableIcon } from "@lms/assets";

const NoCoursesAvailable = ({ title = "No Data Found :(" }) => {
  return (
    <div
      data-aos={ANIMATION.DATA_AOS}
      className="flex flex-col items-center justify-center"
    >
      <NoCoursesAvailableIcon />
      <div className="text-center text-base font-normal leading-6 text-gray">
        {title}
      </div>
    </div>
  );
};

export default NoCoursesAvailable;
