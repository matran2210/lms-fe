import { getMe, useFeature, userReducer } from "@lms/contexts";
import {
  CERTIFICATE_DETAIL, COOKIE_INFO,
  ENTRANCE_TEST_RESULT,
  ENTRANCE_TEST_TABLE_RESULT
} from "@lms/core";
import { setCookie } from "@lms/utils";
import { useEffect, useMemo, useState } from "react";

interface IProps {
  children: JSX.Element;
}

export const RouteGuard = ({ children }: IProps) => {
  const { userContextApi, dispatch, useAppSelector, pathname } = useFeature();

  // Start as true so the page renders immediately on first paint.
  // We flip to false only while an async getMe call is in-flight, then back
  // to true once it resolves. This prevents a blank screen (NO_FCP) while
  // still protecting authenticated routes.
  const [authorized, setAuthorized] = useState(true);
  const userSlice = useAppSelector?.(userReducer);

  useEffect(() => {
    callGetMe();
  }, [pathname, userSlice?.user.keycloak_user_id]);

  const checkRouteCertificate = useMemo(() => {
    const path = pathname as string

    return (
      /^\/entrance-test\/test-result\/[^/]+$/.test(path) ||
      /^\/entrance-test\/table-result\/[^/]+$/.test(path) ||
      /^\/certificates\/[^/]+$/.test(path)
    )
  }, [pathname])

  const callGetMe = async () => {
    if (
      userSlice?.user.id ||
      userSlice?.user.keycloak_user_id ||
      checkRouteCertificate
    ) {
      setAuthorized(true);
      setCookie(
        COOKIE_INFO.KEYCLOAK_USER_ID,
        userSlice?.user.keycloak_user_id ?? "",
      );
      return;
    }

    await dispatch?.(getMe(userContextApi)).unwrap();
    setAuthorized(true);
  };

  return authorized ? children : <></>;
};
