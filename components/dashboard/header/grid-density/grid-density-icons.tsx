import { SquaresFour, Square } from "@phosphor-icons/react";

const LowDensityGridIcon = () => (
  <div className="w-6 h-6 flex items-center justify-center">
    <Square className="text-current" size={22} />
  </div>
);

const MediumDensityGridIcon = () => (
  <div className="w-6 h-6 flex items-center justify-center">
    <SquaresFour className="text-current" size={24} />
  </div>
);

const HighDensityGridIcon = () => (
  <div className="w-6 h-6 flex items-center justify-center">
    <div className="relative w-[24px] h-[24px] mt-1 ml-[2px]">
      <SquaresFour className="absolute top-0 left-0 text-current" size={12} />
      <SquaresFour
        className="absolute top-0 left-[8.5px] text-current"
        size={12}
      />
      <SquaresFour
        className="absolute top-[8.5px] left-0 text-current"
        size={12}
      />
      <SquaresFour
        className="absolute top-[8.5px] left-[8.5px] text-current"
        size={12}
      />
    </div>
  </div>
);

export const GridDensities = [
  {
    key: "lo",
    label: "Low Density Grid Button",
    icon: () => <LowDensityGridIcon />,
    tooltipText: "Low Density Grid",
  },
  {
    key: "md",
    label: "Medium Density Grid Button",
    icon: () => <MediumDensityGridIcon />,
    tooltipText: "Medium Density Grid",
  },
  {
    key: "hi",
    label: "High Density Grid Button",
    icon: () => <HighDensityGridIcon />,
    tooltipText: "High Density Grid",
  },
] as const;
