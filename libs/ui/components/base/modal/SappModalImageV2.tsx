import Image from "next/future/image";
import { useEffect, useState } from "react";
import SappModalV2 from "./SappModalV2";

type Props = {
  src?: string;
  setSrc: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const MAX_RATIO = 0.9;

function SappModalImageV2({ src, setSrc }: Props) {
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

  return (
    <SappModalV2
      title=""
      open={!!src}
      handleCancel={() => setSrc(undefined)}
      showFooter={false}
      width={modalWidth}
      classNameModal="sapp-preview--image-v2"
      onOk={() => {}}
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

export default SappModalImageV2;
