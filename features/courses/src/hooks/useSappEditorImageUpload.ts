
export const useSappEditorImageUpload = ({
  base64ToFile,
  handleUploadFileToS3,
  fileToBase64,
}: {
  base64ToFile: (base64String: string, fileName: string) => File;
  handleUploadFileToS3: (
  convertedFile: File,
  location: string,
  getProgress?: (progress: number) => void,
  abortSignal?: AbortSignal,
) => Promise<{ url: string } | undefined>;
fileToBase64: (file: File) => Promise<string>;
}) => {
  const handleImageUpload = async (
    file: File,
    location: string,
  ): Promise<string> => {
    try {
      // Đọc file dưới dạng base64
      const base64String = (await fileToBase64(file)) as string;
      // Chuyển base64 thành File để tải lên S3
      const convertedFile = base64ToFile(
        base64String as string,
        file.name || "image.png",
      );
      const response = await handleUploadFileToS3(convertedFile, location);

      if (!response?.url) {
        throw new Error("Upload failed: No URL returned");
      }
      return response.url;
    } catch {
    }
  };

  return {
    handleImageUpload,
  };
};
