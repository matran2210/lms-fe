"use client";
import { getCountUnRead, showNotification, useFeature } from "@lms/contexts";
import { onMessageListener } from "@lms/utils";
import { useEffect, useMemo } from "react";
export default function ClientLayout() {
  const { dispatch, pathname } = useFeature();
  const checkRouteCertificate = useMemo(() => {
    const path = pathname as string;

    return (
      /^\/entrance-test\/test-result\/[^/]+$/.test(path) ||
      /^\/entrance-test\/table-result\/[^/]+$/.test(path) ||
      /^\/certificates\/[^/]+$/.test(path)
    );
  }, [pathname]);
  useEffect(() => {
    onMessageListener().then((data: any) => {
      dispatch?.(showNotification());
    });
  });
  getCountUnRead;
  return null;
}
