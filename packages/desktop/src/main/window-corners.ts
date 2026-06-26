export const WINDOW_CORNER_RADIUS_PX = 8

export function getWindowsRoundedCornersConfig() {
  return {
    roundedCorners: true,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    backgroundMaterial: "mica" as const,
  }
}

export function getWindowCornerRadiusCss() {
  return `${WINDOW_CORNER_RADIUS_PX}px`
}
