import { useControls } from 'leva'

export function useDecalControls(name = 'Decal') {
  const controls = useControls(name, {
    position: {
      value: [0, 0.04, 0.02],
      step: 0.001,
      joystick: 'invertY',
    },
    rotation: {
      value: [0, Math.PI / 2, 0],
      step: 0.01,
    },
    scale: {
      value: 0.18,
      min: 0.05,
      max: 1,
      step: 0.01,
    },
  })

  return controls
}
