import { Progress } from "antd";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import dynamic from "next/dynamic";
import React, { ReactElement } from "react";
import toast from "react-hot-toast";
import { ButtonSecondary } from "../../base";
import { validateFile } from "@lms/utils";
import { isArray } from "lodash";
import { DocumentIconImage, ImageIconImage, VideoIconImage } from "@lms/assets";
import { UPLOAD_TYPE } from "@lms/core";

type Props = {
  beforeUpload?: (file: RcFile, FileList: RcFile[]) => boolean;
  uploadFile: any;
  setUploadFile: React.Dispatch<React.SetStateAction<any>>;
  progress: { [key: string]: number };
  loading: boolean;
  handleCancel: (closeModal: boolean, removedUid?: string) => void;
  fileType: keyof typeof UPLOAD_TYPE;
  icon: any;
  isMultiple?: boolean;
  customValidate?: (
    file: UploadFile<any>,
    fileList: UploadFile<any>[],
    index: number,
  ) => boolean;
  maxCount?: number;
};
const Dragger = dynamic(async () => await import("antd/es/upload/Dragger"), {
  ssr: false,
});
const UploadFileHandle = ({
  uploadFile,
  setUploadFile,
  progress,
  loading,
  // handleCancel,
  fileType,
  icon,
  isMultiple,
  customValidate,
  maxCount,
}: Props) => {
  const findIconByJpg = (extension: string) => {
    for (const key in UPLOAD_TYPE) {
      if (key === "ALL" || key === "ALL_RESOURCE") continue;
      const support = UPLOAD_TYPE[key].extension;
      if (
        support.includes(extension.toUpperCase()) ||
        support.includes(extension)
      ) {
        return UPLOAD_TYPE[key].icon;
      }
    }
    return "";
  };

  const itemRender = (
    _originNode: ReactElement,
    _file: UploadFile,
    _fileList: UploadFile[],
    actions: { remove: () => void },
  ) => {
    let extension = "";
    let newIcon = icon;

    if (fileType === "ALL" || fileType === "ALL_RESOURCE") {
      extension = _file.name.split(".").slice(-1).join();
      newIcon = findIconByJpg(extension);
    }
    let percent;
    let strokeColor;
    if (_file.status === "done") {
      percent = 100;
      strokeColor = "#FFB800";
    } else if (_file.status === "error") {
      strokeColor = "#D35563";
      percent = 100;
    } else {
      percent = progress[_file.uid];
      strokeColor = "#FFB800";
    }
    return (
      <>
        <div className="sapp-upload-file-progress mt-2 items-center">
          <div className="w-100 sapp-upload-file-content">
            <div className="sapp-upload-file-name">
              {_file?.name ?? _file?.originFileObj?.name}
            </div>
            {loading && (
              <Progress
                percent={percent}
                status={"active"}
                strokeColor={strokeColor}
                className="m-0"
              />
            )}
          </div>
        </div>
      </>
    );
  };

  const handleChangeUpload = (e: UploadChangeParam<UploadFile<any>>) => {
    const length = e?.fileList?.length || 0;
    e.fileList = e?.fileList?.filter((f: any, i) => {
      if (f?.resource_id) {
        return true;
      }
      if (maxCount && length > maxCount && i >= maxCount) {
        toast.error("Upload giới hạn " + maxCount + " files", {
          id: "upload_toast_max_count",
        });
        return false;
      }

      if (customValidate && customValidate(f, e.fileList, i)) {
        return false;
      }
      if (
        validateFile(f, UPLOAD_TYPE[fileType].acceptFiles, "upload_toast_" + i)
      ) {
        return true;
      }
      return false;
    });
    setUploadFile(e.fileList);
  };

  const renderIcon = () => {
    switch (UPLOAD_TYPE[fileType].type) {
      case "ALL":
      case "ALL_RESOURCE":
        return [VideoIconImage, DocumentIconImage, ImageIconImage];

      case "VIDEO":
        return [VideoIconImage];

      case "IMAGE":
        return [ImageIconImage];

      case "DOCUMENT":
        return [DocumentIconImage];
    
      default:
        break;
    }
  };
  return (
    <div>
      <Dragger
        beforeUpload={() => false}
        itemRender={itemRender}
        onChange={handleChangeUpload}
        disabled={loading}
        fileList={uploadFile}
        multiple={isMultiple}
        accept={UPLOAD_TYPE[fileType]?.accept}
        {...(!isMultiple && { maxCount: 1 })}
      >
        <div className="scroll-y px-lg-15 px-10 pb-10 pt-10">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-3 flex justify-center">
              {isArray(renderIcon()) && (
                  <div className="flex items-center justify-center gap-5">
                  {renderIcon()?.map((e: any, i: number) => {
                    return (
                      <img
                        width={64}
                        height={64}
                        src={e.src}
                        alt="Icon"
                        key={i}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            <p>Drag & Drop your file here</p>
            <p>or</p>
            <ButtonSecondary
              disabled={loading}
              title="Browse"
              className="mb-10"
            ></ButtonSecondary>
            <div className="mx-auto my-0 flex w-fit">
              <span className="text-left">
                {" "}
                File support:{" "}
                {UPLOAD_TYPE[fileType]?.note?.map((e, i) => {
                  return <span key={i}>{e}&nbsp;</span>;
                })}{" "}
              </span>
            </div>
          </div>
        </div>
      </Dragger>
    </div>
  );
};

export default UploadFileHandle;
