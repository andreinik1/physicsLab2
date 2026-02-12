import { useEffect, useRef } from "react";
import { calculateTheta } from "../physics/pendulum";
import { drawPendulum } from "../canvas/drawPendulum";
import styles from "./PendulumCanvas.module.scss";

interface Props {
  length: number;
  theta0: number;
}

export function PendulumCanvas({ length, theta0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = wrapper.clientWidth;
      canvas.height = wrapper.clientHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let startTime: number | null = null;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const time = (timestamp - startTime) / 1000;

      const theta = calculateTheta(time, length, theta0);
      drawPendulum(ctx, canvas.width, canvas.height, length, theta);

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [length, theta0]);

  return (
    <div ref={wrapperRef} className={styles.pendulumWrapper}>
      <canvas ref={canvasRef} className={styles.pendulumCanvas} />
    </div>
  );
}
