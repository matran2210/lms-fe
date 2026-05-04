import { zodResolver } from "@hookform/resolvers/zod";
import { CloseIconNote, SaveIcon } from "@lms/assets";
import { closeNote, useFeature } from "@lms/contexts";
import { useTailwindBreakpoint } from "@lms/hooks";
import { ButtonSecondary, HookFormTextArea, ModalResizeableNew } from "@lms/ui";
import { VALIDATE_REQUIRED } from "@lms/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface IProps {
  id: string | undefined;
  content: string;
  uuid: string | number;
  count: number;
  onFocusingPad: string;
  setOnFocusingPad: React.Dispatch<React.SetStateAction<string>>;
}

const CreateNote = ({ id, content, uuid, count, onFocusingPad, setOnFocusingPad}: IProps) => {
  const { courseApi, router, dispatch, params } = useFeature();

  const [activeSectionId, setActiveSectionId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { isMobileView } = useTailwindBreakpoint();

  const activityId = params?.activityId
  const validationSchema = z.object({
    [`description_${id ? id : uuid}`]: z
      .string()
      .trim()
      .min(1, VALIDATE_REQUIRED),
  });

  const { control, handleSubmit, watch, reset } = useForm<any>({
    resolver: zodResolver(validationSchema),
    mode: "onSubmit",
    defaultValues: {
      [`description_${id ? id : uuid}`]: content,
    },
  });

  const [baselineContent, setBaselineContent] = useState<string>(content);
  const watchDescription = watch(`description_${id ? id : uuid}`);
  const isChanged = watchDescription !== baselineContent;

  const createNewNote = async (data: any) => {
    try {
      setLoading(true);
      const params = {
        course_section_id: activityId,
        name: "Note",
        description: data?.[`description_${id ? id : uuid}`],
      };
      const res = (await courseApi.createNote(params)) as {
        data: { id: string };
      };
      setActiveSectionId(res?.data?.id);
      // Cập nhật baseline để lần gõ tiếp theo hiển thị nút Save chính xác
      const savedValue = data?.[`description_${id ? id : uuid}`] || "";
      setBaselineContent(savedValue);
      reset(
        { [`description_${id ? id : uuid}`]: savedValue },
        { keepDirty: false },
      );
      toast.success("Tạo thành công!");
    } catch (error) {
      toast.error("Tạo không thành công!");
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (data: any) => {
    try {
      setLoading(true);
      const params = {
        name: "Note",
        description: data?.[`description_${id ? id : uuid}`],
      };
      await courseApi.updateCourseNotesList(id || activeSectionId, params);
      // Cập nhật baseline sau khi lưu để theo dõi thay đổi mới
      const savedValue = data?.[`description_${id ? id : uuid}`] || "";
      setBaselineContent(savedValue);
      reset(
        { [`description_${id ? id : uuid}`]: savedValue },
        { keepDirty: false },
      );
      toast.success("Cập nhật thành công!");
    } catch (error) {
      toast.error("Cập nhật không thành công!");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    id || activeSectionId ? updateNote(data) : createNewNote(data);
  };

  const removeNote = () => {
    dispatch?.(closeNote(uuid));
  };

  return (
    <>
      <ModalResizeableNew
        bodyClassName="h-[calc(100%-6px)]"
        modalIndex={count}
        header={({ requestClose }) => (
          <div className="modal-header modal-dragger flex w-full cursor-move items-center justify-between rounded-t-xl bg-gray-100 px-4 py-3">
            <div className="text-sm font-semibold text-gray-800">
              {id || activeSectionId ? "Edit Note" : "New Note"}
            </div>
            <button
              className="text-icon"
              onClick={(e) => {
                e.stopPropagation();
                requestClose();
                setTimeout(() => removeNote(), 300);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                requestClose();
                setTimeout(() => removeNote(), 300);
              }}
              disabled={loading}
            >
              <CloseIconNote />
            </button>
          </div>
        )}
        onClose={() => {
          removeNote();
        }}
        position="center"
        width={isMobileView ? 340 : 412}
        height={350}
        isInBody
        isTopModal={onFocusingPad === (id ? id : uuid)}
        onModalFocus={() => setOnFocusingPad((id ? id : uuid) as string)}
      >
        <div className="flex h-full flex-col p-4">
          <HookFormTextArea
            placeholder="Take a note..."
            control={control}
            name={`description_${id ? id : uuid}`}
            defaultValue={content}
            className="not-resizer sapp-text-area h-[calc(100%-8px)] w-full flex-1 whitespace-pre-wrap placeholder:text-sm placeholder:font-normal placeholder:text-[#A1A1A1]"
          />
          {isChanged && (
            <div className="flex justify-end">
              <ButtonSecondary
                data-aos="fade-in"
                onClick={() => {
                  handleSubmit((data: any) => {
                    onSubmit(data);
                  })();
                }}
                disabled={loading}
                startIcon={<SaveIcon />}
              >
                Save
              </ButtonSecondary>
            </div>
          )}
        </div>
      </ModalResizeableNew>
    </>
  );
};

export default CreateNote;
