import { SAPPSelectV2 } from "@lms/ui";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { DefaultOptionType } from "antd/es/select";
import { useTailwindBreakpoint } from "@lms/hooks";
import { CheckIconV2, FilterCourseIcon } from "@lms/assets";
import { SappDrawerV3 } from "@lms/ui";
import { Button, Divider } from "antd";
import clsx from "clsx";
import { ButtonPrimary } from "@lms/ui";
import { useFeature } from "@lms/contexts";
import { buildQueryString } from "@lms/utils";

interface IFilters {
  [name: string]: React.Key | null | undefined;
}
const FilterCourse = ({
  totalResult,
  listFilter,
}: {
  totalResult: number;
  listFilter: {
    name: string;
    placeholder: string;
    options: DefaultOptionType[];
  }[];
}) => {
  const { control, setValue, reset} = useForm()
  const {router, query, pathname} = useFeature()
  const { isMobileView } = useTailwindBreakpoint()
  const [openMobileFilter, setOpenMobileFilter] = useState(false)
  const [filters, setFilters] = useState<IFilters>()
  const filterValues = useWatch({ control })

  const onOpenMobileFilter = () => {
    setOpenMobileFilter(true);
  };
  const onCloseMobileFilter = () => {
    setOpenMobileFilter(false);
  };

  const handleSelect = (option: DefaultOptionType, name: string) => {
    // Neu value ton tai thi xoa
    if (filters?.[name] === option.value) {
      delete filters?.[name];
      // setFilters({ ...filters })
    } else {
      // Neu value khong ton tai thi them vao
      setFilters({
        ...filters,
        [name]: option.value,
      });
    }
  };
  const onConfirm = () => {
    reset(filters);
    onCloseMobileFilter();
  };
  useEffect(() => {
    const currentQuery = { ...query };

    listFilter?.forEach((filter) => {
      const val = filterValues?.[filter.name];
      if (val) {
        currentQuery[filter.name] = val.value ?? val;
      } else {
        delete currentQuery[filter.name];
      }
    });

    router.replace(`${pathname}?${buildQueryString(currentQuery)}`);
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
        <div
          className="flex shrink-0 items-center gap-4"
          data-guide-id="filter-courses"
        >
          <div className="shrink-0 text-sm font-normal text-gray-800">
            {totalResult} Results
          </div>
          <div className="flex gap-2">
            {listFilter?.map((item, index) => (
              <SAPPSelectV2
                key={index}
                control={control}
                name={item.name}
                placeholder={item.placeholder}
                required
                onChange={(e) => setValue(item.name, e)}
                options={item.options ?? []}
                className="min-w-36"
                heightCustom="h-10"
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
                          key={el.id}
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

export default FilterCourse;
