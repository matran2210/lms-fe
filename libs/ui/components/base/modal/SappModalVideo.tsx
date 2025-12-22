import React from "react";
import SAPPVideo from "../video/SAPPVideo";
import SappModal from "./SappModal";

type Props = {
  src?: string;
  setSrc: React.Dispatch<React.SetStateAction<string | undefined>>;
};

function SappModalVideo({ src, setSrc }: Props) {
  const handleClose = () => {
    setSrc(undefined);
  };

  return (
    <div>
      <SappModal
        open={!!src}
        okButtonCaption={"Yes"}
        cancelButtonCaption={"No"}
        handleCancel={handleClose}
        handleSubmit={handleClose}
        setOpen={handleClose}
        size="max-w-[1144px]"
        position="center"
        showFooter={false}
      >
        {src && <SAPPVideo options={{ src }}></SAPPVideo>}
      </SappModal>
    </div>
  );
}

export default SappModalVideo;
