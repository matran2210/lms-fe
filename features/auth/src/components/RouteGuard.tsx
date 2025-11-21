import { CERTIFICATE_DETAIL } from "@lms/core";
import { setCookie } from "@lms/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  COOKIE_INFO,
  ENTRANCE_TEST_RESULT,
  ENTRANCE_TEST_TABLE_RESULT,
} from "@lms/core";
import { useAppDispatch, useAppSelector, getMe, userReducer, IUserAPI } from "@lms/contexts";

interface IProps {
  children: JSX.Element;
  api: IUserAPI
}

export const RouteGuard = ({ children, api }: IProps) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const dispatch = useAppDispatch();
  const userSlice = useAppSelector(userReducer);
  // First useEffect for getMe
  useEffect(() => {
    callGetMe();
  }, [router.pathname, userSlice.user.keycloak_user_id]);

  const callGetMe = async () => {
    if (
      userSlice.user.id ||
      userSlice.user.keycloak_user_id ||
      [
        CERTIFICATE_DETAIL,
        ENTRANCE_TEST_RESULT,
        ENTRANCE_TEST_TABLE_RESULT,
      ].includes(router.pathname)
    ) {
      setAuthorized(true);
      setCookie(
        COOKIE_INFO.KEYCLOAK_USER_ID,
        userSlice.user.keycloak_user_id ?? "",
      );
      return;
    }

    try {
      await dispatch(getMe(api)).unwrap();
      setAuthorized(true);
    } catch (error) {}
  };

  return authorized ? children : <></>;
};
