"use client";

import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const NoProduct = ({
  selectedCategory,
  className,
}: {
  selectedCategory?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 min-h-100 space-y-6 text-center bg-gray-100 rounded-lg w-full mt-10",
        className
      )}
    >
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          No Product Available
        </h2>
      </div>

      <p className="text-gray-600 max-w-2xl">
        We&apos;re sorry, but there are no products matching on{" "}
        <span className="text-base font-semibold text-darkColor">
          {selectedCategory}
        </span>{" "}
        criteria at the moment.
      </p>

      <div className="flex items-center space-x-2 text-gray-700">
        <Loader className="w-5 h-5 animate-spin" />
        <span className="font-medium">We&apos;re restocking shortly</span>
      </div>

      <p className="text-sm text-gray-500 max-w-xl">
        Please check back later or explore our other product categories.
      </p>
    </div>
  );
};

export default NoProduct;