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

    const authorize = async () => {
      const hasUser = userSlice?.user.id || userSlice?.user.keycloak_user_id;

      if (checkRouteCertificate) {
        if (!cancelled) {
          setAuthorized(true);
        }
        return;
      }

      if (hasUser) {
        if (!cancelled) {
          setCookie(
            COOKIE_INFO.KEYCLOAK_USER_ID,
            userSlice?.user.keycloak_user_id ?? "",
          );
          setAuthorized(true);
        }
        return;
      }

      if (!dispatch || !userContextApi) {
        if (!cancelled) {
          setAuthorized(false);
        }
        return;
      }

      if (!cancelled) {
        setAuthorized(false);
      }

      try {
        await dispatch(getMe(userContextApi)).unwrap();

        if (!cancelled) {
          setAuthorized(true);
        }
      } catch {
        if (!cancelled) {
          setAuthorized(false);
        }
      }
    };

    authorize();

    return () => {
      cancelled = true;
    };
  }, [
    pathname,
    dispatch,
    userContextApi,
    userSlice?.user.id,
    userSlice?.user.keycloak_user_id,
    checkRouteCertificate,
  ]);

  return authorized ? (
    children
  ) : (
    <SappLoadingGlobal loading>
      <></>
    </SappLoadingGlobal>
  );
};
