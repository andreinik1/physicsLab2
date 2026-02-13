export function drawPendulum(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  length: number,
  theta: number,
) {
  ctx.clearRect(0, 0, width, height);

  const pivotX = width / 2;
  const pivotY = 50;
  const scale = 200;
  const L = length * scale;

  const x = pivotX + L * Math.sin(theta);
  const y = pivotY + L * Math.cos(theta);

  /* =========================
     1. Центральная линия (θ = 0)
     ========================= */
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(pivotX, pivotY + L + 20);
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 6]);
  ctx.stroke();
  ctx.setLineDash([]);

  /* =========================
     2. Траектория движения груза
     ========================= */
  ctx.beginPath();
  ctx.arc(
    pivotX,
    pivotY,
    L,
    Math.PI / 2 - Math.abs(theta),
    Math.PI / 2 + Math.abs(theta),
  );
  ctx.strokeStyle = "rgba(25, 118, 210, 0.3)";
  ctx.lineWidth = 2;
  ctx.stroke();

  /* =========================
     3. Нить
     ========================= */
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.stroke();

  /* =========================
     4. Груз
     ========================= */
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.fillStyle = "#1976d2";
  ctx.fill();

  /* =========================
     5. Точка подвеса
     ========================= */
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
}
