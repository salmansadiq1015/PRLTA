import React from "react";
import { motion } from "framer-motion";

export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-white">
      <motion.div
        className="relative"
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          scale: [1, 1.2, 1],
          borderRadius: ["10%", "30%", "50%", "20%", "10%"],
          backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1"],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear",
        }}
        style={{
          width: "100px",
          height: "100px",
          transformStyle: "preserve-3d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0px 0px 20px rgba(0,0,0,0.3)",
        }}
      >
        {["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#F1C40F", "#8E44AD"].map(
          (color, index) => (
            <div
              key={index}
              className="absolute w-full h-full"
              style={{
                backgroundColor: color,
                transform: getCubeFaceTransform(index),
                opacity: 0.9,
              }}
            />
          )
        )}
      </motion.div>
    </div>
  );
}

function getCubeFaceTransform(index) {
  const distance = 50;
  switch (index) {
    case 0:
      return `translateZ(${distance}px)`;
    case 1:
      return `rotateY(180deg) translateZ(${distance}px)`;
    case 2:
      return `rotateY(-90deg) translateZ(${distance}px)`;
    case 3:
      return `rotateY(90deg) translateZ(${distance}px)`;
    case 4:
      return `rotateX(90deg) translateZ(${distance}px)`;
    case 5:
      return `rotateX(-90deg) translateZ(${distance}px)`;
    default:
      return "";
  }
}
