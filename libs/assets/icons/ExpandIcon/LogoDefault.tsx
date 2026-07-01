"use client";

import { useFeature } from "@lms/contexts";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

const LogoDefault = ({ className }: { className?: string }) => {
  const { pageLink } = useFeature();

  return (
    <Link href={pageLink?.COURSES}>
      <Image
        src="/icon.png"
        alt="Logo"
        width={42}
        height={50}
        className={clsx(
          "logo-default h-[50px] w-[42px] shrink-0 cursor-pointer object-contain",
          className,
        )}
      />
    </Link>
  );
};

export default LogoDefault;
