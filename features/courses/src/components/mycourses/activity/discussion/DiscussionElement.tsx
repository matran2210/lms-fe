import {
  BlankAvatarImage,
  BlankAvatarNotificationImage,
  CameraIcon,
  CloseIconPreview,
  DeleteMessageIcon,
  EditMessageIcon,
  ReplyMessageIcon,
  VerifiedIcon
} from "@lms/assets";
import {
  getDiscussion,
  ICreateDiscussionResReact,
  IDiscussion,
  IDiscussionFile,
  IUser,
  useAppDispatch,
  useFeature,
} from "@lms/contexts";
import { useTailwindBreakpoint } from "@lms/hooks";
import {
  HookFormTextArea,
  SappButton,
  SappButtonIcon,
  SappDisplayText,
} from "@lms/ui";
import { calculateTimeAgo, trackGAEvent } from "@lms/utils";
import { Popover } from "antd";
import clsx from "clsx";
import { isEmpty } from "lodash";
import Image from "next/image";
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ActionDiscussion from "./ActionDiscussion";
import ModalDeleteComment from "./ModalDeleteComment";
import SendComment from "./SendComment";

type Props = {
  rank?: number;
  discussion: IDiscussion;
  idReply?: string;
  handleChangeIdReply?: (idReply: string) => void;
  onReact: (data: ICreateDiscussionResReact) => Promise<void>;
  setImageSrc: (value: SetStateAction<string | undefined>) => void;
  classId?: string;
  profile?: IUser;
  setLoading: (isLoading: boolean) => void;
  isSappSupporterUserCurrent?: boolean;
  handleEditDiscussionElement: (isEdit: boolean) => void;
};
type UserInfo = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
};

type IEventData = {
  editData?: string;
};
function DiscussionElement({
  rank = 0,
  discussion,
  idReply,
  handleChangeIdReply,
  setImageSrc,
  classId,
  profile,
  setLoading,
  isSappSupporterUserCurrent = false,
  handleEditDiscussionElement,

}: Props) {
  const { courseApi,
    activityApi,
    courseActivityApi } = useFeature();

  const { isMobileView } = useTailwindBreakpoint();
  const [isLike, setIsLike] = useState<boolean>(discussion.is_like);
  const [timeAgo, setTimeAgo] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [editValue, setEditValue] = useState("");
  const [discussionContent, setDiscussionContent] = useState(
    discussion?.content,
  );
  const dispatch = useAppDispatch();
  const [selectFile, setSelectFile] = useState<File[]>([]);
  const [discussionFile, setDiscussionFile] = useState<IDiscussionFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenUserInfo, setIsOpenUserInfo] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
  const canEdit = profile?.username === discussion?.username;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { control, handleSubmit } = useForm<IEventData>({});

  const onSubmit = async (e: IEventData) => {
    setIsLoading(true);
    try {
      const params = {
        content: e?.editData,
      };
      if (selectFile) {
        await courseActivityApi.uploadImagesDiscussion({
          discussion_id: discussion?.id,
          new_discussion_file: selectFile,
          discussion_file_ids: discussion.course_discussion_files
            .filter((el) => {
              const isNotDelete = discussionFile.find(
                (item) => item.id === el.id,
              );
              if (isNotDelete?.id) {
                return el;
              }
            })
            .map((item) => item.id),
        });
      }
      const res = await activityApi.updateDiscussionComment(
        discussion?.id,
        params,
      );
      handleRefresh();
      if (res?.success) {
        setDiscussionContent(res?.data?.content);
        setIsEdit(false);
        handleEditDiscussionElement(false);
        setSelectFile([]);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    dispatch(
      getDiscussion({
        api: courseApi,
        id: classId as string,
        sectionId: discussion?.course_section_id,
      }),
    );
  };

  const onDeleteComment = async () => {
    setLoading(true);
    try {
      const res = await activityApi.deleteDiscussion(discussion?.id);
      if (res) {
        handleRefresh();
        setIsDelete(false);
        setLoading(false);
      }
    } catch (error) { }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files;
    if (files) {
      const imageFiles = Array.from(files).filter((file) =>
        file?.type?.startsWith("image/"),
      );
      if (imageFiles.length > 1) {
        toast.error("Vui lòng chỉ chọn 1 ảnh từ thiết bị.");
        return;
      }

      // Loại bỏ các file có định dạng .webp
      const filteredFiles = imageFiles?.filter(
        (file) => !file?.name?.toLowerCase()?.endsWith(".webp"),
      );

      // Kiểm tra kích thước file không vượt quá 20MB
      const validFiles = filteredFiles?.filter(
        (file) => file?.size < 20 * 1024 * 1024,
      );

      if (validFiles?.length > 0) {
        setSelectFile(validFiles);
      } else {
        toast.error("Vui lòng chọn ảnh từ thiết bị, không quá 20MB");
        return;
      }
    }

    // Xóa giá trị của input để làm sạch
    if (fileInputRef?.current) {
      fileInputRef.current.value = "";
    }

    e.target.value = "";
  };

  const handleDeleteFile = (id: string | number, isFile: boolean) => {
    if (isFile) {
      setSelectFile((prev: File[]) => {
        return prev.filter((_, i) => i !== id);
      });
    } else {
      setDiscussionFile((prev) => {
        return prev?.filter((e) => e.id !== id);
      });
    }
  };

  const handleEdit = () => {
    setEditValue(discussionContent);
    setIsEdit(true);
    handleEditDiscussionElement(true);
    trackGAEvent("Click Edit Comment Activity");
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
    handleEditDiscussionElement(false);
    handleRefresh();
    setSelectFile([]);
    trackGAEvent("Click Cancel Edit Comment Activity");
  };

  const handleDeleteComment = () => {
    setIsDelete(true);
    trackGAEvent("Click Delete Comment Activity");
  };

  useEffect(() => {
    setIsLike(discussion.is_like);
    setTimeAgo(() => calculateTimeAgo(discussion.created_at));
    setDiscussionFile(discussion.course_discussion_files);
  }, [discussion]);

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Kiểm tra nếu nhấn Enter và không nhấn Shift
      e.preventDefault(); // Ngăn chặn hành động mặc định của Enter
      handleSubmit(onSubmit)();
    }
  };

  const contentPopover = (
    <div className="flex w-72 items-start">
      <div className="w-10">
        <Image
          width={40}
          height={40}
          className="rounded-full"
          src={userInfo?.avatar}
          loading="eager"
          blurDataURL={BlankAvatarImage.src}
          priority={true}
          alt="avatar user"
        />
      </div>
      <div className="w-4" />
      <div className="w-[180px]">
        <div className="mb-1 text-base font-semibold text-[#050505]">
          {userInfo?.name}
        </div>
        <div className="text-xs text-[#A1A1A1]">{userInfo?.email}</div>
        <div className="text-xs text-[#A1A1A1]">{userInfo?.phone}</div>
      </div>
    </div>
  );
  const fetchDiscussionStudentInfo = async () => {
    try {
      const res = await courseApi.getDiscussionStudentInfo(
        discussion?.course_section_id,
        classId as string,
        discussion?.user_id,
      );
      const { data } = res;
      if (isEmpty(data)) return;
      setUserInfo({
        name: data?.student_info?.detail?.full_name,
        email: data?.student_info?.user_contacts?.[0]?.email,
        phone: data?.student_info?.user_contacts?.[0]?.phone,
        avatar: data?.student_info?.detail.avatar?.["50x50"] || BlankAvatarImage,
      });
    } catch (error: any) { }
  };

  const handleMouseEnter = () => {
    if (!isEmpty(userInfo)) {
      setIsOpenUserInfo(true);
    } else {
      if (!discussion.is_sapp_supporter && isSappSupporterUserCurrent) {
        fetchDiscussionStudentInfo();
      }
    }
  };

  const handleMouseLeave = () => {
    setIsOpenUserInfo(false);
  };

  useEffect(() => {
    if (!isEmpty(userInfo)) {
      setIsOpenUserInfo(true);
    }
  }, [userInfo]);

  return (
    <div className="flex gap-3 text-gray-800">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="w-fit"
          >
            <Popover
              content={contentPopover}
              placement="right"
              trigger="hover"
              open={isOpenUserInfo}
              overlayInnerStyle={{ maxWidth: 280 }}
              className="flex gap-3"
            >
              <div
                className={clsx(
                  "flex-none leading-0",
                  !isEmpty(userInfo) && "cursor-pointer",
                )}
              >
                <Image
                  width={isMobileView ? 32 : 40}
                  height={isMobileView ? 32 : 40}
                  className="h-8 w-8 rounded-full md:h-10 md:w-10"
                  src={
                    discussion.is_sapp_supporter
                      ? discussion?.avatar?.["50x50"] ||
                      discussion?.avatar?.["ORIGIN"] ||
                      BlankAvatarNotificationImage
                      : discussion?.avatar?.["50x50"] ||
                      discussion?.avatar?.["ORIGIN"] ||
                      BlankAvatarImage
                  }
                  loading="eager"
                  blurDataURL={BlankAvatarImage.src}
                  priority={true}
                  alt="avatar"
                />
              </div>
              <div
                className={clsx(
                  "flex h-fit items-center gap-2",
                  !isEmpty(userInfo) && "cursor-pointer",
                )}
              >
                <div className="text-base font-medium">
                  {discussion?.is_sapp_supporter
                    ? discussion?.supporter_display_name
                    : discussion?.full_name}
                </div>
                {discussion?.is_sapp_supporter && (
                  <div className="rounded bg-primary-50 px-3 py-1 font-medium text-primary">
                    <div className="flex items-center gap-1">
                      <div className="content-center">
                        <VerifiedIcon className="h-3 w-3" />
                      </div>
                      <div className="w-fit content-center px-2 text-xs">
                        SAPP Supporter
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Popover>
          </div>
          <div className="mt-3 w-auto md:-mt-3 md:ml-[52px]">
            {discussionFile?.map((e) => (
              <div key={e.id} className={`relative bg-cover bg-no-repeat`}>
                <Image
                  width={100}
                  height={100}
                  src={e.url}
                  loading="eager"
                  blurDataURL={BlankAvatarImage.src}
                  objectFit="contain"
                  onClick={() => setImageSrc(e.url)}
                  priority={true}
                  alt="file"
                />
                {isEdit && (
                  <div
                    className="absolute right-[-10px] top-[-10px] rounded-[80px] bg-white p-[5px] shadow-md"
                    onClick={() => handleDeleteFile(e.id, false)}
                  >
                    <CloseIconPreview width={12} height={12} />
                  </div>
                )}
              </div>
            ))}
            {selectFile.map((file: File, index: number) => (
              <div
                key={`comemnt-${index}`}
                className={`relative bg-cover bg-no-repeat`}
              >
                <Image
                  width={100}
                  height={100}
                  src={URL.createObjectURL(file)}
                  loading="eager"
                  blurDataURL={BlankAvatarImage.src}
                  objectFit="contain"
                  onClick={() => setImageSrc(URL.createObjectURL(file))}
                  priority={true}
                  alt="file"
                ></Image>
                {isEdit && (
                  <div
                    className="absolute right-[-10px] top-[-10px] rounded-[80px] bg-white p-[5px] shadow-md"
                    onClick={() => {
                      handleDeleteFile(index, true);
                    }}
                  >
                    <CloseIconPreview width={12} height={12} />
                  </div>
                )}
              </div>
            ))}

            {!isEdit && discussionContent && (
              <div className="mb-2">
                <SappDisplayText text={discussionContent} />
              </div>
            )}

            {isEdit && (
              <div>
                <div className="relative">
                  <HookFormTextArea
                    control={control}
                    name="editData"
                    defaultValue={editValue}
                    handleKeyDown={handleKeyDown}
                    className="w-fill--available comment-scrollbar h-[40px] min-h-14 rounded-lg px-4 py-2 md:h-12 md:py-3"
                    actions={
                      <div className="flex items-center gap-x-3">
                        <SappButtonIcon
                          type="submit"
                          ishover={false}
                          disabled={isLoading}
                          className="sapp-custom-hover h-fit !min-w-1 cursor-pointer border-none bg-transparent"
                          classTitle={"!m-0"}
                        >
                          <SendComment />
                        </SappButtonIcon>
                        <div
                          className={`relative h-5 select-none hover:text-primary ${clsx({ hidden: discussionFile?.length > 0 || selectFile?.length > 0 })}`}
                        >
                          <button
                            type="button"
                            className="cursor-pointer"
                            onClick={() => fileInputRef?.current?.click()}
                          >
                            <CameraIcon />
                          </button>

                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg, image/png, image/gif"
                            onChange={(e) => handleFileChange(e)}
                            ref={fileInputRef}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    }
                  />
                </div>
                {/* </div> */}
                <SappButton
                  title=""
                  type="submit"
                  className="hidden"
                  disabled={isLoading}
                ></SappButton>
                <div className="relative right-3 top-2 w-full cursor-pointer select-none pb-2">
                  <input type="text" className="absolute w-full opacity-0" />
                </div>
              </div>
            )}

            <div className="flex gap-x-8 gap-y-1 text-sm">
              {!isEdit && rank < 1 && (
                <div
                  role="button"
                  className={`${discussion?.id === idReply ? "text-primary" : ""
                    } flex select-none items-center gap-2 font-medium hover:underline`}
                  onClick={() => {
                    handleChangeIdReply && handleChangeIdReply(discussion?.id);
                    trackGAEvent("Click Reply Comment Activity");
                  }}
                >
                  <ReplyMessageIcon /> Reply
                </div>
              )}

              {canEdit && (
                <div className="relative">
                  <div className="flex flex-row">
                    {!isEdit ? (
                      <>
                        <div
                          className="flex cursor-pointer items-center gap-2 pr-8 font-medium text-bw-1 hover:underline"
                          onClick={handleEdit}
                        >
                          <EditMessageIcon /> Edit
                        </div>
                        <div
                          className="flex cursor-pointer items-center gap-2 font-medium hover:underline"
                          onClick={handleDeleteComment}
                        >
                          <DeleteMessageIcon /> Delete
                        </div>
                      </>
                    ) : (
                      <ActionDiscussion
                        onClick={handleCancelEdit}
                        titlePrimary={"edit this comment"}
                      />
                    )}
                  </div>
                </div>
              )}
              <div className="text-gray-500 cursor-default font-normal">
                {timeAgo}
              </div>
            </div>
          </div>
        </div>
      </form>
      {isDelete && (
        <ModalDeleteComment
          isDelete={isDelete}
          setIsDelete={setIsDelete}
          onDeleteComment={onDeleteComment}
        />
      )}
    </div>
  );
}

export default DiscussionElement;
