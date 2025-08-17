// lib/geo.ts
const R = 6371000; // Dünya'nın yarıçapı (metre)
const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

/** İki coğrafi koordinat arasındaki mesafeyi metre olarak hesaplar. */
export function distanceMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
): number {
  const φ1 = toRad(a.latitude);
  const φ2 = toRad(b.latitude);
  const Δφ = toRad(b.latitude - a.latitude);
  const Δλ = toRad(b.longitude - a.longitude);
  const s =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

/** Bir noktadan diğerine olan kerterizi (yön açısını) derece olarak hesaplar. */
export function bearingDeg(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
): number {
  const φ1 = toRad(a.latitude);
  const φ2 = toRad(b.latitude);
  const Δλ = toRad(b.longitude - a.longitude);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Bir hedefin yön açısını, cihazın baktığı yöne göreceli hale getirir (-180° ile +180° arası). */
export function relativeHeadingDeg(
  targetBearing: number,
  deviceHeading: number
): number {
  return ((targetBearing - deviceHeading + 540) % 360) - 180;
}

/** Bir değeri, belirtilen min ve max sınırlar içinde tutar. */
export const clamp = (val: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, val));

/** Metre cinsinden mesafeyi "km" veya "m" olarak formatlar. */
export const formatDistance = (m: number): string =>
  m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
