import clsx from "clsx";
import { uniqueId } from "lodash";
import { Control, Controller } from "react-hook-form";
import SAPPRadio from "./SAPPRadio";
import { ErrorMessage } from "../../common";
// import './HookFormRadioGroup.scss'

interface IHookFormRadioGroupProps {
  name: string;
  control: Control<any>;
  defaultValue?: unknown;
  options: Array<{
    label?: string;
    value: string | boolean;
    description?: string;
    disabled?: boolean;
  }>;
  direction?: "horizontal" | "vertical";
  separator?: boolean;
  justify?: "between" | "start" | "center" | "end";
  gap?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  labelClass?: string;
  labelClassChecked?: string;
  optionClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  corrects?: { [key: string]: boolean };
}

const HookFormRadioGroup = ({
  name,
  control,
  defaultValue,
  options,
  direction,
  separator,
  gap,
  onChange,
  justify = "between",
  labelClass = "",
  labelClassChecked = "",
  optionClassName = "",
  disabled,
  readOnly,
  corrects,
}: IHookFormRadioGroupProps) => {
  const count_items = options?.length - 1;
  gap = gap ? gap : direction === "horizontal" ? "gap-6" : "gap-4";
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => {
        return (
          <>
            <div
              className={
                (direction === "horizontal"
                  ? "_horizontal flex flex-wrap"
                  : "_vertical flex flex-col") +
                ` ${gap} ` +
                ` ${
                  justify === "between"
                    ? "justify-between"
                    : justify == "center"
                      ? "justify-center"
                      : justify === "start"
                        ? "justify-start"
                        : "justify-end"
                }`
              }
            >
              {options.map((option, index) => {
                let state: "error" | "default" | "success" | undefined;
                let stateLabel = "";
                const checked: boolean = option.value.toString() === field.value;
                const correctCheck: boolean =
                  corrects?.[option.value as string] || false;
                if (corrects) {
                  if (corrects?.[option.value as string]) {
                    state = "success";
                    stateLabel = "text-success-600";
                  } else if (checked) {
                    state = "error";
                    stateLabel = "text-error";
                  }
                }

                return (
                  <div
                    key={uniqueId("check")}
                    className={`${!!corrects && "pointer-events-none"}`}
                  >
                    <div className="flex flex-row">
                      <label
                        className={`flex flex-row items-start gap-3 ${
                          (
                            option.disabled !== undefined
                              ? option.disabled
                              : disabled
                          )
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer"
                        }`}
                      >
                        <SAPPRadio
                          name={field.name}
                          disabled={
                            option.disabled !== undefined
                              ? option.disabled
                              : disabled
                          }
                          readOnly={readOnly}
                          onChange={(e) => {
                            onChange && onChange(e);
                            field.onChange(e.target.value);
                          }}
                          key={index}
                          value={option.value.toString()}
                          checked={checked}
                          className="mt-[3px] flex-none"
                          state={state}
                        />
                        <span className="flex-1">
                          <div
                            className={`${
                              option.value === field.value
                                ? ` ${stateLabel} ${
                                    labelClassChecked ? labelClassChecked : ""
                                  }`
                                : ` ${stateLabel} ${
                                    labelClass ? labelClass : ""
                                  }`
                            } fw-bold flex-1 text-base`}
                          >
                            <span
                              className={clsx({
                                "mr-3": checked && !!corrects,
                              })}
                            >
                              {option.label}
                            </span>
                            {/* <YourAnswer
                              show={checked && !!corrects}
                              className="bg-purple-2 text-state-info max-h-6 !rounded !text-sm"
                            /> */}
                          </div>
                          {option.description && (
                            <div className="text-sm text-[#6b7280]">
                              {option.description}
                            </div>
                          )}
                        </span>
                      </label>
                    </div>
                    {false &&
                      index !== count_items &&
                      (separator === undefined || separator === true) && (
                        <div className="separator separator-dashed my-5"></div>
                      )}
                  </div>
                );
              })}
            </div>
            <ErrorMessage>{error?.message}</ErrorMessage>
          </>
        );
      }}
    />
  );
};

export default HookFormRadioGroup;
