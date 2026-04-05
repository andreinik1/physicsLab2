export function drawAreometer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  p1: number,
  p2: number,
  p3: number
) {
  ctx.clearRect(0, 0, width, height);

  const centerX = width / 2;
  const waterLevel = height * 0.55;

  // ФІЗИЧНІ КОНСТАНТИ
  const areometerWeight = 0.343; // 35г
  const totalBuoyancy = 0.85;    // Архімед приладу
  const bodyWeight = 0.5;        // Вага тіла (завжди в системі!)
  const bodyArchimedes = 0.2;    // Архімед тіла у воді
  const sensitivity = 40; 

  // --- ЗАЛІЗНА ЛОГІКА СИЛ ---
  // Тіло ВЖЕ лежить на ареометрі з самого початку (як частина конструкції)
  // DownForce = Ареометр + Тіло + Всі важки (P1 + P2 + P3)
  const downForce = areometerWeight + bodyWeight + p1 + p2 + p3;
  
  // UpForce = Архімед приладу + Архімед тіла (тільки якщо ми в стані P3)
  const isBodyInWater = p3 > 0;
  const upForce = totalBuoyancy + (isBodyInWater ? bodyArchimedes : 0);

  const offset = (downForce - upForce) * sensitivity;
  const currentY = waterLevel + offset - 20;

  // --- ВІЗУАЛІЗАЦІЯ ---
  ctx.fillStyle = "#e0f2fe";
  ctx.fillRect(0, waterLevel, width, height - waterLevel);

  // Ареометр
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2;
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.beginPath();
  ctx.ellipse(centerX, currentY + 80, 35, 65, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.fillRect(centerX - 6, currentY - 120, 12, 160);
  ctx.strokeRect(centerX - 6, currentY - 120, 12, 160);

  // Риска
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX - 18, currentY); ctx.lineTo(centerX + 18, currentY); ctx.stroke();

  // Чашки
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(centerX - 40, currentY - 125, 80, 7); 
  ctx.fillRect(centerX - 30, currentY + 155, 60, 7); 

  // --- МАЛЮВАННЯ ТІЛА ---
  // Тіло малюється тільки якщо ми почали клацати P2 або P3
  const shouldShowBody = p2 > 0 || p3 > 0;
  
  if (shouldShowBody) {
    ctx.fillStyle = "#4b5563"; // Колір тіла
    if (isBodyInWater) {
      // Малюємо внизу
      ctx.beginPath(); ctx.arc(centerX, currentY + 175, 12, 0, Math.PI * 2); ctx.fill();
    } else {
      // Малюємо зверху
      ctx.beginPath(); ctx.arc(centerX + 20, currentY - 140, 12, 0, Math.PI * 2); ctx.fill();
    }
  }

  // --- МАЛЮВАННЯ ВАЖКІВ ---
  const totalWeights = p1 + p2 + p3;
  if (totalWeights > 0) {
    ctx.fillStyle = "#f59e0b";
    const weightSize = Math.min(45, 15 + totalWeights * 5);
    ctx.fillRect(centerX - weightSize / 2, currentY - 125 - weightSize, weightSize, weightSize);
  }
}