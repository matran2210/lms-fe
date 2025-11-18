export const convertLocalTimeToUTC = (currentTime: Date) => {
  const offsetMinutes = currentTime.getTimezoneOffset();
  const utcTime = new Date(currentTime.getTime() + offsetMinutes * 60 * 1000);

  return utcTime;
};

export const convertUTCToLocalTime = (utc_time: Date | string) => {
  return new Date(utc_time);
};

export const convertHourToDayLeft = (hours: number) => {
  if (hours <= 0) {
    return 0;
  }

  const days = Math.ceil(hours / 24);
  return days;
};
