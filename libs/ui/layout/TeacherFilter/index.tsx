import React, { ReactNode } from "react";
import SappFilterButton from "../../components/base/button/SAPPFIlterButton";

interface IProps {
  listFilter: ReactNode;
  onSubmit: () => void;
  onReset: () => void;
  loading?: boolean;
  layoutAction?: ReactNode;
  className?: string;
}

const TeacherLayoutFilter = ({
  listFilter,
  loading = false,
  onReset,
  onSubmit,
  layoutAction,
  className,
}: IProps) => {
  return (
    <div className={`bg-white ${className}`}>
      {listFilter}
      <div className="mt-4 flex justify-between">
        <div className="flex">
          <SappFilterButton
            titleReset="Reset"
            titleSubmit="Search"
            okClick={onSubmit}
            resetClick={onReset}
            disabled={loading}
            loading={loading}
          />
        </div>
        {layoutAction}
      </div>
    </div>
  );
};

export default TeacherLayoutFilter;
