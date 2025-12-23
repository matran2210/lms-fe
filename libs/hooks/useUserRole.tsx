import { useAppSelector, userReducer, UserType } from "@lms/contexts";
import { useMemo } from "react";

export const useUserRole = () => {
  const userType = useAppSelector(userReducer).user?.type;

  const role = useMemo(() => {
    return {
      isTeacher: userType === UserType.TEACHER,
      isStudent: userType === UserType.STUDENT,
      userType,
    };
  }, [userType]);

  return role;
};
