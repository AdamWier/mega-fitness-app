export const getTotal = (nutrient: string) => (
  accumulator: number,
  currentValue: { [key: string]: any }
): number => accumulator + currentValue[nutrient];
