import { IconSend, LoadingButtonAnimation } from "@lms/assets";

const SendComment = ({ isLoading = false }: { isLoading?: boolean }) => {
  return (
    <>
      {isLoading ? (
        <LoadingButtonAnimation />
      ) : (
        <div className="cursor-pointer hover:text-primary">
          <IconSend />
        </div>
      )}
    </>
  );
};

export default SendComment;
