"use client";

import {
  Button,
  Group,
  MantineProvider,
  defaultVariantColorsResolver,
  VariantColorsResolver,
  parseThemeColor,
  rem,
  rgba,
  darken,
} from "@mantine/core";

export const variantColorResolver: VariantColorsResolver = (input) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input);
  const parsedColor = parseThemeColor({
    color: input.color || input.theme.primaryColor,
    theme: input.theme,
  });

  // // Override some properties for variant
  // if (parsedColor.isThemeColor && parsedColor.color === 'lime' && input.variant === 'filled') {
  //   return {
  //     ...defaultResolvedColors,
  //     color: 'var(--mantine-color-black)',
  //     hoverColor: 'var(--mantine-color-black)',
  //   };
  // }

  // Completely override variant
  if (input.variant === "light") {
    return {
      background: rgba(parsedColor.value, 0.1),
      hover: rgba(parsedColor.value, 0.15),
      border: `${rem(1)} solid ${parsedColor.value}`,
      color: darken(parsedColor.value, 0.1),
    };
  }

  // Add new variants support
  if (input.variant === "danger") {
    return {
      background: "var(--mantine-color-red-9)",
      hover: "var(--mantine-color-red-8)",
      color: "var(--mantine-color-white)",
      border: "none",
    };
  }

  // Add new variants support
  if (input.variant === "warning") {
    return {
      background: "var(--mantine-color-yellow-5)",
      hover: "var(--mantine-color-yellow-4)",
      color: "var(--mantine-color-white)",
      border: "none",
    };
  }

  return defaultResolvedColors;
};
