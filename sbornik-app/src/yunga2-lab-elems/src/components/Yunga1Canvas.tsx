import { useEffect, useRef } from "react";
import { calculateDeflection } from "../physics/yunga1"; 
import { drawBeam } from "../canvas/drawBeam";
import styles from "./Yunga1Canvas.module.scss";

interface Props {
  force: number;
  length: number;
  d: number;
  E: number;
}

export function Yunga1Canvas({ force, length, d, E }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const prevForceRef = useRef(force);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !wrapperRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = wrapperRef.current!.clientWidth;
      canvas.height = wrapperRef.current!.clientHeight;

      const rawDeltaL = calculateDeflection(force, length, d, E);
      // Учитываем гистерезис (разгрузку), если сила уменьшилась
      const finalDeltaL = force < prevForceRef.current ? rawDeltaL * 1.09 : rawDeltaL;

      drawBeam(ctx, canvas.width, canvas.height, finalDeltaL, force);
      prevForceRef.current = force;
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [force, length, d, E]);

  return (
    <div ref={wrapperRef} className={styles.pendulumWrapper} style={{ height: "400px", background: "#fdfdfd" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}