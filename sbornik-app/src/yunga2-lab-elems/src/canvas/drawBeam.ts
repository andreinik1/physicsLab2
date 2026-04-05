export function drawBeam(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  deltaL: number,
  force: number,
) {
  ctx.clearRect(0, 0, width, height);

  const baseX = width * 0.35; 
  const startY = height * 0.15; // Чуть опустил, чтобы влезла штриховка
  
  const visualScale = 25000; 
  const visualDeltaL = deltaL * visualScale;
  const baseVisualLength = height * 0.55;
  const endY = startY + baseVisualLength + visualDeltaL;

  // --- 1. КРЕПЛЕНИЕ (Поверхность как в физике) ---
  const ceilingWidth = 100;
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  
  // Горизонтальная линия
  ctx.beginPath();
  ctx.moveTo(baseX - ceilingWidth / 2, startY);
  ctx.lineTo(baseX + ceilingWidth / 2, startY);
  ctx.stroke();

  // Диагональная штриховка над линией
  ctx.beginPath();
  ctx.lineWidth = 1;
  for (let x = -ceilingWidth / 2; x <= ceilingWidth / 2; x += 8) {
    ctx.moveTo(baseX + x, startY);
    ctx.lineTo(baseX + x + 5, startY - 8);
  }
  ctx.stroke();

  // --- 2. ПРОВОЛОКА ---
  ctx.beginPath();
  ctx.moveTo(baseX, startY);
  ctx.lineTo(baseX, endY);
  ctx.strokeStyle = "#455a64";
  ctx.lineWidth = 2;
  ctx.stroke();

  // --- 3. ГРУЗ (Крючок и индикатор силы) ---
  ctx.beginPath();
  ctx.arc(baseX, endY + 5, 5, 0, Math.PI * 2); // Колечко крючка
  ctx.strokeStyle = "#333";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(baseX, endY + 10);
  ctx.lineTo(baseX, endY + 40);
  ctx.strokeStyle = "#d32f2f";
  ctx.lineWidth = 3;
  ctx.stroke();
  
  ctx.fillStyle = "#d32f2f";
  ctx.font = "bold 14px monospace";
  ctx.fillText(`${force} H`, baseX + 15, endY + 35);

  // --- 4. МИКРОМЕТР ---
  const micX = width * 0.7;
  const zeroY = startY + baseVisualLength; 

  // Стебель микрометра
  ctx.fillStyle = "#cfd8dc";
  ctx.fillRect(micX, zeroY - 60, 35, 120);
  ctx.strokeStyle = "#37474f";
  ctx.lineWidth = 1;
  ctx.strokeRect(micX, zeroY - 60, 35, 120);

  // Горизонтальная шкала (основная)
  ctx.beginPath();
  for (let i = -50; i <= 50; i += 10) {
    ctx.moveTo(micX + 25, zeroY + i);
    ctx.lineTo(micX + 35, zeroY + i);
    // Подписи на шкале (миллиметры)
    ctx.fillStyle = "#555";
    ctx.font = "8px Arial";
    if (i % 20 === 0) ctx.fillText(`${Math.abs(i/10)}`, micX + 15, zeroY + i + 3);
  }
  ctx.stroke();

  // Подвижный барабан
  const drumY = zeroY + visualDeltaL;
  const grad = ctx.createLinearGradient(micX - 20, 0, micX + 20, 0);
  grad.addColorStop(0, "#90a4ae");
  grad.addColorStop(0.5, "#eceff1");
  grad.addColorStop(1, "#90a4ae");
  
  ctx.fillStyle = grad;
  ctx.fillRect(micX - 20, drumY - 25, 40, 50);
  ctx.strokeStyle = "#263238";
  ctx.strokeRect(micX - 20, drumY - 25, 40, 50);

  // Центральная линия на барабане (нониус)
  ctx.beginPath();
  ctx.moveTo(micX - 20, drumY);
  ctx.lineTo(micX + 20, drumY);
  ctx.strokeStyle = "#1b5e20";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Соединительная нить к микрометру
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(baseX, endY);
  ctx.lineTo(micX - 20, drumY);
  ctx.strokeStyle = "#4caf50";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);

  // Вывод точного значения
  ctx.fillStyle = "#1b5e20";
  ctx.font = "bold 13px Arial";
  ctx.fillText(`ΔL = ${(deltaL).toFixed(6)} м`, micX - 45, drumY - 35);
}