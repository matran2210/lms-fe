import Link from "next/link";
import { useRouter } from "next/router";
import { PageLink } from "@lms/core";
import { Tooltip } from "../../common";

type IProps = {
  id: string;
  name: string;
  type: string;
};

const SappBreadcrumbNotLink = ({
  paths,
  isTeacher = false,
}: {
  paths: IProps[];
  isTeacher?: boolean;
}) => {
  const router = useRouter();
  const getCourseId = router?.query?.courseId ?? router.query.id;
  const displayPaths = paths.filter((p) => p.type !== "ACTIVITY");

  return (
    <>
      {displayPaths.map((path, index) => {
        let url = "";
        switch (path.type) {
          case "PART":
            url = `${
              isTeacher ? PageLink.TEACHER_MY_COURSE : PageLink.COURSES
            }/${getCourseId}/section/${path?.id}`;
            break;
          case "CHAPTER":
            url = `${
              isTeacher ? PageLink.TEACHER_MY_COURSE : PageLink.COURSES
            }/${getCourseId}/section/${paths?.[0]?.id}?unit_id=${path?.id}`;
            break;
          case "UNIT":
            url = `${
              isTeacher ? PageLink.TEACHER_MY_COURSE : PageLink.COURSES
            }/${getCourseId}/section/${paths?.[0]?.id}?unit_id=${paths?.[1].id}`;
            break;
        }
        return (
          <span
            key={path?.id}
            className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap"
          >
            <Link href={url} className="breadcrumbs__link" scroll={false}>
              <span className="inline-block w-full max-w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-sm font-normal text-[#A1A1A1]">
                <Tooltip title={path?.name}>{path?.name}</Tooltip>
              </span>
            </Link>
            {index < displayPaths.length - 1 && (
              <span className="inline-block overflow-hidden px-1 text-sm font-normal text-[#A1A1A1]">
                {" "}
                /{" "}
              </span>
            )}
          </span>
        );
      })}
    </>
  );
};

export default SappBreadcrumbNotLink;
