export function calculateDensityLab(
  P1: number,
  P2: number,
  P3: number,
  gammaWater: number = 9810 // Питома вага води Н/м³
) {
  // 1. Вага тіла в повітрі: P = P1 - P2
  const P = P1 - P2;

  // 2. Вага витісненої води: Pv = P3 - P2
  const Pv = P3 - P2;

  // 3. Об'єм тіла: V = Pv / gammaWater
  const V = Pv > 0 ? Pv / gammaWater : 0;

  // 4. Питома вага тіла: gamma = P / V
  const gamma = V > 0 ? P / V : 0;

  // 5. Густина: rho = gamma / 9.81
  const rho = gamma / 9.81;

  return { P, V, gamma, rho, Pv };
}