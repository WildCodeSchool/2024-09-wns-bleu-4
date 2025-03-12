import { motion } from "motion/react";

const startPosition =  { x: 0, y: 0 }
const getRandomValue = () => Math.random() * 300 - 150;

const AnimatedDiv = ({ className }: { className: string }) => {
  return (
    <motion.div
      className={className}
      animate={{
        x: [ startPosition.x, getRandomValue(), getRandomValue(), getRandomValue(), getRandomValue(), getRandomValue(), getRandomValue(), startPosition.x],
        y: [ startPosition.y, getRandomValue(), getRandomValue(), getRandomValue(), getRandomValue(), getRandomValue(), getRandomValue(), startPosition.y],
      }}
      transition={{
        duration: 40,
        ease: "linear",
        repeat: Infinity,
      }}
    />
  );
};

export default AnimatedDiv;