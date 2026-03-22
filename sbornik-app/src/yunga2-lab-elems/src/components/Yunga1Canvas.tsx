import { useEffect, useRef } from "react";
// Предположим, вы обновите функцию расчета под растяжение
// deltaL = (force * length) / (Math.PI * Math.pow(d, 2) / 4 * E)
import { calculateDeflection} from "../physics/yunga1"; 
import { drawBeam } from "../canvas/drawBeam";
import styles from "./Yunga1Canvas.module.scss";

interface Props {
  force: number;
  length: number;
  d: number; // Диаметр вместо b и h
  E: number;
}

const UNLOAD_K = 0.95;

export function Yunga1Canvas({ force, length, d, E }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const prevForceRef = useRef(force);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = wrapper.clientWidth;
      canvas.height = wrapper.clientHeight;

      // Расчет абсолютного удлинения (в метрах)
      const rawDeltaL = calculateDeflection(force, length, d, E);
      const isUnloading = force < prevForceRef.current;
      const deltaL = isUnloading ? rawDeltaL * UNLOAD_K : rawDeltaL;

      drawBeam(ctx, canvas.width, canvas.height, deltaL, force, length);
      prevForceRef.current = force;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [force, length, d, E]);

  return (
    <div ref={wrapperRef} className={styles.pendulumWrapper}>
      <canvas ref={canvasRef} className={styles.pendulumCanvas} />
    </div>
  );
}
