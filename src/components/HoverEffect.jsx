import React, { useState, useRef } from "react";

const HoverEffect = () => {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const circleRef = useRef(null);

  const handleMouseEnter = (e) => {
    setHovered(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div
      className="box relative w-64 h-64 bg-gray-800 flex justify-center items-center overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="text-white">Hover me</span>

      {hovered && (
        <div
          ref={circleRef}
          className="absolute bg-red-500 rounded-full transition-all duration-500"
          style={{
            width: hovered ? "100px" : "0px",
            height: hovered ? "100px" : "0px",
            top: position.y,
            left: position.x,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </div>
  );
};

export default HoverEffect;
