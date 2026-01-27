import { message } from "antd";
import * as htmlToImage from "html-to-image";

const useDownloadImage = () => {
  const downloadImage = async (url: string) => {
    try {
      const originalImage = url;
      const image = await fetch(originalImage);

      if (!image.ok) {
        message.error("Tải ảnh thất bại. Vui lòng thử lại!");
        return;
      }

      const nameSplit = originalImage.split("/");
      const duplicateName = nameSplit.pop() || "downloaded-image";

      const imageBlob = await image.blob();
      const imageURL = URL.createObjectURL(imageBlob);

      const link = document.createElement("a");
      link.href = imageURL;
      link.download = duplicateName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(imageURL);
    } catch (error: any) {
      message.error("Tải ảnh thất bại. Vui lòng thử lại!");
    }
  };

  // Helper function để lấy embedded font CSS
  const getEmbeddedFontCSS = async () => {
    try {
      const fontFaces: string[] = [];
      
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSFontFaceRule) {
              fontFaces.push(rule.cssText);
            }
          }
        } catch (e) {
          // Skip CORS blocked stylesheets
          console.warn('Cannot access stylesheet:', e);
        }
      }
      
      return fontFaces.join('\n');
    } catch (error) {
      console.error('Error getting font CSS:', error);
      return '';
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
      // Đợi tất cả fonts load xong
      await document.fonts.ready;

      // Lấy embedded font CSS
      const fontEmbedCSS = await getEmbeddedFontCSS();

      const bodyStringHtml = stringHtml.match(/body\s*\{([\s\S]*?)\}/i)?.[1] ?? "";
      const widthCertificate = Number(
        bodyStringHtml.match(/(^|\s)width\s*:\s*(\d+)px\s*;/i)?.[2]
      );
      const heightCertificate = Number(
        bodyStringHtml.match(/(^|\s)height\s*:\s*(\d+)px\s*;/i)?.[2]
      );
      const widthCertificateElement = html.clientWidth;

      const dataUrl = await htmlToImage.toPng(html, {
        pixelRatio: 1,
        width: widthCertificate,
        height: heightCertificate,
        fontEmbedCSS, // Sử dụng fonts đã embed sẵn
        cacheBust: false, // Tắt cache busting
        skipFonts: true, // Skip việc fetch fonts mới
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
  const getCertificateBase64 = async (
    html: HTMLElement,
    stringHtml: string,
    name: string,
    certificateName: string,
  ) => {
    if (!html) return;
    
    try {
      // Đợi tất cả fonts load xong
      await document.fonts.ready;

      // Lấy embedded font CSS
      const fontEmbedCSS = await getEmbeddedFontCSS();

      const bodyStringHtml = stringHtml.match(/body\s*\{([\s\S]*?)\}/i)?.[1] ?? "";
      const widthCertificate = Number(
        bodyStringHtml.match(/(^|\s)width\s*:\s*(\d+)px\s*;/i)?.[2]
      );
      const heightCertificate = Number(
        bodyStringHtml.match(/(^|\s)height\s*:\s*(\d+)px\s*;/i)?.[2]
      );
      const widthCertificateElement = html.clientWidth;

      const dataUrl = await htmlToImage.toPng(html, {
        pixelRatio: 1,
        width: widthCertificate,
        height: heightCertificate,
        fontEmbedCSS, // Sử dụng fonts đã embed sẵn
        cacheBust: false, // Tắt cache busting
        skipFonts: true, // Skip việc fetch fonts mới
        style: {
          transform: `scale(${widthCertificate / widthCertificateElement})`,
          transformOrigin: 'top left',
        },
      });

      return {
        url: dataUrl,
        name: `${name}-${certificateName}-certificate.png`
      }
    } catch (error) {
      return { url: '', name: ''}
    }
  };

  return { downloadImage, downloadCertificate, getCertificateBase64 };
};

export default useDownloadImage;