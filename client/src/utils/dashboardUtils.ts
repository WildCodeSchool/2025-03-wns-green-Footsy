export const formatCo2 = (co2Kg: number) => {
  if (!Number.isFinite(co2Kg)) return "0 kg CO2e";

  if (co2Kg >= 1000) {
    const tonnes = co2Kg / 1000;
    return `${new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 1,
    }).format(tonnes)} t CO2e`;
  }

  return `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(co2Kg)} kg CO2e`;
};
