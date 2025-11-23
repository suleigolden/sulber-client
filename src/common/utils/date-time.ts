import moment from "moment-timezone";

const convertToUserTimezone = (date: string) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return moment(date).tz(userTimezone);
};

export const formatDateToString = (date: string | Date, isTime?: boolean): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isTime 
    ? dateObj.toLocaleString() 
    : dateObj.toLocaleDateString();
};

export const formatDateToStringWithTime = (date: string) => {
  return convertToUserTimezone(date).format("MMM D, YYYY h:mm z ");
};

export const formatDateToStringWithoutTime = (date: string) => {
  return convertToUserTimezone(date).format("MMM D, YYYY");
};

export const getDaysLeft = (targetDate: string) => {
  const today = convertToUserTimezone(new Date().toISOString()).startOf("day");
  const end_date = convertToUserTimezone(targetDate).startOf("day");
  return end_date.diff(today, "days");
};

export const calculateAge = (dateOfBirth: string): number => {
  const today = convertToUserTimezone(new Date().toISOString());
  const birthDate = convertToUserTimezone(dateOfBirth);
  let age = today.year() - birthDate.year();
  
  // Adjust age if birthday hasn't occurred this year
  if (today.dayOfYear() < birthDate.dayOfYear()) {
    age--;
  }
  
  return age;
};
