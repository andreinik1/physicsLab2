import { calculateTheta } from './pendulum';

export interface ThetaPoint {
  t: number;
  theta: number;
}

export function simulateThetaOverTime(
  length: number,
  theta0: number,
  duration: number,
  step: number
): ThetaPoint[] {
  const data: ThetaPoint[] = [];

  for (let t = 0; t <= duration; t += step) {
    data.push({
      t,
      theta: calculateTheta(t, length, theta0),
    });
  }

  return data;
}