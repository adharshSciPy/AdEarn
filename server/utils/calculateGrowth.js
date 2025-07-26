export const calculateGrowth = (periodValue, totalValue) => {
  let growth = 0;
  let status = "No Change";

  if (totalValue === 0) {
    growth = 0;
    status = "No Data";
  } else {
    growth = (periodValue / totalValue) * 100;
    growth = parseFloat(growth.toFixed(2));

    if (growth > 0) status = "Growing";
    else status = "No Change";
  }

  return {
    growth,   
    status,
  };
};
