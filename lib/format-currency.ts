export const formatCurrency = (currency: number) => {
  return new Intl.NumberFormat("en-Us", {
    style: "currency",
    currency: "MMK",
  }).format(currency);
};
