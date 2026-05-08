import {
  IContentCompleted,
  ICourseSections,
  IScheduleRequestItem,
  PROGRAM,
} from "@lms/core";
import dayjs from "dayjs";

export const sortSectionsByPosition = (data: IContentCompleted[]) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  data.forEach((schedule) => {
    schedule.course_sections.forEach((section) => {
      sortChildrenRecursive(section);
    });
  });

  return data;
};

export const sortChildrenRecursive = (section: ICourseSections) => {
  if (section.children && section.children.length > 0) {
    section.children.sort((a, b) => a.position - b.position);

    section.children.forEach((child) => sortChildrenRecursive(child));
  }
};

export function groupACCABySubjectAndClass(
  items: IScheduleRequestItem[],
): IScheduleRequestItem[] {
  const groupedPrograms = [PROGRAM.ACCA, PROGRAM.CD];
  const groupedItems = items.filter((item) =>
    groupedPrograms.includes(item.subject?.course_category?.name as PROGRAM),
  );
  const nonGroupedItems = items.filter(
    (item) =>
      !groupedPrograms.includes(item.subject?.course_category?.name as PROGRAM),
  );

  const map = new Map<string, IScheduleRequestItem>();

  groupedItems.forEach((item) => {
    if (!groupedPrograms.includes(item.subject?.course_category?.name as PROGRAM))
      return;

    const key = `${item.subject.id}_${item.class.id}}_${item.status}`;

    const start = dayjs(item.schedule_time.start_date);
    const end = dayjs(item.schedule_time.end_date);

    if (!map.has(key)) {
      map.set(key, {
        ...item,
        request_ids: [item.id],
      });
    } else {
      const existing = map.get(key)!;

      const existingStart = dayjs(existing.schedule_time.start_date);
      const existingEnd = dayjs(existing.schedule_time.end_date);

      // lấy start nhỏ nhất
      if (start.isBefore(existingStart)) {
        existing.schedule_time.start_date = item.schedule_time.start_date;
      }

      // lấy end lớn nhất
      if (end.isAfter(existingEnd)) {
        existing.schedule_time.end_date = item.schedule_time.end_date;
      }

      existing.request_ids?.push(item.id);
    }
  });

  return [...Array.from(map.values()), ...nonGroupedItems];
}
