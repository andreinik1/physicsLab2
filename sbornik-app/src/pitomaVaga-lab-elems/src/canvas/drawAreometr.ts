export function drawAreometer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: "P1" | "P2" | "P3"
) {
  ctx.clearRect(0, 0, width, height);
  const centerX = width / 2;
  const waterLevel = height * 0.5;

  // 1. Вода
  ctx.fillStyle = "#e0f2fe";
  ctx.fillRect(0, waterLevel, width, height * 0.5);

  // 2. Стеклянная колба (Ареометр)
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2;
  
  // Основное тело (эллипс)
  ctx.beginPath();
  ctx.ellipse(centerX, waterLevel + 70, 35, 55, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(203, 213, 225, 0.6)";
  ctx.fill();
  ctx.stroke();

  // Трубка
  ctx.fillStyle = "rgba(203, 213, 225, 0.8)";
  ctx.fillRect(centerX - 6, waterLevel - 80, 12, 110);
  ctx.strokeRect(centerX - 6, waterLevel - 80, 12, 110);

  // 3. Риска "m" (Красная линия ровно по воде)
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - 15, waterLevel);
  ctx.lineTo(centerX + 15, waterLevel);
  ctx.stroke();
  ctx.fillStyle = "red";
  ctx.font = "bold 14px Arial";
  ctx.fillText("m", centerX + 20, waterLevel + 5);

  // 4. Чашки (Верхняя и нижняя)
  ctx.fillStyle = "#334155";
  ctx.fillRect(centerX - 30, waterLevel - 85, 60, 6); // Верхняя
  ctx.fillRect(centerX - 20, waterLevel + 125, 40, 6); // Нижняя

  // 5. Грузы и Тело
  ctx.fillStyle = "#f59e0b"; // Оранжевый для гирек
  if (state === "P1") {
    // Только гирьки P1 сверху
    ctx.fillRect(centerX - 15, waterLevel - 100, 10, 15);
    ctx.fillRect(centerX + 5, waterLevel - 100, 10, 15);
  } else if (state === "P2") {
    // Тело (серый шар) + гирьки P2
    ctx.fillStyle = "#64748b";
    ctx.beginPath();
    ctx.arc(centerX, waterLevel - 100, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(centerX - 25, waterLevel - 95, 8, 10);
  } else if (state === "P3") {
    // Тело ВНУТРИ (снизу) + гирьки P3 сверху
    ctx.fillStyle = "#64748b";
    ctx.beginPath();
    ctx.arc(centerX, waterLevel + 145, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(centerX - 10, waterLevel - 105, 20, 20);
  }
}