import { IconSend } from "@lms/assets";
import { Spin } from "antd";

const SendComment = ({ isLoading = false }: { isLoading?: boolean }) => {

  return (
    <>
      {isLoading ? (
        <Spin tip="Loading" className="!text-warning" />
      ) : (
        <div className="cursor-pointer hover:text-primary">
          <IconSend />
        </div>
      )}
    </>
  );
};

export default SendComment;
