
export interface IResponse<T> {
  success: boolean;
  data: T;
  error: IResponseError;
}

export interface IResponseError {
  code: string;
  message: string;
  others: any;
}

export interface IMeta {
  total_pages: number;
  total_records: number;
  page_index: number;
  page_size: number;
}

export interface IResponseMeta<T, K extends string> {
  success: boolean;
  data: {
    meta: IMeta;
  } & {
    [propertyName in K]: T[];
  };
  error: IResponseError;
}