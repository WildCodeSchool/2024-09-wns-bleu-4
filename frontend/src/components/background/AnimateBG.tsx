interface AnimatedDivProps {
  className?: string;
}

const AnimatedDiv: React.FC<AnimatedDivProps> = ({ className }) => {
  return (
    <div
      className={className}
    />
  );
};

export default AnimatedDiv;