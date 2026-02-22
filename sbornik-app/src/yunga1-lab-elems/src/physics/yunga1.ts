export function calculateDeflection(
  force: number, // Н
  length: number, // м
  b: number, // м
  h: number, // м
  E: number, // Па
): number {
  const I = (b * Math.pow(h, 3)) / 12;
  return (force * Math.pow(length, 3)) / (48 * E * I);
}
