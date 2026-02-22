export function drawPendulum(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  length: number,
  theta: number,
  isMeasuringPeriod: boolean = false,
) {
  ctx.clearRect(0, 0, width, height);

  const pivotX = width / 2;
  const pivotY = 50;
  const scale = 200;
  const L = length * scale;

  const x = pivotX + L * Math.sin(theta);
  const y = pivotY + L * Math.cos(theta);

  // Центральна лінія
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(pivotX, pivotY + L + 20);
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.setLineDash([6, 6]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Траєкторія (Червона при замірі)
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, L, Math.PI / 2 - 1, Math.PI / 2 + 1);
  ctx.strokeStyle = isMeasuringPeriod
    ? "rgba(255, 0, 0, 0.8)"
    : "rgba(25, 118, 210, 0.3)";
  ctx.lineWidth = isMeasuringPeriod ? 3 : 2;
  ctx.stroke();

  // Нитка
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Вантаж
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.fillStyle = isMeasuringPeriod ? "#ff0000" : "#1976d2";
  ctx.fill();
}
