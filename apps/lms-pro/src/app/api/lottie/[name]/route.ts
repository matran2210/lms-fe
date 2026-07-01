import { NextResponse } from "next/server";

const animationLoaders = {
  AddNote: () => import("@lms/assets/animations/AddNote.json"),
  Attendance: () => import("@lms/assets/animations/Attendance.json"),
  BlinkStart: () => import("@lms/assets/animations/BlinkStart.json"),
  Calculator: () => import("@lms/assets/animations/Calculator.json"),
  Calendar: () => import("@lms/assets/animations/Calendar.json"),
  CourseActivation: () => import("@lms/assets/animations/CourseActivation.json"),
  CourseContent: () => import("@lms/assets/animations/CourseContent.json"),
  Dashboard: () => import("@lms/assets/animations/Dashboard.json"),
  EntranceTest: () => import("@lms/assets/animations/EntranceTest.json"),
  EventTest: () => import("@lms/assets/animations/EventTest.json"),
  ExamInfo: () => import("@lms/assets/animations/ExamInfo.json"),
  ExamList: () => import("@lms/assets/animations/ExamList.json"),
  LoadingBtn: () => import("@lms/assets/animations/LoadingBtn.json"),
  MyCourse: () => import("@lms/assets/animations/MyCourse.json"),
  NoteList: () => import("@lms/assets/animations/NoteList.json"),
  Notification: () => import("@lms/assets/animations/Notification.json"),
  OpenBook: () => import("@lms/assets/animations/OpenBook.json"),
  Resource: () => import("@lms/assets/animations/Resource.json"),
  TestQuizList: () => import("@lms/assets/animations/TestQuizList.json"),
  WavingHand: () => import("@lms/assets/animations/WavingHand.json"),
} as const;

type AnimationName = keyof typeof animationLoaders;

const cacheHeaders = {
  "Cache-Control": "public, max-age=31536000, immutable",
};

export async function GET(
  _request: Request,
  { params }: { params: { name: string } },
) {
  const animationName = params.name as AnimationName;
  const loadAnimation = animationLoaders[animationName];

  if (!loadAnimation) {
    return NextResponse.json({ error: "Animation not found" }, { status: 404 });
  }

  const animationModule = await loadAnimation();
  return NextResponse.json(animationModule.default ?? animationModule, {
    headers: cacheHeaders,
  });
}
