export const convertStarsToRupees = (stars) => {
  if (typeof stars !== 'number' || stars < 0) return 0;

  const conversionRate = 4; 
  const rupees = stars / conversionRate;

  return Math.round(rupees * 100) / 100; // accurate to 2 decimal places
};
