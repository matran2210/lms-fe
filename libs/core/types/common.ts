import { ButtonProps } from "antd";
import { FixedType } from "rc-table/lib/interface";
import { FieldValues } from "react-hook-form";
import { IMetaData } from "./api-response";
import { ReactNode } from "react";

export interface ITabs {
  link: string;
  title: string;
}

export interface IBreadcrumb {
  title: string;
  link: string;
}

export type Placement =
  | "topLeft"
  | "topCenter"
  | "topRight"
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight"
  | "top"
  | "bottom";

export interface OtherColumn {
  index: string | number;
  method: React.ReactNode;
}

export interface TableColumn<T, O = OtherColumn> {
  title: React.ReactNode;
  dataIndex?: keyof T | keyof O;
  key?: string | number;
  width?: number | string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  fixed?: FixedType;
}

export interface IQueryParams {
  page_index: number;
  page_size: number;
  otherParams?: Record<string, any>;
}

export interface IBaseFormFieldProps<T extends FieldValues = any> {
  name: string;
  control: any;
  className?: string;
  label?: string;
  labelClass?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: any;
  skeleton?: boolean;
  // More common props can be added here
}

export interface IResponseData {
  id: string | number;
  name: string;
}

export type QueryKey = "sections";

export type SearchField = keyof IResponseData | "search";

export interface IResponseDataWithMetadata extends Record<
  QueryKey,
  IResponseData[]
> {
  metadata: IMetaData;
}

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export const NumberToDayOfWeekMap: Record<number, DayOfWeek> = {
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
  7: "SUNDAY",
};

export interface IButtonBaseProps extends Omit<ButtonProps, "size"> {
  size?: "small" | "medium" | "large" | "extra";
  link?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  full?: boolean;
  title?: string;
  children?: React.ReactNode;
  isUnderLine?: boolean;
}
export interface ISubjectItem {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  course_category_id?: string;
  name: string;
  code: string;
}
export type IButtonSize = "small" | "medium" | "large" | "extra";

export type IButtonCancelSubmitProps = {
  submit: IButtonBaseProps;
  cancel: IButtonBaseProps;
  className?: string;
  showOkButton?: boolean;
  showCancelButton?: boolean;
  size?: IButtonSize;
  revertFunction?: boolean;
};

export interface UserHubspotExaminationSubjectItem {
  id: string;
  examination_subject_id: string;
  result: string;
  examination_subject: {
    id: string;
    subject_id: string;
    examination_id: string;
    subject: ISubjectItem;
    examination: {
      id: string;
      name: string;
    };
  };
  is_final_examination_subject: boolean;
}

export interface ApiError {
  response?: {
    data?: {
      error?: {
        code?: string;
        replacements: {
          FLEXIBLE_DAYS: number;
          CLASS_ID: string;
          COURSE_TYPE: string;
        };
      };
    };
  };
}

export interface AppModule {
  name: string;
  routes: {
    path: string;
    element: React.ReactNode;
  }[];
}
export interface InfoItemProps {
  label: string;
  value: ReactNode;
}
