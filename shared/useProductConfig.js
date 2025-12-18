'use client'
import { useState } from 'react'

export default function useProductConfig() {
  const [bodyColor, setBodyColor] = useState('#ffffff')
  const [labelImage, setLabelImage] = useState(null)
  const [logoImage, setLogoImage] = useState(null)
  const [brandText, setBrandText] = useState('')
  const [showLabel, setShowLabel] = useState(true)
  const [showLogo, setShowLogo] = useState(true)

  // NEW: decal position and rotation
  const [logoX, setLogoX] = useState(0)          // normalized -0.5 to 0.5
  const [logoY, setLogoY] = useState(0)          // normalized -0.5 to 0.5
  const [logoRotation, setLogoRotation] = useState(0) // radians
  const [logoScale, setLogoScale] = useState([1, 0.75, 1.35]) // radians

  return {
    bodyColor,
    setBodyColor,
    labelImage,
    setLabelImage,
    logoImage,
    setLogoImage,
    brandText,
    setBrandText,
    showLabel,
    setShowLabel,
    showLogo,
    setShowLogo,
    logoX,
    setLogoX,
    logoY,
    setLogoY,
    logoRotation,
    setLogoRotation,
    logoScale, setLogoScale
  }
}
