"use client";

import { useFeature } from "@lms/contexts";
import Image from "next/image";
import Link from "next/link";

const TeacherLogoFull = () => {
  const { pageLink } = useFeature();

  return (
    <Link href={pageLink.MY_CALENDAR}>
      <Image
        src="/icon.png"
        alt="Logo"
        width={40}
        height={40}
        className="h-10 w-10 cursor-pointer object-contain"
      />
    </Link>
  );
};

export default TeacherLogoFull;
