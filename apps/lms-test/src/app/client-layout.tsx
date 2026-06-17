"use client";
import { getCountUnRead, showNotification, useFeature } from "@lms/contexts";
import { onMessageListener } from "@lms/utils";
import { useEffect } from "react";
export default function ClientLayout() {
  const { dispatch } = useFeature();
  useEffect(() => {
    onMessageListener().then((data: any) => {
      dispatch?.(showNotification());
    });
  });
  getCountUnRead;
  return null;
}
