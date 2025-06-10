"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LoadingAnimationProps {
  size?: "small" | "medium" | "large";
}

export default function LoadingAnimation({
  size = "medium",
}: LoadingAnimationProps) {
  const [animationData, setAnimationData] = useState<any | null>(null);
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  };

  useEffect(() => {
    fetch("/lottie/loader-3QEaG.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => {
        throw new Error(`Failed to load Lottie: ${err.message}`);
      });
  }, []);

  return (
    <div className={sizeClasses[size]}>
      <Lottie autoplay loop animationData={animationData} />
    </div>
  );
}
