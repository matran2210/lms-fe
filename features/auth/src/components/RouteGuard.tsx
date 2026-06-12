import { getMe, useFeature, userReducer } from "@lms/contexts";
import { COOKIE_INFO } from "@lms/core";
import { SappLoadingGlobal } from "@lms/ui";
import { setCookie } from "@lms/utils";
import { useEffect, useMemo, useState } from "react";

interface IProps {
  children: JSX.Element;
}

export const RouteGuard = ({ children }: IProps) => {
  const { userContextApi, dispatch, useAppSelector, pathname } = useFeature();

  const [authorized, setAuthorized] = useState(false);
  const userSlice = useAppSelector?.(userReducer);

  const checkRouteCertificate = useMemo(() => {
    const path = pathname as string;

    return (
      /^\/entrance-test\/test-result\/[^/]+$/.test(path) ||
      /^\/entrance-test\/table-result\/[^/]+$/.test(path) ||
      /^\/certificates\/[^/]+$/.test(path)
    );
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;

    callGetMe().finally(() => {
      if (!cancelled) {
        setAuthorized(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    pathname,
    userSlice?.user.id,
    userSlice?.user.keycloak_user_id,
    checkRouteCertificate,
  ]);

  const callGetMe = async () => {
    if (
      userSlice?.user.id ||
      userSlice?.user.keycloak_user_id ||
      checkRouteCertificate
    ) {
      setCookie(
        COOKIE_INFO.KEYCLOAK_USER_ID,
        userSlice?.user.keycloak_user_id ?? "",
      );
      return;
    }

    setAuthorized(false);
    await dispatch?.(getMe(userContextApi)).unwrap();
  };

  return authorized ? (
    children
  ) : (
    <SappLoadingGlobal loading>
      <></>
    </SappLoadingGlobal>
  );
};
