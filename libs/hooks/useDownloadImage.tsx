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
  const downloadCertificate = async (html: string, name: string) => {
    const container = document.createElement("div");
    container.innerHTML = html;

    const label = container.querySelector(".label.as-label");
    if (label) {
      label.remove();
    }
    const nameField = container.querySelector<HTMLTextAreaElement>(
      "#sapp-certificate-name",
    );
    if (nameField) {
      nameField.innerHTML = name;
      nameField.value = name;
    }

    document.body.appendChild(container);
    const images = container.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) resolve();
            else img.onload = () => resolve();
          }),
      ),
    );
    htmlToImage.toPng(container).then((dataUrl) => {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${name}-certificate.png`;
      link.click();
      document.body.removeChild(container);
    });
  };

  return { downloadImage, downloadCertificate };
};

export default useDownloadImage;
