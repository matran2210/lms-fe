"use client";
import {
  DeserializeHighlight,
  replaceTextAlignCenterToWebKitCenter,
  replaceWhiteSpacePreWrapToNormal,
} from "@lms/utils";
import parseHTML, { Element } from "html-react-parser";
import { useEffect, useRef, useState } from "react";
import SappModalImage from "../modal/SappModalImage";
// import "src/utils/global.d.ts"; lỗi monorepo đừng xóa
import clsx from "clsx";
import React from "react";
import { SAPPVideo } from "../video";
import { useFeature } from "@lms/contexts";
declare var com: any;
type Props = {
  text_editor_content: string | undefined;
  className?: string;
  extenalRef?: any;
  id?: string;
  onMouseUp?: any;
  highlighted?: string;
  options?: any;
  highlighArea?: string;
  pinned?: boolean;
};

const EditorReader = ({
  text_editor_content = "",
  className = "",
  extenalRef,
  id,
  onMouseUp,
  highlighted,
  options,
  highlighArea = "hightlight_area",
  pinned,
}: Props) => {
  const {videoUrl} = useFeature();
  const [src, setSrc] = useState<string>();
  const [type, setType] = useState<"VIDEO" | "IMG">("VIDEO");
  const [content, setContent] = useState<any>();
  const editorRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, React.RefObject<HTMLVideoElement>>>(
    {},
  );

  useEffect(() => {
    if (highlighArea === "hightlight_area_topic") {
      DeserializeHighlight(highlighted, highlighArea);
    } else if (highlighArea === "hightlight_area_require") {
      DeserializeHighlight(highlighted, highlighArea);
    } else if (highlighArea === "hightlight_area") {
      DeserializeHighlight(highlighted);
    }
  }, [content, highlighted]);

  useEffect(() => {
    if (text_editor_content !== content) {
      setContent(text_editor_content);
    }
  }, [text_editor_content]);

  const convertMathToImage = async (element: any) => {
    // TODO: check lại này
    if (typeof com === "undefined") return;

    const viewer = com?.wiris?.js?.JsPluginViewer;

    if (element && viewer) {
      try {
        await viewer.parseElement(element, true, function () {
          // Do something
        });
      } catch (error) {
        // Log the error
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const editor = editorRef?.current;
      if (editor) {
        const mfencedElements = editor?.querySelectorAll("mfenced");
        mfencedElements.forEach((el: any) => {
          const openAttr = el?.getAttribute("open");
          const closeAttr = el?.getAttribute("close");
          if (openAttr !== null && closeAttr) {
            const replacements: { [key: string]: string } = {
              "|": "|",
              "||": "||",
              ">": "<",
              "}": "{",
              "]": "[",
              "&#62;": "&#60;",
            };
            if (replacements[closeAttr]) {
              el?.setAttribute("open", replacements[closeAttr]);
            }
          }
        });

        // Replace quote in font family
        const mathElement = editor?.querySelectorAll("math");
        if (mathElement) {
          mathElement?.forEach((el: any) => {
            if (el?.hasAttribute("style")) {
              let styleValue = el?.getAttribute("style");
              styleValue = styleValue?.replaceAll('"', "");
              el?.setAttribute("style", styleValue);
            }
          });
          convertMathToImage(editor);
        }
      }
    }, 100);
  });

  const handleOnclick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e?.target as HTMLElement;
    if (target.className === "sapp_overlay_video") {
      // const overlay = target.nextSibling as any
      const video = target?.previousSibling as any;
      const src = video?.querySelector("source")?.getAttribute("token");
      if (src && src !== "null" && video.tagName === "VIDEO") {
        const iframe = document.createElement("iframe");
        iframe.src = `${videoUrl}${src}/iframe?autoplay=true`;
        iframe.id = video?.id;
        iframe.className = video?.className;
        iframe.style.cssText = video?.style.cssText;
        iframe.allow =
          "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;";
        iframe.allowFullscreen = true;
        video?.parentNode?.replaceChild(iframe, video);
        target?.classList.add("hidden");
        // target?.parentNode?.removeChild(target.nextSibling as Node)
      }
    } else if (target?.tagName === "IMG") {
      const imageSrc = target?.getAttribute("src");
      if (imageSrc) {
        setSrc(() => {
          setType("IMG");
          return imageSrc;
        });
      }
    }
  };

  /**
   * @description add class border theo editor khi border style khác none và hidden ở lần đầu component render
   */
  useEffect(() => {
    // Lấy tất cả các bảng trong tài liệu
    const tableElements = document?.querySelectorAll("table");

    tableElements?.forEach((tableElement) => {
      if (tableElement) {
        // Lấy kiểu border của bảng hiện tại
        const style = window?.getComputedStyle(tableElement);
        const newBorderStyle = style?.borderStyle;

        // Lấy tất cả các ô (td) trong bảng hiện tại
        const tdElements = tableElement?.querySelectorAll("td");
        tdElements?.forEach((td) => {
          if (newBorderStyle !== "none" && newBorderStyle !== "hidden") {
            td?.classList?.add("border-[1px]");
          } else {
            td?.classList?.remove("border-[1px]");
          }
        });
      }
    });
  });

  return (
    <>
      <div
        className={`mce-content-body editor-wrap text-base ${className}`}
        id={id || ""}
        onMouseUp={onMouseUp ? onMouseUp : () => undefined}
        ref={editorRef}
      >
        <div
          ref={extenalRef}
          className={clsx({
            "pined-noti text-base text-white": pinned,
          })}
          key={content}
          onClick={handleOnclick}
          translate="no"
        >
          {parseHTML(
            replaceTextAlignCenterToWebKitCenter(
              replaceWhiteSpacePreWrapToNormal(content || ""),
            ),
            {
              replace: (domNode) => {
                if (domNode.type === "tag" && domNode.name === "video") {
                  const sourceChild = (domNode.children as Element[]).find(
                    (child) => child.name === "source",
                  );
                  const videoToken = sourceChild?.attribs?.token;
                  if (videoToken) {
                    if (!videoRefs.current[videoToken]) {
                      videoRefs.current[videoToken] =
                        React.createRef<HTMLVideoElement>();
                    }
                    return (
                      <SAPPVideo
                        key={videoToken}
                        options={{
                          onTimeUpdate: () => undefined,
                          src: videoToken,
                        }}
                        streamRef={videoRefs.current[videoToken]}
                        pauseOnSeek={true}
                        thumbnail={{
                          "311x175": `${videoUrl}${videoToken}/thumbnails/thumbnail.jpg?time=1s&height=175`,
                          "656x369": `${videoUrl}${videoToken}/thumbnails/thumbnail.jpg?time=1s&height=369`,
                          "1270x716": `${videoUrl}${videoToken}/thumbnails/thumbnail.jpg?time=1s&height=716`,
                        }}
                        videoAttribs={domNode.attribs}
                      />
                    );
                  }
                }
              },
              ...options,
            },
          )}
        </div>
      </div>
      {type === "IMG" && (
        <SappModalImage src={src} setSrc={setSrc}></SappModalImage>
      )}
    </>
  );
};

export default EditorReader;
