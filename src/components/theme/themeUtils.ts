import { DynamicScheme, MaterialDynamicColors, SchemeTonalSpot } from "@material/material-color-utilities";

type Color =
  | "primary"
  | "onPrimary"
  | "primaryContainer"
  | "onPrimaryContainer"
  | "inversePrimary"
  | "secondary"
  | "onSecondary"
  | "secondaryContainer"
  | "onSecondaryContainer"
  | "tertiary"
  | "onTertiary"
  | "tertiaryContainer"
  | "onTertiaryContainer"
  | "error"
  | "onError"
  | "errorContainer"
  | "onErrorContainer"
  | "background"
  | "onBackground"
  | "surface"
  | "onSurface"
  | "surfaceVariant"
  | "onSurfaceVariant"
  | "inverseSurface"
  | "inverseOnSurface"
  | "outline"
  | "outlineVariant"
  | "shadow"
  | "scrim"
  | "surfaceDim"
  | "surfaceBright"
  | "surfaceContainerLowest"
  | "surfaceContainerLow"
  | "surfaceContainer"
  | "surfaceContainerHigh"
  | "surfaceContainerHighest"
  | "surfaceTint";

// const pairs = [
//   ["primary", "onPrimary"],
//   ["primaryContainer", "onPrimaryContainer"],
//   ["secondary", "onSecondary"],
//   ["secondaryContainer", "onSecondaryContainer"],
//   ["tertiary", "onTertiary"],
//   ["tertiaryContainer", "onTertiaryContainer"],
//   ["background", "onBackground"],
//   ["surface", "onSurface"],
//   ["inverseSurface", "inverseOnSurface"],
//   ["surfaceVariant", "onSurfaceVariant"],
//   ["error", "onError"],
//   ["errorContainer", "onErrorContainer"],
// ]

export const colors: Color[] = [
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "inversePrimary",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer",
  "background",
  "onBackground",
  "surface",
  "onSurface",
  "surfaceVariant",
  "onSurfaceVariant",
  "inverseSurface",
  "inverseOnSurface",
  "outline",
  "outlineVariant",
  "shadow",
  "scrim",
  "surfaceDim",
  "surfaceBright",
  "surfaceContainerLowest",
  "surfaceContainerLow",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
  "surfaceTint",
];

export type SerializedScheme = Record<Color, number>;

/**
 * Generates the CSS color variable for the provided color.
 * @param name The name of the color.
 * @param argb The argb value.
 * @returns The CSS variable.
 */
function genColorVariable(name: string, argb: number) {
  const kebabCase = name.replace(/[A-Z]/g, (letter: string) => `-${letter.toLowerCase()}`);
  const red = (argb >> 16) & 255;
  const green = (argb >> 8) & 255;
  const blue = argb & 255;
  return `--m3-scheme-${kebabCase}: ${red} ${green} ${blue};`;
}

/**
 * @returns A string of CSS code with custom properties representing the color scheme values.
 * */
export const genCSS = (dark: SerializedScheme) => {
  const darkColors = Object.entries(dark).map(([name, argb]) => genColorVariable(name, argb)).join("\n");

  const colors = `
:root {
  accent-color: rgb(var(--m3-scheme-primary));
  ${darkColors}
}`;
  return colors;
};

/**
 * Serializes a scheme's color values into argb.
 * @param scheme The scheme to use.
 */
export function serializeScheme(scheme: SchemeTonalSpot) {
  const out: Record<string, number> = {};

  for (const color of colors) {
    out[color] = MaterialDynamicColors[color].getArgb(scheme as DynamicScheme);
  }

  return out as SerializedScheme;
}