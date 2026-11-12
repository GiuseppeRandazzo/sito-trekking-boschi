import type { Trail } from './trails'

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

/**
 * Generates smooth interpolated [lng, lat, elevation] trackpoints between sparse anchor vertices
 * so GPX viewers (Garmin, Komoot, Wikiloc) render a continuous Sicilian route trace.
 */
function interpolateTrackpoints(
  coords: [number, number, number][],
  subdivisions = 6
): [number, number, number][] {
  if (coords.length < 2) return coords
  const points: [number, number, number][] = []

  for (let i = 0; i < coords.length - 1; i++) {
    const [lngA, latA, eleA] = coords[i]
    const [lngB, latB, eleB] = coords[i + 1]
    for (let step = 0; step < subdivisions; step++) {
      const t = step / subdivisions
      points.push([
        Number((lngA + (lngB - lngA) * t).toFixed(6)),
        Number((latA + (latB - latA) * t).toFixed(6)),
        Math.round(eleA + (eleB - eleA) * t),
      ])
    }
  }

  const last = coords[coords.length - 1]
  points.push([Number(last[0].toFixed(6)), Number(last[1].toFixed(6)), Math.round(last[2])])
  return points
}

/** Builds a standards-compliant GPX 1.1 XML string for the selected Sicilian trail. */
export function generateGpxXml(trail: Trail): string {
  const coords =
    trail.coordinates && trail.coordinates.length > 0
      ? trail.coordinates
      : ([[14.982, 37.698, trail.elevationProfile[0]?.elevation ?? 0]] as [number, number, number][])

  const trackpoints = interpolateTrackpoints(coords)

  const waypointsXml = trail.waypoints
    .map((wp, idx) => {
      const ratio = trail.km > 0 ? Math.min(1, Math.max(0, wp.km / trail.km)) : 0
      const fallbackIdx = Math.min(coords.length - 1, Math.round(ratio * (coords.length - 1)))
      const fallback = coords[fallbackIdx] ?? coords[0]
      const lat = wp.lat ?? fallback[1]
      const lng = wp.lng ?? fallback[0]
      const ele = wp.elevation ?? fallback[2]
      const sym =
        wp.poiType === 'refuge'
          ? 'Lodge'
          : wp.poiType === 'water_source'
            ? 'Water Source'
            : wp.poiType === 'cultural'
              ? 'Historic'
              : 'Summit'

      return `  <wpt lat="${lat.toFixed(6)}" lon="${lng.toFixed(6)}">
    <ele>${Math.round(ele)}</ele>
    <name>${escapeXml(`${idx + 1}. ${wp.title}`)}</name>
    <desc>${escapeXml(wp.description)}</desc>
    <type>${escapeXml(wp.poiTypeLabel)}</type>
    <sym>${sym}</sym>
  </wpt>`
    })
    .join('\n')

  const trkptsXml = trackpoints
    .map(
      ([lng, lat, ele]) =>
        `      <trkpt lat="${lat.toFixed(6)}" lon="${lng.toFixed(6)}">\n        <ele>${Math.round(ele)}</ele>\n      </trkpt>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Wild Sicily - Outdoora" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(trail.name)}</name>
    <desc>${escapeXml(`${trail.description} (Partenza: ${trail.startingPoint} · ${trail.km} km · +${trail.gain} m D+)`)}</desc>
    <author>
      <name>Wild Sicily Outdoora</name>
    </author>
  </metadata>
${waypointsXml}
  <trk>
    <name>${escapeXml(trail.name)}</name>
    <type>${escapeXml(trail.categoryLabel)}</type>
    <trkseg>
${trkptsXml}
    </trkseg>
  </trk>
</gpx>
`
}

/** Triggers a local browser file download of the generated GPX trace (`<slug>.gpx`). */
export function downloadTrailGpx(trail: Trail): void {
  const xml = generateGpxXml(trail)
  const blob = new Blob([xml], { type: 'application/gpx+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${trail.slug}.gpx`
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)

  window.setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}
