import React, { useState, useRef } from "react";
import styles from "./HoverEffect.module.css";

const HoverEffect: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const circleRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setHovered(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => { setHovered(false); };

  return (
    <div className={styles.box}
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <span className={styles.text}>Hover me</span>
      {hovered && (
        <div ref={circleRef} className={styles.circle}
          style={{ width: hovered ? "100px" : "0px", height: hovered ? "100px" : "0px", top: position.y, left: position.x, transform: "translate(-50%, -50%)" }} />
      )}
    </div>
  );
};

export default HoverEffect;
