import { LogoSappIcon } from "../index";
import Link from "next/link";
import { useFeature } from "@lms/contexts";
const TeacherLogoFull = () => {
  const { pageLink } = useFeature();

  return (
    <Link href={pageLink.MY_CALENDAR}>
      <LogoSappIcon />
    </Link>
  );
};

export default TeacherLogoFull;
