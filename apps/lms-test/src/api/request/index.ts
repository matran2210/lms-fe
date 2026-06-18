import { fetcher } from "@services/requestV2";
import { IQueryParams, IRequestList, IResponse } from "@lms/core";

export class RequestAPI {
  static getRequests({
    page_index,
    page_size,
    otherParams,
  }: IQueryParams): Promise<IResponse<IRequestList>> {
    return fetcher("/request-schedules", {
      params: {
        page_index,
        page_size,
        ...otherParams,
      },
    });
  }

  static deleteRequest(id: string): Promise<IResponse<null>> {
    return fetcher(`/request-schedules/${id}`, {
      method: "DELETE",
    });
  }
}
