import { fetcher } from "@services/requestV2";

export class TestAPI {
  static getResource(id: string) {
    return fetcher(`resource/${id}`);
  }
}
