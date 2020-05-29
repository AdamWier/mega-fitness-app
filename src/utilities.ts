export const getTotal = (nutrient: string): CallableFunction => (
  accumulator: number,
  currentValue: { [key: string]: any }
): number => accumulator + currentValue[nutrient];
