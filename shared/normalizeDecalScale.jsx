export function normalizeDecalScale(texture, baseHeight = 0.25, depth = 0.1) {
  if (!texture?.image) {
    return [0.3, baseHeight, depth]
  }

  const { width, height } = texture.image
  const aspect = width / height

  return [
    baseHeight * aspect, // width
    baseHeight,          // height
    depth,               // projection depth
  ]
}
