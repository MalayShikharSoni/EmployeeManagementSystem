import CustomLinuxCursor from "/src/assets/CustomLinuxCursor.svg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./CustomCursor.module.css";

interface CustomCursorProps {
  x: number;
  y: number;
}

const CustomCursor: React.FC<CustomCursorProps> = (props) => {
  useGSAP(() => {
    const handleClick = () => {
      gsap.to(".cursorr", {
        scale: 0.9, translateX: -1, translateY: -1, duration: 0.1, ease: "power1.out",
        onComplete: () => {
          gsap.to(".cursorr", { scale: 1, translateX: 1, translateY: 1, duration: 0.2, ease: "power2.out" });
        },
      });
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className={`cursorr ${styles.cursor}`}
      style={{ top: `${props.y}px`, left: `${props.x}px`, pointerEvents: "none" }}>
      <img src={CustomLinuxCursor} alt="." style={{ background: "none", mixBlendMode: "multiply" }} />
    </div>
  );
};

export default CustomCursor;
