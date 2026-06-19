import { fetcher } from "@services/requestV2";
import { IQuestion, IResponse } from "@lms/core";

type QuestionDetailQueryDTO = {
  after_test: boolean;
};

const baseURL = "question";

export class QuestionAPI {}
