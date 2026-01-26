import clsx from "clsx";

interface IProps {
  html: string;
  previewWidth?: number;
  previewHeight?: number;
  className?: string;
  name?: string;
  id?: string;
}

const ImageRenderFromHtml = ({
  html,
  previewWidth = 50,
  previewHeight = 50,
  className,
  name = "Student Name",
  id = "certificate-image-id",
}: IProps) => {
  const injectNameAndSanitize = (input: string): string => {
    try {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(input, "text/html");
      
      const nameField =
        htmlDoc.querySelector<HTMLTextAreaElement>("#sapp-certificate-name");
      if (nameField) {
        nameField.innerHTML = name;
        nameField.value = name;
      }
      const label = htmlDoc.querySelector(".label.as-label");
      if (label) {
        label.remove();
      }

      return htmlDoc.documentElement?.outerHTML || input;
    } catch {
      return input;
    }
  };

  const sanitizedHtml = injectNameAndSanitize(html);

  const certWidth = Number(sanitizedHtml?.match(/width:\s*([\d.]+)px/i)?.[1]);
  const certHeight = Number(sanitizedHtml?.match(/height:\s*([\d.]+)px/i)?.[1]);
  const scale = Math.min(previewWidth / certWidth, previewHeight / certHeight);
  const scaledWidth = certWidth * scale;
  const scaledHeight = certHeight * scale;
  const extractBodyHtml = (html: string): string => {
    if (!html) return "";
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body?.innerHTML?.trim();
      return bodyContent || html.trim();
    } catch {
      return html.trim();
    }
  };
  const bodyHtml = extractBodyHtml(sanitizedHtml);
  return (
    <div
      className={clsx(
        "flex items-center justify-center overflow-hidden",
        className,
      )}
      style={{ width: previewWidth, height: previewHeight }}
    >
      <div id={id} style={{ width: scaledWidth, height: scaledHeight }}>
        <div
          style={{
            width: certWidth,
            height: certHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </div>
    </div>
  );
};

export default ImageRenderFromHtml;
