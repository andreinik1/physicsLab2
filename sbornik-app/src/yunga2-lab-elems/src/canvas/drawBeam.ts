export function drawBeam(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  deltaL: number,
  force: number
) {
  ctx.clearRect(0, 0, width, height);

  const baseX = width / 2; // Центрируем по горизонтали
  const startY = height * 0.1; // Верхний край (закрепление)
  
  // Коэффициент усиления для видимости растяжения
  const visualScale = 10000; 
  const visualDeltaL = deltaL * visualScale;
  
  // Базовая визуальная длина (60% высоты экрана)
  const baseVisualLength = height * 0.6;
  // Конечная точка Y = старт + база + растяжение
  const endY = startY + baseVisualLength + visualDeltaL;

  // 1. Опора (горизонтальная плита сверху)
  ctx.fillStyle = "#444";
  ctx.fillRect(baseX - 50, startY - 10, 100, 10);

  // 2. Проволока (вертикальная линия)
  ctx.beginPath();
  ctx.moveTo(baseX, startY);
  ctx.lineTo(baseX, endY);
  ctx.strokeStyle = "#1976d2";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 3. Стрелка силы (тянет вниз)
  ctx.beginPath();
  ctx.moveTo(baseX, endY);
  ctx.lineTo(baseX, endY + 30); // Линия вниз
  ctx.lineTo(baseX - 5, endY + 22); // Левое перо стрелки
  ctx.moveTo(baseX, endY + 30);
  ctx.lineTo(baseX + 5, endY + 22); // Правое перо стрелки
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "red";
  ctx.font = "14px Arial";
  ctx.fillText(`F = ${force} Н`, baseX + 15, endY + 25);

  // 4. Обозначение удлинения ΔL
  if (visualDeltaL > 1) {
    const originalEndY = startY + baseVisualLength;
    
    // Горизонтальный пунктир на уровне, где заканчивалась проволока без нагрузки
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(baseX - 20, originalEndY);
    ctx.lineTo(baseX + 20, originalEndY);
    ctx.strokeStyle = "#aaa";
    ctx.stroke();
    ctx.setLineDash([]);

    // Вертикальная линия дельты (сбоку от проволоки)
    ctx.beginPath();
    ctx.moveTo(baseX - 25, originalEndY);
    ctx.lineTo(baseX - 25, endY);
    ctx.strokeStyle = "green";
    ctx.stroke();

    ctx.fillStyle = "green";
    ctx.fillText("ΔL", baseX - 45, (originalEndY + endY) / 2 + 5);
  }
}
