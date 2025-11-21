import { LogoSappIcon } from "@assets/icons";
import Link from "next/link";

const TeacherLogoFull = ({
  pageLink,
}: {
  pageLink: { [key: string]: string };
}) => {
  return (
    <Link href={pageLink.TEACHERS}>
      <LogoSappIcon />
    </Link>
  );
};

export default TeacherLogoFull;
