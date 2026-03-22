import { useEffect, useRef } from "react";
import { drawAreometer } from "../canvas/drawAreometr";
import styles from "./PitomaVagaCanvas.module.scss";

interface Props {
  p1: number;
  p2: number;
  p3: number;
}

export function DensityCanvas({ p1, p2, p3 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;

    // Определяем состояние для визуала: что именно сейчас "в фокусе"
    // Для простоты: если P3 сильно изменили, показываем состояние P3
    let state: "P1" | "P2" | "P3" = "P1";
    if (p3 !== 1.1) state = "P3";
    else if (p2 !== 0.8) state = "P2";

    drawAreometer(ctx, canvas.width, canvas.height, state);
  }, [p1, p2, p3]);

  return (
    <div ref={wrapperRef} className={styles.pendulumWrapper} style={{ height: "400px", background: "#fff", borderRadius: "8px" }}>
      <canvas ref={canvasRef} className={styles.pendulumCanvas} />
    </div>
  );
}