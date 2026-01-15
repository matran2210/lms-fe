import { CloseModalIcon } from "@lms/assets";
import { useFeature } from "@lms/contexts";
import { ActivityInfo, LAYOUT } from "@lms/core";
import { FullScreenLayout, Layout } from "@lms/ui";
import { QuizResultComponent } from "@sapp-fe/quiz-result-package";
import { IQuestionResultResponse } from "@sapp-fe/quiz-result-package/dist/type";
import { useEffect, useState } from "react";

const QuizResults = ({ isTeacher = false }: { isTeacher?: boolean }) => {
  const { router, pageLink, courseApi, query, params } = useFeature();

  const [activityInfo, setActivitiInfo] = useState<ActivityInfo | null>(null);
  const { id } = params || query;
  const [loading, setLoading] = useState<boolean>(false);
  const [modalResult, setModalResult] = useState<{
    status?: boolean;
    questions?: any;
    id?: string;
  }>();
  const getTable = async ({
    id,
    page_index,
    page_size,
  }: {
    id?: string;
    page_index: number;
    page_size: number;
  }) => {
    setLoading(true);
    try {
      const response = await courseApi.getQuizAttemptsTable(
        id || modalResult?.id || "",
        {
          page_index,
          page_size,
        },
      );
      setActivitiInfo(response.data.activity_info);
      const newQuestionResponse: IQuestionResultResponse = {
        meta: response.data.metadata,
        data: (modalResult?.questions?.data || []).concat(
          response.data.answers?.map((e: any) => ({
            active: e.active,
            id: e.id,
            content: e.question.question_content,
            section: e.question.question_filter_id?.part?.name,
            type: e.question.qType,
            is_correct: e.is_correct,
            time_spent: e.time_spent,
            question: e.question as any,
          })) || [],
        ),
        attempt_info: response?.data?.attempt_info,
      };

      setModalResult((e) => ({
        id: id || e?.id,
        status: true,
        questions: newQuestionResponse,
      }));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      getTable({ id: id as string, page_index: 1, page_size: 10 });
    }
  }, [id]);

  return (
    <FullScreenLayout title="Quiz result" className="!bg-gray-100">
      <div>
        <div
          className="fixed right-8 top-5 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-gray-200 transition-colors hover:bg-gray-300"
          onClick={() => {
            if (activityInfo !== null) {
              if (query?.tabId) {
                router.push(
                  `${isTeacher ? pageLink.TEACHER_MY_COURSE : "/courses"}/${activityInfo?.class_id}/activity/${activityInfo?.activity_id}?tabId=${query?.tabId}`,
                );
              } else {
                router.push(
                  `/courses/my-course/${query?.courseId}/results`,
                );
              }
            }
          }}
        >
          <CloseModalIcon />
        </div>
        <Layout
          // size="md"
          fullWidth
          title="Quiz Result"
          showSidebar={false}
          className="bg-gray-100"
        >
          <div className="m-auto">
            {modalResult?.questions?.data?.length > 0 && (
              <QuizResultComponent
                questionResponse={modalResult?.questions || []}
                getTable={getTable}
                onShowDetail={(e) => {
                  router.push(
                    `${isTeacher ? pageLink.TEACHER_EXPLANATION : "/explanation"}/${e.id}?title=Quiz Result`,
                  );
                }}
                loading={loading}
                is_lms_v2
              />
            )}
          </div>
        </Layout>
      </div>
    </FullScreenLayout>
  );
};
export default QuizResults;
QuizResults.layout = LAYOUT.FULLSCREEN_LAYOUT;
