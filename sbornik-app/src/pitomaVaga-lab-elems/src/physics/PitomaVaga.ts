export function calculateDensityLab(
  P1: number,
  P2: number,
  P3: number,
  gammaWater: number = 9810 
) {
  const P = P1 - P2;
  const Pb = P3 - P2;
  const V = Pb > 0 ? Pb / gammaWater : 0;
  const gamma = V > 0 ? P / V : 0;
  const rho = gamma / 9.81;

  return { P, V, gamma, rho, Pb };
}