import {  argbFromHex, themeFromSourceColor, hexFromArgb, MaterialDynamicColors, SchemeContent, Hct  } from "./color/typescript/index";

// First Quest, (hsl to hex) converter.
function hslToHex(hsl: string) {
    const regex: any = /^(\d+|\d+\.\d+)\s+(\d+|\d+\.\d+)%\s+(\d+|\d+\.\d+)%$/;
    let matches: any = hsl.match(regex);
    let hue = Number(matches[1]);
    let saturation = Number(matches[2]);
    let luminosity = Number(matches[3]);
    // First let me make (hsl to rgb) ofcourse based on algorithm from http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB.
    let hslToRgb = function (hue:any, saturation:any, lightness:any) {
      if (hue == undefined) {
        return [0, 0, 0];
      }
  
      let chroma = (1 - Math.abs((2 * lightness) - 1)) * saturation;
      let huePrime = hue / 60;
      let secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));
  
      huePrime = Math.floor(huePrime);
      let red:any;
      let green:any;
      let blue:any;
  
      if (huePrime === 0) {
        red = chroma;
        green = secondComponent;
        blue = 0;
      } else if (huePrime === 1) {
        red = secondComponent;
        green = chroma;
        blue = 0;
      } else if (huePrime === 2) {
        red = 0;
        green = chroma;
        blue = secondComponent;
      } else if (huePrime === 3) {
        red = 0;
        green = secondComponent;
        blue = chroma;
      } else if (huePrime === 4) {
        red = secondComponent;
        green = 0;
        blue = chroma;
      } else if (huePrime === 5) {
        red = chroma;
        green = 0;
        blue = secondComponent;
      }
  
      let lightnessAdjustment = lightness - (chroma / 2);
      red += lightnessAdjustment;
      green += lightnessAdjustment;
      blue += lightnessAdjustment;
  
      return [
        Math.abs(Math.round(red * 255)),
        Math.abs(Math.round(green * 255)),
        Math.abs(Math.round(blue * 255))
      ];
  
    };
    // Second task is to make (rgb to hex)
    function hexMax(hexValue: number, hexNumber: number) {
      return (hexValue > hexNumber) ? hexNumber : hexValue
    }
    function hexMin(hexValue: number, hexNumber: number) {
      return (hexValue < hexNumber) ? hexNumber : hexValue
    }
    function cycle(hexValue: number) {
      // for safety:
      hexValue = hexMax(hexValue, 1e7)
      hexValue = hexMin(hexValue, -1e7)
      // cycle value:
      while (hexValue < 0) { hexValue += 360 }
      while (hexValue > 359) { hexValue -= 360 }
      return hexValue
    }
    // resolve degrees to 0 - 359 range
    hue = cycle(hue)
    // enforce constraints
    saturation = hexMin(hexMax(saturation, 100), 0)
    luminosity = hexMin(hexMax(luminosity, 100), 0)
    // convert to 0 to 1 range used by hsl-to-rgb-for-reals
    saturation /= 100
    luminosity /= 100
    // let hsl-to-rgb-for-reals do the hard work
    let rgb = hslToRgb(hue, saturation, luminosity)
    // convert each value in the returned RGB array
    // to a 2 character hex value, join the array into
    // a string, prefixed with a hash
    return '#' + rgb
      .map(function (hexNumber) {
        return (256 + hexNumber).toString(16).substr(-2)
      })
      .join('')
  }
  // Second Quest -> (hex to hsl).
  const hexToHsl = (hex: string) => {
    // So, fist let me make (hex to rgb)
    function hexToRgb(hex: any):any {
  
      if (hex.charAt && hex.charAt(0) === '#') {
        hex = removeHash(hex)
      }
  
      if (hex.length === 3) {
        hex = expand(hex)
      }
  
      let bigint = parseInt(hex, 16)
      let r = (bigint >> 16) & 255
      let g = (bigint >> 8) & 255
      let b = bigint & 255
  
      return [r, g, b]
    }
    function removeHash(hex: any) {
      let arr = hex.split('')
      arr.shift()
      return arr.join('')
    }
    function expand(hex:any) {
      return hex
        .split('')
        .reduce(function (accum:any, value:any) {
  
          return accum.concat([value, value])
        }, [])
        .join('')
    }
    // Then the target is to make (rgb to hsl)
    function rgbToHsl(r: any, g: any, b: any) {
      let rgbDifference: any, rgbHue: any, rgbLuminosity: any, rgbMax: any, rgbMin: any, rgbSaturation: any;
      r /= 255;
      g /= 255;
      b /= 255;
      rgbMax = Math.max(r, g, b);
      rgbMin = Math.min(r, g, b);
      rgbHue = 0;
      rgbSaturation = 0;
      rgbLuminosity = (rgbMax + rgbMin) / 2;
      if (rgbMax === rgbMin) {
        rgbHue = rgbSaturation = 0;
      } else {
        rgbDifference = rgbMax - rgbMin;
        rgbSaturation = rgbLuminosity > 0.5 ? rgbDifference / (2 - rgbMax - rgbMin) : rgbDifference / (rgbMax + rgbMin);
        switch (rgbMax) {
          case r:
            rgbHue = (g - b) / rgbDifference + (g < b ? 6 : 0);
            break;
          case g:
            rgbHue = (b - r) / rgbDifference + 2;
            break;
          case b:
            rgbHue = (r - g) / rgbDifference + 4;
        }
        rgbHue /= 6;
      }
      rgbHue = rgbHue * 360;
      rgbSaturation = (rgbSaturation * 100) + "%";
      rgbLuminosity = (rgbLuminosity * 100) + "%";
      return [rgbHue, rgbSaturation, rgbLuminosity];
    };
  
    let hsl = rgbToHsl.apply(rgbToHsl, hexToRgb(hex));
    return [`${Math.round(hsl[0])} ${parseInt(hsl[1], 10)}% ${parseInt(hsl[2], 10)}%`];
  }
  
  const materialColors = {
    primaryPaletteKeyColor: MaterialDynamicColors.primaryPaletteKeyColor,
    secondaryPaletteKeyColor: MaterialDynamicColors.secondaryPaletteKeyColor,
    tertiaryPaletteKeyColor: MaterialDynamicColors.tertiaryPaletteKeyColor,
    neutralPaletteKeyColor: MaterialDynamicColors.neutralPaletteKeyColor,
    neutralVariantPaletteKeyColor: MaterialDynamicColors.neutralVariantPaletteKeyColor,
    background: MaterialDynamicColors.background,
    onBackground: MaterialDynamicColors.onBackground,
    surface: MaterialDynamicColors.surface,
    surfaceDim: MaterialDynamicColors.surfaceDim,
    surfaceBright: MaterialDynamicColors.surfaceBright,
    surfaceContainerLowest: MaterialDynamicColors.surfaceContainerLowest,
    surfaceContainerLow: MaterialDynamicColors.surfaceContainerLow,
    surfaceContainer: MaterialDynamicColors.surfaceContainer,
    surfaceContainerHigh: MaterialDynamicColors.surfaceContainerHigh,
    surfaceContainerHighest: MaterialDynamicColors.surfaceContainerHighest,
    onSurface: MaterialDynamicColors.onSurface,
    surfaceVariant: MaterialDynamicColors.surfaceVariant,
    onSurfaceVariant: MaterialDynamicColors.onSurfaceVariant,
    inverseSurface: MaterialDynamicColors.inverseSurface,
    inverseOnSurface: MaterialDynamicColors.inverseOnSurface,
    outline: MaterialDynamicColors.outline,
    outlineVariant: MaterialDynamicColors.outlineVariant,
    shadow: MaterialDynamicColors.shadow,
    scrim: MaterialDynamicColors.scrim,
    surfaceTint: MaterialDynamicColors.surfaceTint,
    primary: MaterialDynamicColors.primary,
    onPrimary: MaterialDynamicColors.onPrimary,
    primaryContainer: MaterialDynamicColors.primaryContainer,
    onPrimaryContainer: MaterialDynamicColors.onPrimaryContainer,
    inversePrimary: MaterialDynamicColors.inversePrimary,
    secondary: MaterialDynamicColors.secondary,
    onSecondary: MaterialDynamicColors.onSecondary,
    secondaryContainer: MaterialDynamicColors.secondaryContainer,
    onSecondaryContainer: MaterialDynamicColors.onSecondaryContainer,
    tertiary: MaterialDynamicColors.tertiary,
    onTertiary: MaterialDynamicColors.onTertiary,
    tertiaryContainer: MaterialDynamicColors.tertiaryContainer,
    onTertiaryContainer: MaterialDynamicColors.onTertiaryContainer,
    error: MaterialDynamicColors.error,
    onError: MaterialDynamicColors.onError,
    errorContainer: MaterialDynamicColors.errorContainer,
    onErrorContainer: MaterialDynamicColors.onErrorContainer,
    primaryFixed: MaterialDynamicColors.primaryFixed,
    primaryFixedDim: MaterialDynamicColors.primaryFixedDim,
    onPrimaryFixed: MaterialDynamicColors.onPrimaryFixed,
    onPrimaryFixedVariant: MaterialDynamicColors.onPrimaryFixedVariant,
    secondaryFixed: MaterialDynamicColors.secondaryFixed,
    secondaryFixedDim: MaterialDynamicColors.secondaryFixedDim,
    onSecondaryFixed: MaterialDynamicColors.onSecondaryFixed,
    onSecondaryFixedVariant: MaterialDynamicColors.onSecondaryFixedVariant,
    tertiaryFixed: MaterialDynamicColors.tertiaryFixed,
    tertiaryFixedDim: MaterialDynamicColors.tertiaryFixedDim,
    onTertiaryFixed: MaterialDynamicColors.onTertiaryFixed,
    onTertiaryFixedVariant: MaterialDynamicColors.onTertiaryFixedVariant,
  };
      
  let scheme = new SchemeContent(Hct.fromInt(argbFromHex(`${hslToHex("47.9 95.8% 53.1%")}`)), true, 1);
  let theme: { [key: string]: string } = {};
  
  for (let [key, value] of Object.entries(materialColors)) {
    theme[key] = hexFromArgb(value.getArgb(scheme));
  };
  
  for (let [key, value] of Object.entries(theme)) {
    let uiTheme = `${key}:"${hexToHsl(value)}",`;
    console.log(uiTheme);
  }
  
//   for (let [key,value] of Object.entries(shadcnThemes)){
//     let one = `${key}: ${value}`;
//     console.log(one);
//   }
