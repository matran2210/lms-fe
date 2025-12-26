"use client";
import React, { useEffect, Dispatch, SetStateAction } from "react";
import { CourseSearchIcon } from "@lms/assets";
import { Controller, useFormContext } from "react-hook-form";
import { useFeature } from "@lms/contexts";

interface IProps {
  placeholder: string;
  formStyle: string;
  disabled?: boolean;
  inputRef?: React.MutableRefObject<HTMLInputElement | null>;
  setIsFocused?: Dispatch<SetStateAction<boolean>>;
  isFocused?: boolean;
  handleSubmit?: () => void;
  isCoursePage?: boolean;
  isTeacher?: boolean;
  redirectLink: string;
  control: any;
}

const SearchForm = ({
  placeholder,
  formStyle,
  disabled,
  inputRef,
  setIsFocused,
  isFocused,
  handleSubmit,
  isCoursePage,
  isTeacher = false,
  redirectLink,
  control,
}: IProps) => {
  const { query, router } = useFeature();
  const { watch, setValue } = useFormContext();

  useEffect(() => {
    if (!isTeacher) {
      // if (!isFocused && watch('name')?.trim()?.length) {
      //   handleSubmit?.()
      // }
      if (!isFocused && !watch("name")?.trim()?.length && isCoursePage) {
        // push(PageLink.COURSES);
        router.push(redirectLink);
      }
    }
  }, [isFocused, watch("name"), isCoursePage]);

  useEffect(() => {
    setValue("name", query?.name ?? "");
  }, [query?.name]);

  return (
    <form
      className={formStyle}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit?.();
      }}
    >
      <button type="submit" className="flex">
        <CourseSearchIcon />
      </button>
      <Controller
        control={control}
        name="name"
        defaultValue={query.name ?? ""}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            ref={(el) => {
              field.ref(el); // ← để react-hook-form hoạt động
              if (inputRef) inputRef.current = el;
            }}
            disabled={disabled}
            placeholder={placeholder}
            className="h-5 w-full border-0 text-sm font-normal placeholder:text-gray-400 
            focus:border-0 focus:outline-0 focus:ring-0 md:h-6 md:px-4 md:text-base"
            onFocus={() => setIsFocused?.(true)}
            onBlur={() => setIsFocused?.(false)}
          />
        )}
      />
    </form>
  );
};

export default SearchForm;
