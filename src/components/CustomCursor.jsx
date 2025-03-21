import { useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CustomCursor = (props) => {
  useGSAP(() => {
    const handleClick = () => {
      gsap.to(".cursorr", {
        scale: 0.9,
        translateX: -1,
        translateY: -1,
        duration: 0.1,
        ease: "power1.out",
        onComplete: () => {
          gsap.to(".cursorr", {
            scale: 1,
            translateX: 1,
            translateY: 1,
            duration: 0.2,
            ease: "power2.out",
          });
        },
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      className="cursorr w-6 h-6 bg-transparent rounded-full z-50 absolute flex justify-center items-center"
      style={{
        top: `${props.y}px`,
        left: `${props.x}px`,
        pointerEvents: "none",
      }}
    >
      <img
        src="/src/assets/CustomLinuxCursor.svg"
        alt="."
        style={{ background: "none", mixBlendMode: "multiply" }}
      />
    </div>
  );
};

export default CustomCursor;
