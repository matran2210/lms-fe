// ConfirmDialog.tsx
import { Icon } from '@lms/assets';
import { SappBaseTable, SappModal } from "@lms/ui";
import { trackGAEvent } from "@lms/utils";
import { Dispatch, FC, SetStateAction } from "react";
import ResultTableRows from "./ResultTableRows";
import { Icon } from '@lms/assets'
import { trackGAEvent } from "@lms/utils";
import { SappBaseTable } from '@lms/ui/components/base';

// define the props for the confirm dialog component
export type ResultRowsModalProps = {
  open: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

// define headers
const headers = [
  {
    label: "Question",
    className:
      "text-left pb-3 text-sm text-[#A1A1A1] font-semibold w-[6%] min-w-[62px]",
  },
  {
    label: "Type",
    className:
      "text-left pb-3 text-sm text-[#A1A1A1] font-semibold pl-11 w-[72px] min-w-[165px]",
  },
  {
    label: "Part",
    className:
      "text-left pb-3 text-sm text-[#A1A1A1] font-semibold w-[36%] min-w-[400px]",
  },
  {
    label: "Chapter",
    className:
      "text-left pb-3 text-sm text-[#A1A1A1] font-semibold w-[17%] min-w-[190px]",
  },
  {
    label: "Result",
    className:
      "text-left pb-3 text-sm text-[#A1A1A1] font-semibold min-w-[132px]",
  },
  {
    label: "Time Spent",
    className:
      "text-left pb-3 text-sm text-[#A1A1A1] font-semibold w-[7%] min-w-[78px]",
  },
];

// Config ListResults
const listResults = [
  {
    type: "Matching",
    partName: "Audit framework and regulation",
    chapter: "Time value",
    correctStatus: true,
    status: "Correct",
    statusPercentage: 29,
    statusIcon: "global",
    time: 94,
  },
  {
    type: "Multiple Choice",
    partName: "Planning and risk management",
    chapter: "Index value",
    correctStatus: false,
    status: "Incorrect",
    statusPercentage: 14,
    statusIcon: "global",
    time: 94,
  },
  {
    type: "True/False",
    partName: "Audit framework and regulation",
    chapter: "Time value",
    correctStatus: true,
    status: "Correct ",
    statusPercentage: 29,
    statusIcon: "global",
    time: 94,
  },
  {
    type: "Matching",
    partName: "Audit framework and regulation",
    chapter: "Time value",
    correctStatus: true,
    status: "Correct ",
    statusPercentage: 29,
    statusIcon: "global",
    time: 94,
  },
  {
    type: "One Choice",
    partName: "Audit framework and regulation",
    chapter: "Time value",
    correctStatus: false,
    status: "Incorrect",
    statusPercentage: 14,
    statusIcon: "global",
    time: 94,
  },
  {
    type: "Fill Up",
    partName: "Audit framework and regulation",
    chapter: "Time value",
    correctStatus: true,
    status: "Correct ",
    statusPercentage: 29,
    statusIcon: "global",
    time: 94,
  },
  {
    type: "Drag Drop",
    partName: "Audit framework and regulation",
    chapter: "Time value",
    correctStatus: true,
    status: "Correct ",
    statusPercentage: 29,
    statusIcon: "global",
    time: 94,
  },
  {
    type: "One Choice",
    partName: "Audit framework and regulation",
    chapter: "Time value",
    correctStatus: false,
    status: "Incorrect",
    statusPercentage: 14,
    statusIcon: "global",
    time: 94,
  },
  {
    type: "Multiple Choice",
    partName: "Audit framework and regulation",
    chapter: "Time value",
    correctStatus: true,
    status: "Correct ",
    statusPercentage: 29,
    statusIcon: "global",
    time: 94,
  },
  {
    type: "Fill Up",
    partName: "Audit framework and regulation",
    chapter: "Time value",
    correctStatus: true,
    status: "Correct ",
    statusPercentage: 29,
    statusIcon: "global",
    time: 94,
  },
  {
    type: "One Choice",
    partName: "Audit framework and regulation",
    chapter: "Time value",
    correctStatus: true,
    status: "Incorrect",
    statusPercentage: 14,
    statusIcon: "global",
    time: 94,
  },
  {
    type: "One Choice",
    partName: "Audit framework and regulation",
    chapter: "Time value",
    correctStatus: true,
    status: "Incorrect",
    statusPercentage: 14,
    statusIcon: "global",
    time: 94,
  },
  {
    type: "Constructed",
    partName: "Audit framework and regulation",
    chapter: "Time value",
    correctStatus: true,
    status: "Submitted",
    statusPercentage: 0,
    statusIcon: "global",
    time: 94,
  },
  {
    type: "Constructed",
    partName: "Audit framework and regulation",
    chapter: "Time value",
    correctStatus: true,
    status: "Submitted",
    statusPercentage: 0,
    statusIcon: "global",
    time: 0,
  },
  {
    type: "Constructed",
    partName: "Audit framework and regulation",
    chapter: "Time value",
    correctStatus: false,
    status: "Unfinished",
    statusPercentage: 0,
    statusIcon: "global",
    time: 94,
  },
];

// create the confirm dialog component
const ResultRowsModal: FC<ResultRowsModalProps> = ({ open, setOpen }) => {
  const handleOnClick = () => {
    setOpen?.(false);
  };

  return (
    <SappModal
      open={open}
      setOpen={setOpen}
      size="max-w-full w-full"
      refClass="max-h-100vh animate-jump-in relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all"
      childClass=""
      parentChildClass="max-w-[1144px] mx-auto px-6 2xl:px-0"
      footerButtonClassName="justify-center flex flex-row-reverse"
      color="danger"
      showHeader={false}
      showFooter={false}
    >
      <h2 className="py-6 text-xl font-bold text-[#050505]">
        Your Score Details
      </h2>
      <div
        className="absolute right-4 top-2.5 cursor-pointer p-2"
        onClick={() => {
          handleOnClick();
          trackGAEvent("Click Icon Close Your Score Details");
        }}
      >
        <Icon type="cross" />
      </div>
      <SappBaseTable
        headers={headers}
        loading={false}
        isCheckedAll={false}
        hasCheck={false}
        hasCheckAll={false}
        theadClass=""
        tbodyClass=""
        classTableRes="max-h-[calc(100vh-73px)]"
        onChange={() => { }}
      >
        <ResultTableRows resultTablerows={listResults} />
      </SappBaseTable>
    </SappModal>
  );
};

export default ResultRowsModal;
