export function getAnimationVariants(isSelected: boolean) {
  return {
    initial: (direction: number) => ({
      x: isSelected ? undefined : 100 * direction,
      y: isSelected ? 20 : undefined,
      opacity: 0,
      filter: "blur(4px)",
    }),
    animate: {
      x: isSelected ? undefined : 0,
      y: isSelected ? 0 : undefined,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: (direction: number) => ({
      x: isSelected ? undefined : -100 * direction,
      y: isSelected ? -20 : undefined,
      opacity: 0,
      filter: "blur(4px)",
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    }),
  };
}
