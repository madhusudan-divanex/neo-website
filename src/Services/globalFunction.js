export const getDaysBetweenDates = (from, to) => {
  if (!from || !to) return 0;

  const fromDate = new Date(from);
  const toDate = new Date(to);

  const diffTime = toDate - fromDate;

  // +1 because same day = 1 day
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return diffDays > 0 ? diffDays : 0;
};