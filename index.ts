// console.log("Hello via Bun!");
import { argbFromHex, themeFromSourceColor, applyTheme } from "./color/typescript/index";

// Get the theme from a hex color
const theme = themeFromSourceColor(argbFromHex('#f82506'), [
  {
    name: "custom-1",
    value: argbFromHex("#ff0000"),
    blend: true,
  },
]);

// Print out the theme as JSON
console.log(JSON.stringify(theme, null, 2));