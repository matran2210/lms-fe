"use client";
import { useEffect, useState } from "react";
import SappModalV2 from "./SappModalV2";
import Image from "next/image";
import ModalResizeable from "./ModalResizeable";
import { CloseIcon } from "@lms/assets/icons";

type Props = {
  src?: string;
  setSrc: React.Dispatch<React.SetStateAction<string | undefined>>;
  isResizable?: boolean;
};

const MAX_RATIO = 0.9;
const MODAL_HEADER_HEIGHT = 56;
const RESIZABLE_MIN_WIDTH = 450;

function SappModalImageOriginalRatio({ src, setSrc, isResizable = false }: Props) {
  const [modalWidth, setModalWidth] = useState<number>(560);
  const [imgRatio, setImgRatio] = useState<number>(1);
  useEffect(() => {
    if (!src) return;

    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      const maxW = window.innerWidth * MAX_RATIO;
      const maxH = window.innerHeight * MAX_RATIO;

      const naturalRatio = img.naturalWidth / img.naturalHeight;

      let displayW = img.naturalWidth;
      let displayH = img.naturalHeight;

      // scale theo viewport
      const ratio = Math.min(1, maxW / displayW, maxH / displayH);

      displayW = displayW * ratio;
      displayH = displayH * ratio;

      setImgRatio(naturalRatio);
      setModalWidth(displayW);
    };
  }, [src]);

  if (isResizable && src) {
    const initialModalWidth = RESIZABLE_MIN_WIDTH;
    const initialImageHeight = RESIZABLE_MIN_WIDTH / imgRatio;
    const totalModalHeight = initialImageHeight + MODAL_HEADER_HEIGHT;
    const maxWidth = typeof window !== "undefined" ? window.innerWidth * MAX_RATIO : undefined;
    const maxHeight = typeof window !== "undefined" ? window.innerHeight * MAX_RATIO : undefined;

    return <ModalResizeable
      bodyClassName={'p-6'}
      key={src}
      title={"Preview Image"}
      width={initialModalWidth}
      height={totalModalHeight}
      minWidth={RESIZABLE_MIN_WIDTH}
      minHeight={(RESIZABLE_MIN_WIDTH / imgRatio) + MODAL_HEADER_HEIGHT}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      lockAspectRatio={true}
      className={'!z-40 !rounded-lg'}
      position="center"
      onClose={() => setSrc(undefined)}
      header={({ requestClose }) => (
        <div className="modal-header modal-dragger cursor-move flex w-full items-center justify-between mb-4">
          <div className="truncate font-semibold">
            Preview Image
          </div>
          <button
            onClick={() => {
              requestClose()
              setTimeout(() => setSrc(undefined), 300)
            }}
            onTouchEnd={() => {
              requestClose()
            }}
          >
            <CloseIcon />
          </button>
        </div>
      )}
      isInBody
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden">
        <Image
          src={src}
          width={1000}
          height={1000 / imgRatio}
          className="block h-full max-h-full w-full max-w-full object-contain"
          alt="image"
          priority
        />
      </div>
    </ModalResizeable>
  }
  return (
    <SappModalV2
      title=""
      open={!!src}
      handleCancel={() => setSrc(undefined)}
      showFooter={false}
      width={modalWidth}
      classNameModal="sapp-preview--image"
      onOk={() => { }}
    >
      {src && (
        <Image
          src={src}
          width={1000}
          height={1000 / imgRatio}
          className="block max-h-[90vh] w-auto mx-auto object-contain"
          alt="image"
          priority
        />
      )}
    </SappModalV2>
  );
}

export default SappModalImageOriginalRatio;
