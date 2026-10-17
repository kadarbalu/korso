import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, Marker, useMap, useMapEvents } from 'react-leaflet'
import { AutoResize, BaseTiles } from './mapParts'
import type { LatLng } from '../data/locations'

const pickerIcon = L.divIcon({
  className: '',
  html: '<div class="picker-pin">🍺</div>',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
})

interface Props {
  value: LatLng | null
  center: LatLng // where to look when nothing is pinned (district or known pub)
  onChange: (pos: LatLng) => void
}

function ClickToPin({ onChange }: { onChange: (pos: LatLng) => void }) {
  useMapEvents({ click: (e) => onChange([e.latlng.lat, e.latlng.lng]) })
  return null
}

function Recenter({ center }: { center: LatLng }) {
  const map = useMap()
  const [lat, lng] = center
  useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), 14))
  }, [lat, lng, map])
  return null
}

export default function LocationPicker({ value, center, onChange }: Props) {
  return (
    <MapContainer center={value ?? center} zoom={14} className="picker-map">
      <BaseTiles />
      <AutoResize />
      <ClickToPin onChange={onChange} />
      {!value && <Recenter center={center} />}
      {value && (
        <Marker
          position={value}
          icon={pickerIcon}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const ll = (e.target as L.Marker).getLatLng()
              onChange([ll.lat, ll.lng])
            },
          }}
        />
      )}
    </MapContainer>
  )
}
