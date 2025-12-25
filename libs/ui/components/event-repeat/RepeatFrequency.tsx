"use client";
import {
  FREQUENCY_OPTIONS,
  FREQUENCY_OPTIONS_PLURAL,
  FREQUENCY_UNITS,
  FREQUENCY_UNITS_LIMIT,
  FREQUENCY_UNITS_OBJECT,
  IRepeatUnitOption,
  IRepeatFrequency,
} from "@lms/core";
import { Input } from "antd";
import clsx from "clsx";
import { memo, useEffect, useMemo, useState } from "react";
import { HookFormSelect } from "../base";

interface IProps {
  className?: string | undefined;
  defaultValue?: IRepeatFrequency;
  onChange: (data: IRepeatFrequency) => void;
  disabled?: boolean;
}

const RepeatFrequency = ({
  className,
  defaultValue,
  onChange,
  disabled,
}: IProps) => {
  const [frequency, setFrequency] = useState<IRepeatFrequency>(
    defaultValue || {
      interval: 1,
      unit: FREQUENCY_UNITS.WEEK,
    },
  );

  const unitOptions = useMemo(
    () =>
      frequency.interval > 1 ? FREQUENCY_OPTIONS_PLURAL : FREQUENCY_OPTIONS,
    [frequency.interval],
  );

  const onNumberChange = (interval: number | null) => {
    if (interval === null || interval < FREQUENCY_UNITS_LIMIT.MIN)
      interval = FREQUENCY_UNITS_LIMIT.MIN;
    if (interval > FREQUENCY_UNITS_LIMIT.MAX[frequency.unit])
      interval = FREQUENCY_UNITS_LIMIT.MAX[frequency.unit];

    setFrequency((prev) => ({ ...prev, interval }));
  };

  const onUnitChange = (option: IRepeatUnitOption) => {
    const frequencyValue =
      frequency.interval > FREQUENCY_UNITS_LIMIT.MAX[option.value]
        ? FREQUENCY_UNITS_LIMIT.MAX[option.value]
        : frequency.interval;

    setFrequency({
      interval: frequencyValue,
      unit: option.value as keyof typeof FREQUENCY_UNITS_OBJECT,
    });
  };

  useEffect(() => {
    onChange(frequency);
  }, [frequency]);

  const handleKeyDownInterval = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const key = event.key;
    if (
      !/^\d$/.test(key) &&
      !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(key)
    ) {
      event.preventDefault();
    }
  };

  return (
    <div className={clsx("flex flex-row items-center gap-x-3", className)}>
      <Input
        type="number"
        min={FREQUENCY_UNITS_LIMIT.MIN}
        max={FREQUENCY_UNITS_LIMIT.MAX[frequency.unit]}
        defaultValue={FREQUENCY_UNITS_LIMIT.MIN}
        value={frequency.interval}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const value = Number(event.target.value);
          onNumberChange(value);
        }}
        className="flex h-[45px] min-w-[80px] max-w-[80px] rounded border-[#DCDDDD] focus:border-primary"
        name="repeat_every"
        disabled={disabled}
        onKeyDown={handleKeyDownInterval}
      />
      <HookFormSelect
        isSearchable={false}
        options={unitOptions}
        value={unitOptions.find((option) => option.value === frequency.unit)}
        onChange={onUnitChange}
        classParent="repeat-unit"
        isDisabled={disabled}
      />
    </div>
  );
};

export default memo(RepeatFrequency);
