import { ReactNode } from "react";
import { Card, CardBody } from "@heroui/card";
import { motion } from "framer-motion";

interface FileSelectionAreaProps {
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  isDisabled: boolean;
  isSelected?: boolean;
  direction: number;
  children?: ReactNode;
}

export function FileSelectionArea({
  icon,
  title,
  subtitle,
  onPress,
  isDisabled,
  isSelected = false,
  direction,
  children,
}: FileSelectionAreaProps) {
  return (
    <motion.div
      animate={{ x: 0, opacity: 1 }}
      className="w-full"
      exit={{ x: -direction * 20, opacity: 0 }}
      initial={{ x: direction * 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`border-2 border-dashed ${
          isSelected
            ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
            : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
        }`}
        isDisabled={isDisabled}
        isPressable={!isSelected}
        shadow="sm"
        onPress={isSelected ? undefined : onPress}
      >
        <CardBody className="p-6 text-center">
          {children || (
            <div className="flex flex-col items-center">
              {icon && (
                <div
                  className={`flex items-center justify-center w-12 h-12 mb-4 rounded-full ${isSelected ? "bg-green-100 dark:bg-green-800" : "bg-gray-100 dark:bg-gray-800"}`}
                >
                  {icon}
                </div>
              )}
              {title && <p className="font-medium">{title}</p>}
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
