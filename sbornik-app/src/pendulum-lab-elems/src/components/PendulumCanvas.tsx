import { useEffect, useRef } from "react";
import { calculateTheta } from "../physics/pendulum";
import { drawPendulum } from "../canvas/drawPendulum";
import styles from "./PendulumCanvas.module.scss";

interface Props {
  length: number;
  theta0: number;
  mode: "infinite" | "fixed";
  targetN: number;
  isRunning: boolean;
  onUpdate: (data: {
    currentN: number;
    currentTime: number;
    isFinished: boolean;
  }) => void;
}

export function PendulumCanvas({
  length,
  theta0,
  mode,
  targetN,
  isRunning,
  onUpdate,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  const stateRef = useRef({
    currentN: 0,
    wasOnOtherSide: false, // Флаг, что маятник слетал на противоположную сторону
    startTime: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = wrapper.clientWidth;
      canvas.height = wrapper.clientHeight;
      if (!isRunning)
        drawPendulum(ctx, canvas.width, canvas.height, length, theta0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (!isRunning) {
      drawPendulum(ctx, canvas.width, canvas.height, length, theta0);
      return;
    }

    stateRef.current = { currentN: 0, wasOnOtherSide: false, startTime: 0 };
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!stateRef.current.startTime) stateRef.current.startTime = timestamp;

      const time = (timestamp - stateRef.current.startTime) / 1000;
      const theta = calculateTheta(time, length, theta0);

      // ЛОГИКА ПОДСЧЕТА ПОЛНОГО КОЛЕБАНИЯ:
      // 1. Если маятник отклонился в противоположную сторону (смена знака относительно старта)
      if ((theta0 > 0 && theta < 0) || (theta0 < 0 && theta > 0)) {
        stateRef.current.wasOnOtherSide = true;
      }

      // 2. Если он вернулся в сторону старта И флаг был активен
      if (stateRef.current.wasOnOtherSide) {
        if (
          (theta0 > 0 && theta >= theta0 * 0.99) ||
          (theta0 < 0 && theta <= theta0 * 0.99)
        ) {
          stateRef.current.currentN += 1;
          stateRef.current.wasOnOtherSide = false; // Сбрасываем флаг для следующего цикла
        }
      }

      drawPendulum(ctx, canvas.width, canvas.height, length, theta);

      const finished = mode === "fixed" && stateRef.current.currentN >= targetN;

      onUpdateRef.current({
        currentN: stateRef.current.currentN,
        currentTime: time,
        isFinished: finished,
      });

      if (!finished) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [length, theta0, isRunning, mode, targetN]);

  return (
    <div ref={wrapperRef} className={styles.pendulumWrapper}>
      <canvas ref={canvasRef} className={styles.pendulumCanvas} />
    </div>
  );
}
