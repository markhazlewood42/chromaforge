// sRGB <-> linear RGB <-> XYZ <-> LAB conversions, hex parsing, and CIEDE2000.
// Reference white: D65. Standard IEC 61966-2-1 sRGB transfer function.

export type RGB = { r: number; g: number; b: number } // 0-255
export type LinearRGB = { r: number; g: number; b: number } // 0-1
export type XYZ = { x: number; y: number; z: number }
export type Lab = { l: number; a: number; b: number }

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return { r, g, b }
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function srgbChannelToLinear(c: number): number {
  const cs = c / 255
  return cs <= 0.04045 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4)
}

function linearChannelToSrgb(c: number): number {
  const clamped = Math.min(1, Math.max(0, c))
  const v = clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055
  return v * 255
}

export function rgbToLinear(rgb: RGB): LinearRGB {
  return {
    r: srgbChannelToLinear(rgb.r),
    g: srgbChannelToLinear(rgb.g),
    b: srgbChannelToLinear(rgb.b),
  }
}

export function linearToRgb(linear: LinearRGB): RGB {
  return {
    r: linearChannelToSrgb(linear.r),
    g: linearChannelToSrgb(linear.g),
    b: linearChannelToSrgb(linear.b),
  }
}

// sRGB (D65) linear -> XYZ, IEC 61966-2-1 matrix
export function linearToXyz(linear: LinearRGB): XYZ {
  const { r, g, b } = linear
  return {
    x: r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
    y: r * 0.2126729 + g * 0.7151522 + b * 0.072175,
    z: r * 0.0193339 + g * 0.119192 + b * 0.9503041,
  }
}

export function xyzToLinear(xyz: XYZ): LinearRGB {
  const { x, y, z } = xyz
  return {
    r: x * 3.2404542 + y * -1.5371385 + z * -0.4985314,
    g: x * -0.969266 + y * 1.8760108 + z * 0.041556,
    b: x * 0.0556434 + y * -0.2040259 + z * 1.0572252,
  }
}

const D65 = { x: 0.95047, y: 1.0, z: 1.08883 }

function labF(t: number): number {
  const delta = 6 / 29
  return t > delta ** 3 ? Math.cbrt(t) : t / (3 * delta ** 2) + 4 / 29
}

function labFInv(t: number): number {
  const delta = 6 / 29
  return t > delta ? t ** 3 : 3 * delta ** 2 * (t - 4 / 29)
}

export function xyzToLab(xyz: XYZ): Lab {
  const fx = labF(xyz.x / D65.x)
  const fy = labF(xyz.y / D65.y)
  const fz = labF(xyz.z / D65.z)
  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  }
}

export function labToXyz(lab: Lab): XYZ {
  const fy = (lab.l + 16) / 116
  const fx = fy + lab.a / 500
  const fz = fy - lab.b / 200
  return {
    x: labFInv(fx) * D65.x,
    y: labFInv(fy) * D65.y,
    z: labFInv(fz) * D65.z,
  }
}

export function rgbToLab(rgb: RGB): Lab {
  return xyzToLab(linearToXyz(rgbToLinear(rgb)))
}

export function labToRgb(lab: Lab): RGB {
  return linearToRgb(xyzToLinear(labToXyz(lab)))
}

export function hexToLab(hex: string): Lab {
  return rgbToLab(hexToRgb(hex))
}

export function labToHex(lab: Lab): string {
  return rgbToHex(labToRgb(lab))
}

// CIEDE2000 color difference. Implementation follows Sharma, Wu & Dalal (2005).
export function deltaE2000(lab1: Lab, lab2: Lab): number {
  const kL = 1
  const kC = 1
  const kH = 1

  const c1 = Math.sqrt(lab1.a ** 2 + lab1.b ** 2)
  const c2 = Math.sqrt(lab2.a ** 2 + lab2.b ** 2)
  const cBar = (c1 + c2) / 2

  const g = 0.5 * (1 - Math.sqrt(cBar ** 7 / (cBar ** 7 + 25 ** 7)))
  const a1p = lab1.a * (1 + g)
  const a2p = lab2.a * (1 + g)

  const c1p = Math.sqrt(a1p ** 2 + lab1.b ** 2)
  const c2p = Math.sqrt(a2p ** 2 + lab2.b ** 2)

  const h1p = (Math.atan2(lab1.b, a1p) * 180) / Math.PI + (Math.atan2(lab1.b, a1p) < 0 ? 360 : 0)
  const h2p = (Math.atan2(lab2.b, a2p) * 180) / Math.PI + (Math.atan2(lab2.b, a2p) < 0 ? 360 : 0)

  const deltaLp = lab2.l - lab1.l
  const deltaCp = c2p - c1p

  let deltahp = 0
  if (c1p * c2p !== 0) {
    const diff = h2p - h1p
    if (Math.abs(diff) <= 180) deltahp = diff
    else if (diff > 180) deltahp = diff - 360
    else deltahp = diff + 360
  }
  const deltaHp = 2 * Math.sqrt(c1p * c2p) * Math.sin((deltahp * Math.PI) / 180 / 2)

  const lBarp = (lab1.l + lab2.l) / 2
  const cBarp = (c1p + c2p) / 2

  let hBarp = h1p + h2p
  if (c1p * c2p !== 0) {
    if (Math.abs(h1p - h2p) > 180) hBarp += 360
    hBarp /= 2
  } else {
    hBarp = h1p + h2p
  }

  const t =
    1 -
    0.17 * Math.cos(((hBarp - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * hBarp * Math.PI) / 180) +
    0.32 * Math.cos(((3 * hBarp + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * hBarp - 63) * Math.PI) / 180)

  const deltaTheta = 30 * Math.exp(-(((hBarp - 275) / 25) ** 2))
  const rc = 2 * Math.sqrt(cBarp ** 7 / (cBarp ** 7 + 25 ** 7))
  const sl = 1 + (0.015 * (lBarp - 50) ** 2) / Math.sqrt(20 + (lBarp - 50) ** 2)
  const sc = 1 + 0.045 * cBarp
  const sh = 1 + 0.015 * cBarp * t
  const rt = -Math.sin((2 * deltaTheta * Math.PI) / 180) * rc

  return Math.sqrt(
    (deltaLp / (kL * sl)) ** 2 +
      (deltaCp / (kC * sc)) ** 2 +
      (deltaHp / (kH * sh)) ** 2 +
      rt * (deltaCp / (kC * sc)) * (deltaHp / (kH * sh)),
  )
}
