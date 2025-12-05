export interface IMetaData {
  total_pages: number;
  total_records: number;
  page_index: number;
  page_size: number;
}

export interface IResponse<T> {
  error: any;
  status: number;
  success: boolean;
  data: T;
}