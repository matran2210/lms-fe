import { TitleSidebar, ValueSidebar } from "@lms/core";

const apiURL = process.env.NEXT_PUBLIC_BASE_API_URL!;

export { apiURL };
export const linkCdnMktInApp = "https://cdn.sapp.edu.vn/images/fe";

export const listTab = [
  {
    title: TitleSidebar.HOME,
    value: ValueSidebar.HOME,
    src: `${linkCdnMktInApp}/bg_home_mkt-min.png`,
    height: 1080,
  },
  {
    title: TitleSidebar.DASHBOARD,
    value: ValueSidebar.DASHBOARD,
    src: `${linkCdnMktInApp}/bg_dashboard_mkt-min.png`,
    height: 5114,
  },
  {
    title: TitleSidebar.COURSES,
    value: ValueSidebar.COURSES,
    src: `${linkCdnMktInApp}/bg_my_course_mkt-min.png`,
    height: 6778,
  },
  {
    title: TitleSidebar.STUDENT_CALENDAR,
    value: ValueSidebar.STUDENT_CALENDAR,
    src: `${linkCdnMktInApp}/bg_calendar_mkt-min.png`,
    height: 5225,
  },
  {
    title: TitleSidebar.STUDENT_PROFILE,
    value: ValueSidebar.STUDENT_PROFILE,
    src: `${linkCdnMktInApp}/bg_student_profile_mkt-min.png`,
    height: 7268,
  },
  {
    title: TitleSidebar.LEARNING_ACTIVITY,
    value: ValueSidebar.LEARNING_ACTIVITY,
    src: `${linkCdnMktInApp}/bg_learning_activity_mkt-min.png`,
    height: 6156,
  },
  {
    title: TitleSidebar.TEST,
    value: ValueSidebar.TEST,
    src: `${linkCdnMktInApp}/bg_test_mkt-min.png`,
    height: 10470,
  },
  {
    title: TitleSidebar.DASHBOARD_TEST,
    value: ValueSidebar.DASHBOARD_TEST,
    src: `${linkCdnMktInApp}/bg_test_result_mkt-min.png`,
    height: 5837,
  },
  {
    title: TitleSidebar.EXAM_LIST,
    value: ValueSidebar.EXAM_LIST,
    src: `${linkCdnMktInApp}/bg_exam_list_mkt-min.png`,
    height: 4707,
  },
];
export const listStatusMyClass = [
  {
    label: "Chưa học",
    value: "NOT_STARTED",
  },
  {
    label: "Đang học",
    value: "IN_PROGRESS",
  },
  {
    label: "Đã học xong",
    value: "COMPLETED",
  },
];
