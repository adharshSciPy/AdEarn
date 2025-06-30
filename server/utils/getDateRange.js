const getDateRange = (type, value) => {
  const now = new Date();
  let startDate, endDate;

  if (type === "month") {
    startDate = new Date(now.getFullYear(), value - 1, 1);
    endDate = new Date(now.getFullYear(), value, 1);
  } else if (type === "year") {
    startDate = new Date(value, 0, 1);
    endDate = new Date(value + 1, 0, 1);
  } else if (type === "day") {
    startDate = new Date(value);
    endDate = new Date(value);
    endDate.setDate(endDate.getDate() + 1);
  }

  return { startDate, endDate };
};
export default getDateRange