import React from "react";
import { DatePicker, Skeleton } from "antd";
const { RangePicker } = DatePicker;
import { Controller } from "react-hook-form";
import { IHookFormDateRangePicker } from "@lms/core";
import { ErrorMessage } from "../../common";

const HookFormDateRangePicker = ({
  name,
  control,
  defaultValue,
  className = "",
  disabled,
  skeleton,
  style,
}: IHookFormDateRangePicker) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="h-full w-full">
            {skeleton ? (
              <div className="flex items-center">
                <Skeleton.Button active shape={`default`} block size="large" />
              </div>
            ) : (
              <div>
                <RangePicker
                  {...field}
                  style={style}
                  className={className}
                  disabled={disabled}
                  allowClear
                  size="large"
                />
                {error?.message && (
                  <div>
                    <ErrorMessage>{error?.message ?? ""}</ErrorMessage>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default HookFormDateRangePicker;
