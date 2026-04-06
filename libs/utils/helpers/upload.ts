import _ from "lodash";
import toast from "react-hot-toast";

export const validateFile = (
  file: any,
  acceptFiles?: { type?: string; size?: number }[],
  toastId?: string,
): boolean => {
  const fileType = file.contentType || file.type;
  const fileSize = file.size;

  if (!acceptFiles) return true;
  const acceptedTypes = acceptFiles.map((file) => file.type);

  if (acceptedTypes.length > 0) {
    if (
      !acceptedTypes.some((type) =>
        type?.endsWith("*")
          ? fileType.startsWith(type.split("/")[0])
          : fileType === type,
      )
    ) {
      toast.error("File không hỗ trợ");
      return false;
    }
  }

  const maxFileSize =
    acceptFiles.find((acceptFile) =>
      acceptFile?.type?.endsWith("*")
        ? fileType.startsWith(acceptFile.type.split("/")[0])
        : fileType === acceptFile.type,
    )?.size || 0;

  if (maxFileSize > 0 && fileSize > maxFileSize) {
    toast.error("File quá lớn");
    return false;
  }

  return true;
};

export const isPdfFile = (fileName: string) => {
  return fileName.toLowerCase().endsWith(".pdf");
};

export const downloadFileByURL = async (url: string, fileName?: string) => {
  const res = await fetch(url);
  const blob = await res.blob();

  const fileURL = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = fileURL;
  a.download = fileName || "download";
  a.click();

  URL.revokeObjectURL(fileURL);
};

type Option = {
  label?: string;
  value?: string;
  [key: string]: any;
};

export const getSelectOptions = (
  options?: Option[],
  existedOption?: Option,
  key: string = "value",
): Option[] => {
  return _.chain([existedOption])
    .compact() // loại bỏ undefined/null
    .concat(options ?? []) // gộp với options
    .filter((item) => item[key]) // lọc item có key
    .uniqBy(key) // loại trùng theo key
    .value();
};
