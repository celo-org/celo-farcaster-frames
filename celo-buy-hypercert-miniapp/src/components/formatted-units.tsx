"use client";

import React, { useEffect, useState } from "react";

interface FormattedUnitsProps {
  children: string | number | null | undefined;
  decimals?: number;
}

// Custom isString function implementation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isString = (value: any): value is string => {
  return typeof value === 'string' || value instanceof String;
};

export function FormattedUnits({
  children,
  decimals = 0,
}: FormattedUnitsProps) {
  const [formattedUnits, setFormattedUnits] = useState<
    string | number | null | undefined
  >(children);

  useEffect(() => {
    let units = children;

    if (!units) return;
    if (isString(units)) {
      units = Number.parseFloat(units);
    }

    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      units = new Intl.NumberFormat(navigator.language, {
        notation: "compact",
        compactDisplay: "short",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(units as number);
    }

    setFormattedUnits(units);
  }, [children, decimals]);

  return <>{formattedUnits}</>;
}