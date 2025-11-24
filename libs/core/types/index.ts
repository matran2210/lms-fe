import { Dayjs } from "dayjs";
import { Control } from "react-hook-form";
import { IButtonBaseProps } from "./common";

export type SAPPEditorHandle = {
  moveSelectionOutOfTable: () => void;
  resetContentSafe: (newContent: string) => void;
};
export type IButtonColors =
  | "primary"
  | "info"
  | "success"
  | "secondary"
  | "danger"
  | "warning"
  | "light"
  | "dark"
  | "white"
  | "outline"
  | "text"
  | "textUnderline"
  | "quizActivity"
  | "okPopup"
  | "cancelPopup"
  | "light-dark"
  | "gray";
export interface IButtonProps {
  title: string;
  onClick?: (e: any) => void;
  className?: string;
  link?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: IButtonSize;
  full?: boolean;
  name?: string;
  type?: "button" | "reset" | "submit";
  isPadding?: boolean;
  isPaddingHorizontal?: boolean;
  color?: IButtonColors;
  isUnderLine?: boolean;
  childClass?: string;
  classNameLoading?: string;
  showTooltip?: boolean;
  toolTipTitle?: string;
  icon?: React.ReactNode;
}
export type IButtonSize = "small" | "medium" | "large" | "extra";
export type IButtonVariant = "primary" | "secondary" | "custom";
export interface IButtonIconProps extends IButtonProps {
  variant?: IButtonVariant;
  icon?: "plus" | "search" | "arrow";
  position?: "start" | "end";
  iconColorProps?: string;
}
export interface ITabs {
  link: string;
  title: string;
  disable?: boolean;
}
export interface ITabsTeacher {
  id: number;
  title: string;
  urlTitle?: string;
}
export type IButtonCancelSubmitProps = {
  submit: IButtonBaseProps;
  cancel: IButtonBaseProps;
  className?: string;
  showOkButton?: boolean;
  showCancelButton?: boolean;
  size?: IButtonSize;
  revertFunction?: boolean;
};
declare global {
  interface Window {
    luckysheet: any;
  }
}

interface IPinned {
  action: string;
  content: string;
  created_at: string;
  created_by: string;
  created_from: string;
  deleted_at: string;
  id: string;
  mode: string;
  send_finish_time: string;
  send_time: string;
  status: string;
  title: string;
  type: string;
  updated_at: string;
}

export interface PinnedNotifications {
  data: IPinned;
}

export enum NOTIFICATION_STATUS {
  SENT = "SENT",
  CANCEL = "CANCEL",
  RETRIEVE = "RETRIEVE",
  TIMER = "TIMER",
  SHOWING = "SHOWING",
  ENDED = "ENDED",
}

export interface IMetaData {
  total_pages: number;
  total_records: number;
  page_index: number;
  page_size: number;
}
export interface ISVG {
  width?: number;
  height?: number;
  className?: string;
}
export enum EDateTime {
  dateFormat = "DD/MM/YYYY",
  weekFormat = "MM/DD",
  monthFormat = "MM/YYYY",
  fullDate = "DD/MM/YYYY HH:mm",
  backendFormat = "yyyy-MM-dd",
  timepicker = "HH:mm",
}
export interface IHookFormProps {
  name: string;
  control: Control<any>;
  className?: string;
  disabled?: boolean;
  skeleton?: boolean;
  style?: React.CSSProperties;
}

export interface IHookFormDateRangePicker extends IHookFormProps {
  defaultValue?: [Dayjs, Dayjs];
}

export interface OptionType {
  label: string;
  value: string | number;
}
export type SheetData = {
  name: string;
  id: string;
  status: number;
  data: (string | number | null)[][];
  celldata: {
    r: number;
    c: number;
    v: { v: string; ct: { fa: string; t: string }; m: string };
  }[];
  row?: number;
  column?: number;
};
export interface IPopupFormState {
  lockSection: boolean;
  ctaUpgrade: boolean;
  thankYou: boolean;
  thankYouLater: boolean;
}

export * from "./common";
export * from "./Icon";
export * from "./api-response";
export * from "./Profile";
export * from "./progress";
export * from "./request";
export * from "./answer";
export * from "./calendar";
export * from "./case-study";
export * from "./classes";
export * from "./course";
export * from "./courses";
export * from "./dashboard";
export * from "./entrance-test";
export * from "./event-test";
export * from "./exhibit";
export * from "./notification";
export * from "./quiz";
export * from "./results";
export * from "./test";
export * from "./user";
export * from "./v2";
export * from "./exam-infomation";
export * from "./services";
export * from "./file/index";
export * from "./menu/index";
export * from "./courses-3-level"
