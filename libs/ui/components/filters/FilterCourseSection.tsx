import { useFeature } from "@lms/contexts";
import { DEFAULT_PAGE_SIZE, SectionField } from "@lms/core";
import { useDynamicLoading } from "@lms/hooks";
import { useInitialSections } from "@lms/hooks/course/useInitialSections";
import { useSectionData } from "@lms/hooks/course/useSectionData";
import clsx from "clsx";
import { isEmpty } from "lodash";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { SAPPSelectV2 } from "../base";

const DEFAULT_SELECT = [{ label: "All Section", value: "" }];

interface FilterCourseSectionProps {
  setParams: Dispatch<SetStateAction<string>>;
  heightCustom?: string;
  isPageStateVariables?: boolean;
  allowClear?: boolean;
  showOnlySection?: boolean;
  setDirection: Dispatch<SetStateAction<1 | -1>>;
}

const FilterCourseSection = ({
  setParams,
  heightCustom,
  isPageStateVariables,
  allowClear = false,
  showOnlySection = false,
  setDirection,
}: FilterCourseSectionProps) => {
  const { control, watch, setValue } = useFormContext();
  const {courseApi} = useFeature();
  const selectedSection = watch("section");
  const selectedSubsection = watch("subsection");
  const selectedUnit = watch("unit");
  const selectedActivity = watch("activity");

  const { sections, fetchInitialSections } = useInitialSections(courseApi);
  const { sections: subSections, fetchSections: fetchSubsections } =
    useSectionData(showOnlySection ? null : selectedSection, "CHAPTER", courseApi);
  const { sections: units, fetchSections: fetchUnits } = useSectionData(
    showOnlySection ? null : selectedSubsection,
    "UNIT",
    courseApi,
  );
  const { sections: activities, fetchSections: fetchActivities } =
    useSectionData(showOnlySection ? null : selectedUnit, "ACTIVITY", courseApi);

  const resetFormFields = useCallback(
    (fields: SectionField[]) => {
      fields.forEach((field) => setValue(field, null));
    },
    [setValue],
  );

  const handleDropdownChange = useCallback(
    (
      fieldName: SectionField,
      selected: string | null,
      fieldsToReset: SectionField[],
    ) => {
      setValue(fieldName, selected);
      resetFormFields(fieldsToReset);
    },
    [setValue, resetFormFields],
  );

  useEffect(() => {
    if (!showOnlySection && !selectedSection) {
      resetFormFields(["subsection", "unit", "activity"]);
    }
  }, [selectedSection, showOnlySection, resetFormFields]);

  useEffect(() => {
    if (isEmpty(sections)) {
      fetchInitialSections(DEFAULT_PAGE_SIZE);
    }
  }, [sections]);

  useEffect(() => {
    if (!showOnlySection && !isEmpty(selectedSection)) {
      fetchSubsections(DEFAULT_PAGE_SIZE);
    }
  }, [selectedSection, showOnlySection]);

  useEffect(() => {
    if (!showOnlySection && !isEmpty(selectedSubsection)) {
      fetchUnits(DEFAULT_PAGE_SIZE);
    }
  }, [selectedSubsection, showOnlySection]);

  useEffect(() => {
    if (!showOnlySection && !isEmpty(selectedUnit)) {
      fetchActivities(DEFAULT_PAGE_SIZE);
    }
  }, [selectedUnit, showOnlySection]);

  useEffect(() => {
    const next = showOnlySection
      ? selectedSection || ""
      : selectedActivity ||
        selectedUnit ||
        selectedSubsection ||
        selectedSection ||
        "";

    setParams((prev) => (prev === next ? prev : next));
  }, [
    selectedActivity,
    selectedUnit,
    selectedSubsection,
    selectedSection,
    showOnlySection,
    setParams,
  ]);

  const {
    handleMenuScrollToBottom: handleMenuScrollToSections,
    setPage: setPageSection,
  } = useDynamicLoading(fetchInitialSections, DEFAULT_PAGE_SIZE);

  const {
    handleMenuScrollToBottom: handleMenuScrollToSubsections,
    setPage: setPageSubsection,
  } = useDynamicLoading(
    showOnlySection ? () => {} : fetchSubsections,
    DEFAULT_PAGE_SIZE,
  );

  const {
    handleMenuScrollToBottom: handleMenuScrollToUnit,
    setPage: setPageUnit,
  } = useDynamicLoading(
    showOnlySection ? () => {} : fetchUnits,
    DEFAULT_PAGE_SIZE,
  );

  const {
    handleMenuScrollToBottom: handleMenuScrollToActivity,
    setPage: setPageActivity,
  } = useDynamicLoading(
    showOnlySection ? () => {} : fetchActivities,
    DEFAULT_PAGE_SIZE,
  );

  useEffect(() => {
    if (isPageStateVariables) {
      if (showOnlySection) {
        setPageSection(DEFAULT_PAGE_SIZE * 2);
      } else {
        const pageStateVariables = [
          setPageSection,
          setPageSubsection,
          setPageUnit,
          setPageActivity,
        ];
        pageStateVariables.forEach((setPageVariable) => {
          setPageVariable(DEFAULT_PAGE_SIZE * 2);
        });
      }
    }
  }, [
    isPageStateVariables,
    showOnlySection,
    setPageSection,
    setPageSubsection,
    setPageUnit,
    setPageActivity,
  ]);

  return (
    <div
      className={clsx(
        showOnlySection ? "w-full" : "grid w-full grid-cols-4",
        !showOnlySection && (heightCustom ? "gap-2" : "gap-4"),
      )}
    >
      <SAPPSelectV2
        control={control}
        name="section"
        placeholder="Section"
        options={DEFAULT_SELECT.concat(
          sections?.map((section) => ({
            label: section.name,
            value: section.id,
          })),
        )}
        onChange={(selected) => {
          setDirection(1);
          showOnlySection
            ? setValue("section", selected)
            : handleDropdownChange("section", selected, [
                "subsection",
                "unit",
                "activity",
              ]);
        }}
        heightCustom={heightCustom}
        onMenuScrollToBottom={handleMenuScrollToSections}
        allowClear={allowClear}
      />
      {!showOnlySection && (
        <>
          <SAPPSelectV2
            control={control}
            name="subsection"
            placeholder="Subsection"
            options={
              selectedSection
                ? subSections?.map((s) => ({ label: s.name, value: s.id }))
                : []
            }
            onChange={(selected) =>
              handleDropdownChange("subsection", selected, ["unit", "activity"])
            }
            allowClear={allowClear}
            onMenuScrollToBottom={handleMenuScrollToSubsections}
            disabled={!selectedSection}
            heightCustom={heightCustom}
          />
          <SAPPSelectV2
            control={control}
            name="unit"
            placeholder="Unit"
            options={
              selectedSubsection
                ? units?.map((u) => ({ label: u.name, value: u.id }))
                : []
            }
            onChange={(selected) =>
              handleDropdownChange("unit", selected, ["activity"])
            }
            onMenuScrollToBottom={handleMenuScrollToUnit}
            disabled={!selectedSubsection}
            heightCustom={heightCustom}
            allowClear={allowClear}
          />
          <SAPPSelectV2
            control={control}
            name="activity"
            placeholder="Activity"
            options={
              selectedUnit
                ? activities?.map((a) => ({ label: a.name, value: a.id }))
                : []
            }
            onChange={(selected) =>
              handleDropdownChange("activity", selected, [])
            }
            onMenuScrollToBottom={handleMenuScrollToActivity}
            disabled={!selectedUnit}
            heightCustom={heightCustom}
            allowClear={allowClear}
          />
        </>
      )}
    </div>
  );
};

export default FilterCourseSection;
