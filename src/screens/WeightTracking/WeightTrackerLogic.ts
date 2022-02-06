import DayDocument from '../../Firebase/Documents/DayDocument';
interface DataPoint {
  x: number;
  y: number | undefined;
}

export interface WeightReport {
  records: DataPoint[];
  minWeight: number;
  maxWeight: number;
  averageWeight: number;
}

export const findMax = (past: number, current: number) =>
  Math.max(past, current);

export const findMin = (past: number, current: number) =>
  Math.min(past, current);

const calculateAverage = (
  accumulator: number,
  currentValue: number,
  index: number,
  array: number[]
) =>
  index === array.length - 1
    ? Math.round(((currentValue + accumulator) / array.length) * 10) / 10
    : accumulator + currentValue;

const adaptRecordsForGraph = (records: DayDocument[]): DataPoint[] =>
  records
    .filter((record) => record.weight)
    .map(({ date, weight }) => ({
      x: date.getTime(),
      y: weight,
    }));

export const createDataPoints = (records: DayDocument[]): WeightReport => {
  const weights = records
    .map((record) => record.weight)
    .filter((weight): weight is number => !!weight);

  return {
    records: adaptRecordsForGraph(records),
    minWeight: weights.reduce(findMin),
    maxWeight: weights.reduce(findMax),
    averageWeight: weights.reduce(calculateAverage),
  };
};
