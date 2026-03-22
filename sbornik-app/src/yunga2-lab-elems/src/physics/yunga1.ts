export function calculateDeflection(
  force: number, // Н
  length: number, // м
  d: number, // m (диаметр проволоки)
  E: number, // Па
): number {
  // Площадь поперечного сечения круглой проволоки: S = (π * d²) / 4
  const area = (Math.PI * Math.pow(d, 2)) / 4;
  
  // Формула удлинения (растяжения): ΔL = (F * L) / (E * S)
  return (force * length) / (E * area);
}
