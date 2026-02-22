import { GRAVITY } from './constants';

// θ(t) = θ₀ cos(√(g / l) t)
export function calculateTheta(
  time: number,
  length: number,
  theta0: number,
  g = GRAVITY
): number {
  return theta0 * Math.cos(Math.sqrt(g / length) * time);
}