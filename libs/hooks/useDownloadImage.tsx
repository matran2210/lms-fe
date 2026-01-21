import { message } from "antd";
import * as htmlToImage from "html-to-image";

const useDownloadImage = () => {
  const downloadImage = async (url: string) => {
    try {
      const originalImage = url;
      const image = await fetch(originalImage);

      if (!image.ok) {
        message.error("Tải ảnh thất bại. Vui lòng thử lại!");
      }

      // Split image name
      const nameSplit = originalImage.split("/");
      const duplicateName = nameSplit.pop() || "downloaded-image";

      const imageBlob = await image.blob();
      const imageURL = URL.createObjectURL(imageBlob);

      const link = document.createElement("a");
      link.href = imageURL;
      link.download = "" + duplicateName + "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up object URL
      URL.revokeObjectURL(imageURL);
    } catch (error: any) {
      message.error("Tải ảnh thất bại. Vui lòng thử lại!");
    }
  };

  const downloadCertificate = async (
    html: HTMLElement,
    stringHtml: string,
    name: string,
    certificateName: string,
  ) => {
    if (!html) return;
    try {
      const bodyStringHtml = stringHtml.match(/body\s*\{([\s\S]*?)\}/i)?.[1] ?? "";
      const widthCertificate = Number(
        bodyStringHtml.match(/(^|\s)width\s*:\s*(\d+)px\s*;/i)?.[2]
      );
      const heightCertificate = Number(
        bodyStringHtml.match(/(^|\s)height\s*:\s*(\d+)px\s*;/i)?.[2]
      );
      const widthCertificateElement = html.clientWidth;
      await new Promise(resolve => setTimeout(resolve, 1000));
      const dataUrl = await htmlToImage.toPng(html, {
        pixelRatio: 1,
        width: widthCertificate,
        height: heightCertificate,
        style: {
          transform: `scale(${widthCertificate / widthCertificateElement})`,
          transformOrigin: 'top left',
        },
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${name}-${certificateName}-certificate.png`;
      link.click();
    } catch (error) {
      message.error("Tải ảnh thất bại. Vui lòng thử lại!");
    }
  };

  return { downloadImage, downloadCertificate };
};

export default useDownloadImage;
