import { useEffect, useRef } from "react";
import { calculateDeflection } from "../physics/yunga1";
import { drawBeam } from "../canvas/drawBeam";
import styles from "./Yunga1Canvas.module.scss";

interface Props {
  force: number;
  length: number;
  b: number;
  h: number;
  E: number;
}

const UNLOAD_K = 0.95;

export function Yunga1Canvas({ force, length, b, h, E }: Props) {
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

      const rawF = calculateDeflection(force, length, b, h, E);
      const isUnloading = force < prevForceRef.current;
      const f = isUnloading ? rawF * UNLOAD_K : rawF;

      drawBeam(ctx, canvas.width, canvas.height, f, force);
      prevForceRef.current = force;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [force, length, b, h, E]);

  return (
    <div ref={wrapperRef} className={styles.pendulumWrapper}>
      <canvas ref={canvasRef} className={styles.pendulumCanvas} />
    </div>
  );
}