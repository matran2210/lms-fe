"use client"
import React, { useMemo } from 'react';
import { useLayoutEffect, useState } from 'react'
import { Divider, Table, TableProps } from 'antd'
import { CertificateImg, Icon, NoCertificationIcon, LoadingButtonAnimation } from '@lms/assets'
import { useDownloadImage } from '@lms/hooks'

import { sappFormatDate } from "@lms/utils";
import clsx from "clsx";
import { useAppSelector, useFeature, userReducer } from "@lms/contexts";
import PopUpCertificate from "./popupCertificate/PopupCertificare";
import { ImageRenderFromHtml } from "@lms/ui";

interface ICertificate {
  certificate: {
    id: string;
    name: string;
    html_template: string;
  };
  certificate_id: string;
  certificate_url: string;
  class_id: string;
  course: {
    id: string;
    name: string;
  };
  course_id: string;
  id: string;
  user_id: string;
  pass_point: number;
  received_times: string;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={clsx("animate-pulse rounded bg-gray-200", className)} />
);
const CertificateRowSkeleton = () => {
  return (
    <div className="grid grid-cols-[1.6fr_0.6fr_1fr_0.5fr] items-center gap-4 py-5">
      {/* Certificate column */}
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <Skeleton className="h-12 w-20 rounded-md" />

        {/* Course name */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* Grade */}
      <Skeleton className="mx-auto h-4 w-12" />

      {/* Certificate received */}
      <Skeleton className="mx-auto h-4 w-32" />

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
};
const CertificateHeaderSkeleton = () => (
  <div className="grid grid-cols-[1.6fr_0.6fr_1fr_0.5fr] gap-4 border-b pb-4">
    <Skeleton className="h-4 w-28" />
    <Skeleton className="mx-auto h-4 w-20" />
    <Skeleton className="mx-auto h-4 w-28" />
    <Skeleton className="mx-auto h-4 w-16" />
  </div>
);

const CertificateTableSkeleton = ({ rows = 6 }: { rows?: number }) => {
  return (
    <div className="rounded-2xl bg-[#fefefe] px-6 py-4 mb-6 mt-0 md:mb-0 md:mt-8 lg:mt-10">
      <CertificateHeaderSkeleton />

      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={clsx("border-b last:border-b-0 bg-[#fefefe]")}>
          <CertificateRowSkeleton />
        </div>
      ))}
    </div>
  );
};

const CertificatePreview = ({
  record,
  userName,
  variant = "desktop",
}: {
  record: ICertificate;
  userName?: string;
  variant?: "desktop" | "mobile";
}) => {
  const isMobile = variant === "mobile";

  const certificateView = useMemo(() => {
    if (record?.certificate?.html_template) {
      return (
        <ImageRenderFromHtml
          id={`${variant}-${record?.certificate_id}`}
          html={record.certificate.html_template}
          name={userName || ''}
          {...(isMobile ? { previewWidth: 80, previewHeight: 80 } : {})}
        />
      );
    }
    return (
      <CertificateImg
        {...(isMobile ? { size: 80 } : {})}
        className="border-none text-[#A1A1A1] group-hover:text-primary"
      />
    );
  }, [isMobile, record?.certificate?.html_template]);

  return certificateView;
};

const Certificate = () => {
  const { detail } = useAppSelector(userReducer).user;
  const { authApi } = useFeature();
  const [certificateData, setCertificateData] = useState<
    ICertificate[] | undefined
  >(undefined);
  const [modalOpen, setOpenModal] = useState(false);
  const [userDetail, setUserDetail] = useState("");
  const [listLoadingId, setListLoadingId] = useState<string[]>([]);
  const { downloadCertificate } = useDownloadImage();
  const fetchChapterDetail = async () => {
    try {
      const res = await authApi.getCertificate(1, 30);
      const certificate = res.data.certificates;
      const userDetail = res.username;
      setCertificateData(certificate);
      setUserDetail(userDetail);
    } catch (error) { }
  };

  useLayoutEffect(() => {
    fetchChapterDetail();
  }, []);
  const [certificateDataPopup, setCertificateDataPopup] = useState<unknown>();
  const handleDownload = async (certificate: ICertificate) => {
    if (listLoadingId.includes(certificate.id)) return;
    setListLoadingId((prev) => [...prev, certificate.id]);
    try {
      await downloadCertificate(
        document.getElementById(`desktop-${certificate?.certificate_id}`) as HTMLElement,
        certificate.certificate.html_template,
        detail?.full_name,
        certificate.certificate.name,
      );
    } catch (error) { } finally {
      setListLoadingId((prev) => prev.filter((item) => item !== certificate.id));
    }
  }

  const columns: TableProps<ICertificate>["columns"] = [
    {
      title: "Certificate",
      className: "max-w-sm",
      render: (record) => (
        <div
          className="group flex cursor-pointer items-center gap-2"
          onClick={() =>
            window.open(
              `${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${record?.id}`,
              "_blank",
            )
          }
        >
          <CertificatePreview record={record} userName={detail?.full_name || ''} variant="desktop" />
          <span className="text-base font-medium group-hover:text-primary">
            {record?.course?.name}
          </span>
        </div>
      ),
    },
    {
      title: "Grade Achieved",
      align: "center",
      render: (record) => (
        <div className="text-base text-secondary">
          {record?.pass_point ? `${record?.pass_point}%` : "-"}
        </div>
      ),
    },
    {
      title: "Certificate Received",
      align: "center",
      render: (record) => (
        <div className="text-base text-secondary">
          {sappFormatDate(record?.received_times, "DD/MM/YYYY HH:mm")}
        </div>
      ),
    },
    {
      title: "Action",
      align: "center",
      render: (record) => (
        <div className="flex items-center justify-center gap-1">
          <div
            className={clsx("cursor-pointer", {
              "opacity-50 !cursor-not-allowed": listLoadingId.includes(record.id),
            })}
            onClick={() => handleDownload(record)}
          >
            {listLoadingId.includes(record.id) ? (
              <LoadingButtonAnimation />
            ) : (
              <Icon
                type="download"
                className="cursor-pointer text-secondary hover:text-primary"
              />
            )}
          </div>

          <Divider type="vertical" className="border-black" />
          <div
            onClick={() =>
              window.open(
                `${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${record?.id}`,
                "_blank",
              )
            }
          >
            <Icon
              type="eye-view"
              className="cursor-pointer text-secondary hover:text-primary"
            />
          </div>
        </div>
      ),
    },
  ];

  if (!certificateData) {
    return <CertificateTableSkeleton />;
  }
  return (
    <div className="mb-6 mt-0 md:mb-0 md:mt-8 lg:mt-10">
      {certificateData && !certificateData?.length ? (
        <div className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center gap-2 md:min-h-352">
          <NoCertificationIcon />
          <div className="text-small text-gray-400">
            You don&rsquo;t have any certificate!
          </div>
        </div>
      ) : null}
      {certificateData?.length ? (
        <Table<ICertificate>
          className="profile-certificate-table hidden lg:block"
          columns={columns}
          dataSource={certificateData}
          pagination={false}
        />
      ) : null}

      <div className="flex flex-col gap-4 md:gap-6 lg:hidden">
        {certificateData?.length ? (
          <div className="hidden text-xl font-semibold text-secondary md:block">
            Certificate
          </div>
        ) : null}
        {certificateData?.length
          ? certificateData.map((item: ICertificate, index: number) => (
            <CertificateItem
              key={item?.id}
              record={item}
              isLastItem={index === certificateData.length - 1}
              listLoadingId={listLoadingId}
              setListLoadingId={setListLoadingId}
            />
          ))
          : null}
      </div>

      {modalOpen && (
        <PopUpCertificate
          openPreview={modalOpen}
          setOpenModal={setOpenModal}
          data={certificateDataPopup}
          message={""}
          onClose={() => {
            setCertificateDataPopup(null);
            setOpenModal(false);
          }}
          userDetail={userDetail}
        />
      )}
    </div>
  );
};

const CertificateItem = ({
  record,
  isLastItem,
  listLoadingId,
  setListLoadingId,
}: {
  record: ICertificate;
  isLastItem: boolean;
  listLoadingId: string[];
  setListLoadingId: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { detail } = useAppSelector(userReducer).user;
  const { downloadCertificate } = useDownloadImage();
  const handleDownload = async (certificate: ICertificate) => {
    if (listLoadingId.includes(certificate.id)) return;
    setListLoadingId((prev) => [...prev, certificate.id]);
    try {
      await downloadCertificate(
        document.getElementById(`mobile-${certificate?.certificate_id}`) as HTMLElement,
        certificate.certificate.html_template,
        detail?.full_name,
        certificate.certificate.name,
      );
    } catch (error) {
    } finally {
      setListLoadingId((prev) => prev.filter((item) => item !== certificate.id));
    }
  }
  return (
    <div
      className={clsx(
        "flex flex-col gap-3 rounded-xl bg-white p-4 shadow-small md:gap-6 md:rounded-none md:bg-transparent md:p-0 md:shadow-none",
        {
          "md:border-b md:border-b-gray-300 md:pb-6": !isLastItem,
        },
      )}
    >
      <div
        className="group flex cursor-pointer items-center gap-4"
        onClick={() =>
          window.open(
            `${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${record?.id}`,
            "_blank",
          )
        }
      >
        <CertificatePreview record={record} userName={detail?.full_name || ''} variant="mobile" />
        <span className="text-base font-medium group-hover:text-primary md:text-lg md:font-semibold">
          {record?.course?.name}
        </span>
      </div>
      <InfoWrapper title="Grade Achieved:" value={`${record?.pass_point}%`} />

      <InfoWrapper
        title="Certificate Received:"
        value={sappFormatDate(record?.received_times, "DD/MM/YYYY HH:mm")}
      />
      <InfoWrapper
        value={
          <div className="flex items-center justify-center gap-[11px]">
            <div
              className={clsx("cursor-pointer", {
                "opacity-50 !cursor-not-allowed": listLoadingId.includes(record.id),
              })}
              onClick={() => handleDownload(record)}
            >
              {listLoadingId.includes(record.id) ? (
                <LoadingButtonAnimation />
              ) : (
                <Icon
                  type="download"
                  className="cursor-pointer !text-icon hover:text-primary"
                />
              )}
            </div>

            <Divider type="vertical" className="!mx-0 bg-icon" />
            <div
              onClick={() =>
                window.open(
                  `${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${record?.id}`,
                  "_blank",
                )
              }
            >
              <Icon
                type="eye-view"
                className="cursor-pointer !text-icon hover:text-primary"
              />
            </div>
          </div>
        }
      />
    </div>
  );
};
const InfoWrapper = ({
  title,
  value,
}: {
  title?: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between text-sm md:text-base">
      <div className="font-normal">{title}</div>
      <div className="font-semibold text-gray-800">{value}</div>
    </div>
  );
};
export default Certificate;
