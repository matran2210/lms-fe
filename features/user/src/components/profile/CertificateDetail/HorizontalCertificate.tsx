import React from "react";
import { Button, Typography } from "antd";
import CertificateCard from "./CertificateCard";
import Image from "next/image";
import { Icon } from "@lms/assets";
import { ICertificate } from "@pages/certificates/[id]";
import { ClickToCopyButton } from "@lms/ui";
// import CertificateImg from "@components/layout/ExpandIcon/CertificateImg"; comment monorepo
import SAPP_Logo from "@assets/images/sapp_logo.svg";
import { ButtonPrimary } from "@lms/ui";

interface HorizontalCertificateProps {
  certificate?: ICertificate;
  issuedBy?: string;
  onDownload?: () => void;
}

const HorizontalCertificate: React.FC<HorizontalCertificateProps> = ({
  certificate,
  issuedBy = "SAPP Academy",
  onDownload,
}) => {
  return (
    <CertificateCard
      bodyClassName="flex h-screen justify-center container mx-auto"
      className="lg:hidden"
    >
      <div className="flex max-w-[90%] flex-col items-center py-[84px] md:gap-10 md:py-[56px]">
        <div
          className="mb-10 flex w-full flex-shrink-0 cursor-pointer items-end md:mb-0"
          onClick={() => window.open("https://sapp.edu.vn", "_blank")}
        >
          <div className="mx-auto my-auto block w-1/2 overflow-hidden sm:max-w-[14rem]">
            <Image
              src={SAPP_Logo}
              alt="SAPP Logo"
              priority={true}
              layout="responsive"
            />
          </div>
        </div>

        <div className="mb-6 flex w-full items-center justify-center overflow-hidden md:mb-0 md:flex-1">
          {certificate?.certificate_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={certificate?.certificate_url || ""}
              alt={certificate?.course.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            // <CertificateImg
            //   size={400}
            //   className=" max-w-full border-none text-[#A1A1A1] group-hover:text-primary"
            // />
            <></>
          )}
        </div>

        <div className="flex h-[200px] flex-shrink-0 flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-6 md:gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="text-2xl font-bold text-primary md:text-5xl">
                Congratulation!
              </div>
              <div className="text-center text-sm md:text-base">
                Congratulations, you have achieved the{" "}
                <span className="font-bold">{certificate?.course.name}</span>{" "}
                issued by {issuedBy}!
              </div>
            </div>
            <div className="flex w-full items-stretch justify-center gap-4">
              <ButtonPrimary
                size="medium"
                icon={<Icon type="download" />}
                iconPosition="end"
                onClick={onDownload}
                className="px-[37.5px] py-2 sm:!px-[29px]"
              >
                Download
              </ButtonPrimary>
              <ClickToCopyButton
                className="h-auto"
                link={`${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${certificate?.id}`}
              >
                <Button
                  icon={<Icon type="share" />}
                  type="text"
                  className="h-full px-0 underline"
                >
                  Share Certificate
                </Button>
              </ClickToCopyButton>
            </div>
          </div>
        </div>
      </div>
    </CertificateCard>
  );
};

export default HorizontalCertificate;
