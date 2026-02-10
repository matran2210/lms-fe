import { CheckIconV2, FilterCourseIcon } from "@lms/assets";
import { useFeature } from "@lms/contexts";
import { useSelectSubject, useTailwindBreakpoint } from "@lms/hooks";
import { SappDrawerV3, SAPPSelectV2 } from "@lms/ui";
import { buildQueryString } from "@lms/utils";
import { Divider } from "antd";
import { DefaultOptionType } from "antd/es/select";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

interface IFilters {
  [name: string]: React.Key | null | undefined;
}
const FilterCourseActivation = ({ totalResult }: { totalResult: number }) => {
  const PROGRAM_OPTIONS = [
    { label: "ACCA", value: "ACCA" },
    { label: "Cert/Dip", value: "Cert/Dip" },
  ];
  const { control, setValue, watch, reset } = useForm({
    defaultValues: {
      program: PROGRAM_OPTIONS[0]?.value,
      subject: null,
    },
  });
  const { router, query, pathname } = useFeature();
  const { isMobileView } = useTailwindBreakpoint();
  const [openMobileFilter, setOpenMobileFilter] = useState(false);
  const [filters, setFilters] = useState<IFilters>({});
  const filterValues = useWatch({ control });

  const onOpenMobileFilter = () => {
    setOpenMobileFilter(true);
  };
  const onCloseMobileFilter = () => {
    setOpenMobileFilter(false);
  };

  const handleSelect = (option: DefaultOptionType, name: string) => {
    setFilters((prev) => {
      const next = { ...(prev ?? {}) };
      if (next[name] === option.value) {
        delete next[name];
      } else {
        next[name] = option.value;
      }
      return next;
    });
  };

  const onConfirm = () => {
    reset(filters);
    onCloseMobileFilter();
  };
  const program = watch("program");
  const { data: dataSubjects } = useSelectSubject(program, Boolean(program));

  const listFilter = useMemo(() => {
    const subjectOptions = dataSubjects?.map((subject) => ({
      label: subject.name,
      value: subject.name,
    }));

    return [
      {
        name: "program",
        placeholder: "Program",
        options: PROGRAM_OPTIONS,
      },
      {
        name: "subject",
        placeholder: "Subject: all",
        options: subjectOptions,
      },
    ];
  }, [dataSubjects]);

  useEffect(() => {
    const currentQuery = { ...query };

    listFilter?.forEach((filter) => {
      const val = filterValues?.[filter.name as "program" | "subject"];
      if (val) {
        currentQuery[filter.name] = val;
      } else {
        delete currentQuery[filter.name];
      }
    });

    router.push(`${pathname}?${buildQueryString(currentQuery)}`);
  }, [filterValues]);

  return (
    <>
      {isMobileView ? (
        <>
          <div
            className="flex cursor-pointer items-center justify-end gap-2"
            onClick={onOpenMobileFilter}
          >
            <div>
              <FilterCourseIcon />
            </div>
            <div className="text-base font-normal text-gray-800">Filter</div>
          </div>
        </>
      ) : (
        <div className="flex shrink-0 items-center gap-4">
          <div className="shrink-0 text-sm font-normal text-gray-800">
            {totalResult} Results
          </div>
          <div className="flex gap-2">
            {listFilter?.map((item, index) => (
              <SAPPSelectV2
                isSearchable
                key={index}
                control={control}
                name={item.name}
                placeholder={item.placeholder}
                required
                onChange={(e) => {
                  setValue(item.name as "program" | "subject", e);
                  if (item.name === "program") {
                    setValue("subject", null);
                  }
                }}
                options={item.options ?? []}
                className="min-w-36"
                heightCustom="h-10"
                allowClear={item.name === "program" ? false : true}
              />
            ))}
          </div>
        </div>
      )}

      {isMobileView && (
        <SappDrawerV3
          open={openMobileFilter}
          handleCancel={onCloseMobileFilter}
          title="Filter"
          rootClassName={"responsive-drawer-base drawer-bottom-0"}
          isShowBtnClose
          closable
          classNameHeader="mb-4"
          placement="bottom"
          handleSubmit={onConfirm}
          submitButtonClassName="w-full"
          btnSubmitTile="Confirm"
          isShowFooter
        >
          <div className="flex h-full max-h-[260px] flex-col justify-between overflow-y-auto">
            {listFilter?.map((item, index) => (
              <div key={index}>
                <div>
                  <div className="mb-2 text-base font-semibold text-gray-800">
                    {item.placeholder}
                  </div>
                  <div>
                    {(item.options ?? []).map((el) => {
                      const isSelected = filters?.[item.name] === el.value;
                      const defaultSelected =
                        !filters?.[item.name] && !el.value;
                      return (
                        <div
                          key={el.value}
                          className="flex items-center justify-between py-2"
                          onClick={() => handleSelect(el, item.name)}
                        >
                          <div
                            className={clsx(
                              "text-sm text-gray-800",
                              (isSelected || defaultSelected) && "text-primary",
                            )}
                          >
                            {el.label}
                          </div>
                          <div>
                            {(isSelected || defaultSelected) && <CheckIconV2 />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {index < listFilter.length - 1 && (
                  <Divider className="my-4 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </SappDrawerV3>
      )}
    </>
  );
};

export default FilterCourseActivation;
