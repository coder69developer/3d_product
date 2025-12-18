export function snap(value, target = 0, threshold = 0.01) {
  return Math.abs(value - target) < threshold ? target : value
}
