"use client"
import { CertificateImg, CopyIcon, Icon, LoadingButtonAnimation, SappLogoImage } from "@lms/assets";
import { ButtonPrimary, ClickToCopyButton } from "@lms/ui";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { LinkedInShareButton } from "./ButtonShareLinkedin";
import CertificateCard from "./CertificateCard";
import ModalShareToLinkedin from "./ModalShareToLinkedin";
import { ICertificate } from "@lms/core";
import { Divider } from "antd";
import { ImageRenderFromHtml } from "@lms/ui";
import { useDownloadImage } from "@lms/hooks";
import clsx from "clsx";

interface CertificateVerticalProps {
  certificate?: ICertificate;
  issuedBy?: string;
}

const CertificateVertical: React.FC<CertificateVerticalProps> = ({
  certificate,
  issuedBy = "SAPP Academy",
}) => {
  const [openModalShare, setOpenModalShare] = useState(false);
  const onOpenModalShare = () => setOpenModalShare(true);
  const onCloseModalShare = () => setOpenModalShare(false);
  const { downloadCertificate } = useDownloadImage();
  const [loading, setLoading] = useState(false);
  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await downloadCertificate(
        document.getElementById(`vertical-${certificate?.id}`) as HTMLElement, 
        certificate?.certificate?.html_template as string, 
        certificate?.user.detail.full_name || '', 
        certificate?.certificate?.name || ''
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const certificateView = useMemo(() => {
    return certificate?.certificate?.html_template ? (
      <ImageRenderFromHtml
        id={`vertical-${certificate?.id}`}
        html={certificate.certificate.html_template}
        previewWidth={500}
        previewHeight={700}
        name={certificate.user.detail.full_name}
      />
    ) : (
      <CertificateImg
        size={800}
        className="max-w-[500px] border-none text-[#A1A1A1] group-hover:text-primary"
      />
    );
  }, []);

  return (
    <CertificateCard
      bodyClassName="2xl:px-[373px] py-[138px] px-[70px] justify-center"
      className=" hidden lg:block"
    >
      <div className="flex w-full h-full items-center gap-12 xl:gap-20">
        <div id="certificate-container-andrew" className="flex h-full w-[55%] items-center justify-center">
          {certificateView}
        </div>
        <div className="flex flex-col items-center gap-12">
          <div
            className="flex w-full cursor-pointer items-end"
            onClick={() => window.open("https://sapp.edu.vn", "_blank")}
          >
            <div className="mx-auto my-auto block w-1/2 overflow-hidden sm:max-w-[14rem]">
              <Image
                src={SappLogoImage}
                alt="SAPP Logo"
                priority={true}
                layout="responsive"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="text-5xl font-bold text-primary">
                Congratulation!
              </div>
              <div className="text-center">
                <p>Congratulations, you have achieved the</p>
                <p className="font-bold">{certificate?.course?.name}</p>
                <p>issued by {issuedBy}!</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <ButtonPrimary
                size="medium"
                icon={<div className="size-[22px]">{loading ? <LoadingButtonAnimation /> : <Icon type="download" />}</div>}
                iconPosition="end"
                onClick={handleDownload}
                className={clsx("!px-[29px]", {
                  "opacity-50 !cursor-not-allowed": loading,
                })}
              >
                Download
              </ButtonPrimary>
              <Divider type="vertical" className="mx-4 !h-5 !border-gray-300" />
              <LinkedInShareButton
                certificateUrl={certificate?.certificate_url || ""}
                onOpenModalShare={onOpenModalShare}
              />
              <Divider type="vertical" className="mx-4 !h-5 !border-gray-300" />
              <ClickToCopyButton
                className="h-auto"
                link={`${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${certificate?.id}`}
              >
                <div className="cursor-pointer rounded-full bg-gray-200 p-2 ">
                  <CopyIcon />
                </div>
              </ClickToCopyButton>
            </div>
          </div>
        </div>
      </div>
      {certificate && (
        <ModalShareToLinkedin
          open={openModalShare}
          onClose={onCloseModalShare}
          certificate={certificate}
        />
      )}
    </CertificateCard>
  );
};

export default CertificateVertical;
