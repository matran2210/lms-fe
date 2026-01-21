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

  const downloadCertificate = async (html: HTMLElement, stringHtml: string, name: string, certificateName: string) => {
    const bodyStringHtml = stringHtml.match(/body\s*\{([\s\S]*?)\}/i)?.[1] ?? "";
    const widthCertificate = Number(
      bodyStringHtml.match(/(^|\s)width\s*:\s*(\d+)px\s*;/i)?.[2]
    );
    const heightCertificate = Number(
      bodyStringHtml.match(/(^|\s)height\s*:\s*(\d+)px\s*;/i)?.[2]
    );
    if (!html) return;
    const widthCertificateElement = html.clientWidth;
    htmlToImage.toPng(html, {
      pixelRatio: 1,
      width: widthCertificate,
      height: heightCertificate,
      style: {
        transform: `scale(${widthCertificate / widthCertificateElement})`,
        transformOrigin: 'top left',
      },
    }).then((dataUrl) => {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${name}-${certificateName}-certificate.png`;
      link.click();
    });
  };

  return { downloadImage, downloadCertificate };
};

export default useDownloadImage;
