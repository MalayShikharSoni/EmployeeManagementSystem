import { useEffect, useRef } from "react";
import gsap from "gsap";

const TVStaticEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const generateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const buffer = imageData.data;

      for (let i = 0; i < buffer.length; i += 4) {
        const intensity = Math.random() * 255;
        buffer[i] = buffer[i + 1] = buffer[i + 2] = intensity;
        buffer[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const animate = () => {
      generateNoise();
      requestAnimationFrame(animate);
    };

    // Resize handling
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    // GSAP fade-in effect

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      className="z-[999]"
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        opacity: 0.028,
        mixBlendMode: "difference",
      }}
    />
  );
};

export default TVStaticEffect;
