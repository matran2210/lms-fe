import { zodResolver } from "@hookform/resolvers/zod";
import { getMe, useAppDispatch, useAppSelector, useFeature, userReducer } from "@lms/contexts";
import { SappHookFormSelect, SappModalV2 } from "@lms/ui";
import { VALIDATE_REQUIRED } from "@lms/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { entranceTestReducer } from "@lms/contexts";

interface IProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  entrancePopupContent: any;
  setOpenTestInfo: Dispatch<SetStateAction<boolean>> | undefined;
}
const EntranceTestFillForm = ({
  open,
  setOpen,
  setOpenTestInfo,
}: IProps) => {
  const { entranceTestApi, userApi } = useFeature();
  const [listUnivers, setListUnivers] = useState<any>();
  const [listUniverPrograms, setListUniverPrograms] = useState<any>();
  const [listMajors, setListMajors] = useState<any>();
  const [listEngLevel, setListEngLevel] = useState<any>();
  const { user } = useAppSelector(userReducer);
  const schema = z.object({
    univers_id: z
      .object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
      .optional()
      .refine((data) => data?.value && data?.label, VALIDATE_REQUIRED),
    univers_program_id: z
      .object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
      .optional()
      .refine((data) => data?.value && data?.label, VALIDATE_REQUIRED),
    majors_id: z
      .object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
      .optional()
      .refine((data) => data?.value && data?.label, VALIDATE_REQUIRED),
    englishLevel_id: z
      .object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
      .optional()
      .refine((data) => data?.value && data?.label, VALIDATE_REQUIRED),
  });
  const getListUniversities = async () => {
    const res = await entranceTestApi?.getListUnivers() as any
    let optionUnivers = [];
    for (let e of res?.data) {
      optionUnivers?.push({ value: e?.id, label: e?.name });
    }
    setListUnivers(optionUnivers);
    // return res?.data?.[0]
  };
  const getListUniverPrograms = async () => {
    const res = await entranceTestApi?.getListUniversProgram() as any
    let optionUniverProgram = [];
    for (let e of res?.data) {
      optionUniverProgram?.push({ value: e?.id, label: e?.name });
    }
    setListUniverPrograms(optionUniverProgram);
    // return res?.data?.[0]
  };
  const getListMajors = async () => {
    const res = await entranceTestApi?.getListMajors() as any
    let optionMajors = [];
    for (let e of res?.data) {
      optionMajors?.push({ value: e?.id, label: e?.name });
    }
    setListMajors(optionMajors);
    // return res?.data?.[0]
  };
  const getListEngLevel = async () => {
    const res = await entranceTestApi?.getListEngLevel() as any
    let optionEngLevel = [];
    for (let e of res?.data) {
      optionEngLevel?.push({ value: e?.id, label: e?.name });
    }
    setListEngLevel(optionEngLevel);
    // return res?.data?.[0]
  };
  const { control, handleSubmit, setValue, reset } = useForm<any>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });
  useEffect(() => {
    if (open) {
      getListUniversities();
      getListEngLevel();
      getListMajors();
      getListUniverPrograms();
    }
  }, [open]);
  useEffect(() => {
    if (user && open) {
      if (user?.detail?.university) {
        setValue("univers_id", {
          value: user?.detail?.university?.id,
          label: user?.detail?.university?.name,
        });
      }
      if (user?.university_program) {
        setValue("univers_program_id", {
          value: user?.university_program?.id,
          label: user?.university_program?.name,
        });
      }
      if (user?.detail?.major) {
        setValue("majors_id", {
          value: user?.detail?.major?.id,
          label: user?.detail?.major?.name,
        });
      }
      if (user?.english_level) {
        setValue("englishLevel_id", {
          value: user?.english_level?.id,
          label: user?.english_level?.name,
        });
      }
    }
  }, [user, open]);

  const handleOnClick = () => {
    reset();
    setOpen && setOpen(false);
  };

  const { count } = useAppSelector(entranceTestReducer);
  const dispatch = useAppDispatch();

  const onSubmit = async (dataValue: any) => {
    const res = await entranceTestApi?.putLevel({
      university_program_id: dataValue?.univers_program_id?.value,
      major_id: dataValue?.majors_id?.value,
      english_level_id: dataValue?.englishLevel_id?.value,
      university_id: dataValue?.univers_id?.value,
    }) as any

    if (res?.success) {
      await dispatch(getMe(userApi)).unwrap();
    }

    if (count > 1) {
      setOpenTestInfo && setOpenTestInfo(true);
      setOpen(true);
      // router.push({
      //   pathname: `/test/${entrancePopupContent?.id}`,
      //   query: {
      //     type: 'entrance',
      //   },
      // })
    }

    if (count === 1) {
      setOpenTestInfo && setOpenTestInfo(true);
    }
  };

  return (
    <SappModalV2
      open={open}
      cancelButtonCaption="Cancel"
      okButtonCaption={count > 0 ? "Next" : "Start"}
      handleCancel={handleOnClick}
      onOk={handleSubmit(onSubmit)}
      showHeader={false}
      footerButtonClassName="justify-between flex"
      position="center"
      buttonSize="medium"
      scrollbale={false}
      closeAfterSubmit={false}
      title={undefined}
    >
      <h2 className="mb-4 max-w-screen-sm text-4xl font-bold text-[#050505]">
        Fill This Form
      </h2>
      <div className="text-sm text-[#A1A1A1]">
        The information below will help SAPP evaluate your profile and suggest a
        suitable learning path. Click &apos;Next&apos; to see the test details.
      </div>
      <div className="mt-10">
        <SappHookFormSelect
          control={control}
          name="univers_id"
          label="University"
          required
          placeholder="Select one option"
          options={listUnivers}
        />
      </div>
      <div className="mt-10 flex gap-6">
        <div className="flex-1">
          <SappHookFormSelect
            control={control}
            name="univers_program_id"
            label="Program"
            required
            placeholder="Select one option"
            options={listUniverPrograms}
          />
        </div>
        <div className="flex-1">
          <SappHookFormSelect
            control={control}
            name="majors_id"
            label="Major"
            required
            placeholder="Select one option"
            options={listMajors}
          />
        </div>
      </div>
      <div className="mb-10 mt-10">
        <SappHookFormSelect
          control={control}
          name="englishLevel_id"
          label="English Level"
          required
          placeholder="Select one option"
          options={listEngLevel}
        />
      </div>
    </SappModalV2>
  );
};
export default EntranceTestFillForm;
