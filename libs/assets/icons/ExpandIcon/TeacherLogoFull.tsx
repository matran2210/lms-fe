import Link from "next/link";
import { useFeature } from "@lms/contexts";
import { LogoSappIcon } from "../icons";
const TeacherLogoFull = () => {
  const { pageLink } = useFeature();

  return (
    <Link href={pageLink.TEACHERS}>
      <LogoSappIcon />
    </Link>
  );
};

export default TeacherLogoFull;
