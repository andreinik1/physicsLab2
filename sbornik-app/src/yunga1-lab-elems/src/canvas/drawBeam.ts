// canvas/drawBeam.ts

export function drawBeam(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  deflection: number,
  force: number
) {
  ctx.clearRect(0, 0, width, height);

  const left = width * 0.15;
  const right = width * 0.85;
  const mid = (left + right) / 2;
  const baseY = height / 2;

  const scale = 5000; // усиление прогиба
  const f = deflection * scale;

  // Опоры
  ctx.fillStyle = "#555";
  ctx.fillRect(left - 12, baseY, 24, 40);
  ctx.fillRect(right - 12, baseY, 24, 40);

  // Стержень (парабола)
  ctx.beginPath();
  ctx.moveTo(left, baseY);

  for (let x = left; x <= right; x += 5) {
    const t = (x - left) / (right - left);
    const y = baseY + f * 4 * t * (1 - t);
    ctx.lineTo(x, y);
  }

  ctx.strokeStyle = "#1976d2";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Нагрузка
  ctx.beginPath();
  ctx.moveTo(mid, baseY - 40);
  ctx.lineTo(mid, baseY);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "red";
  ctx.fillText(`F = ${force} Н`, mid - 30, baseY - 50);

  // Прогиб
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(mid, baseY);
  ctx.lineTo(mid, baseY + f);
  ctx.strokeStyle = "#000";
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#000";
  ctx.fillText("f", mid + 5, baseY + f / 2);
}