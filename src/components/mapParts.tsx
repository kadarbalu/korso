import { useEffect } from 'react'
import { TileLayer, useMap } from 'react-leaflet'

/** OpenStreetMap tiles: free for light use, attribution required. */
export function BaseTiles() {
  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      maxZoom={19}
    />
  )
}

/** Leaflet measures its container once; re-measure whenever the container resizes. */
export function AutoResize() {
  const map = useMap()
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(map.getContainer())
    return () => observer.disconnect()
  }, [map])
  return null
}
