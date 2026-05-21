export const getDaysBetweenDates = (from, to) => {
  if (!from || !to) return 0;

  const fromDate = new Date(from);
  const toDate = new Date(to);

  const diffTime = toDate - fromDate;

  // +1 because same day = 1 day
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return diffDays > 0 ? diffDays : 0;
};
export const calculateAge = (dob, referenceDate = new Date()) => {
  if (!dob) return "";

  const birthDate = new Date(dob);
  const refDate = new Date(referenceDate);

  let age = refDate.getFullYear() - birthDate.getFullYear();

  const monthDiff = refDate.getMonth() - birthDate.getMonth();
  const dayDiff = refDate.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--; // birthday not reached yet
  }

  return age;
};
export const stripHtml = (html) => {
  if (!html) return "";

  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};
export const statusClass = (s) => s === "approved" ? "approved-active" : s === "pending" ? "approved-pending" : "approved-reject";
