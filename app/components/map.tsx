import { MapContainer, Marker, Popup, TileLayer, useMap, Polyline, Polygon } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { useEffect, useState } from "react"
import { LatLng, LatLngExpression } from "leaflet"
import { useMapEvents } from "react-leaflet"

type MapProps = {
    location: number[]
    mode: "view" | "create" | undefined
    zones: { points: number[][], description: string }[]
    currentPoints: number[][]
    setCurrentPoints: (points: number[][]) => void
}

// Новый компонент для обработки кликов в режиме create
function CreateZoneHandler({ mode, setCurrentPoints }: { mode: "view" | "create" | undefined, setCurrentPoints: (points: number[][]) => void }) {
    if (mode !== "create") return null;

    useMapEvents({
        click: (e) => {
            setCurrentPoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
        },
    });

    return null;
}

export default function MyMap(props: MapProps) {
    return (
        <MapContainer className="w-[100%] h-128" center={{ lat: 51.505, lng: -0.09 }} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyTo location={props.location} />
            <LocationMarker />

            {/* Обработчик создания зон */}
            <CreateZoneHandler mode={props.mode} setCurrentPoints={props.setCurrentPoints} />

            {/* Отображение сохранённых зон как полигонов с попапами */}
            {props.zones.map((zone, index) => (
                <Polygon 
                    key={index} 
                    positions={zone.points as LatLngExpression[]} 
                    pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.5 }}
                >
                    <Popup>{zone.description || "Без описания"}</Popup>
                </Polygon>
            ))}

            {/* Отображение текущей создаваемой зоны как линии */}
            {props.mode === "create" && props.currentPoints.length > 0 && (
                <Polyline 
                    positions={props.currentPoints as LatLngExpression[]} 
                    pathOptions={{ color: 'red' }} 
                />
            )}
        </MapContainer>
    );
}

function FlyTo({ location }: { location: number[] }) {
    const map = useMap();

    useEffect(() => {
        if (location) {
            map.flyTo([location[0], location[1]], 13);
        }
    }, [location, map]);

    return null;
}

function LocationMarker() {
    const [position, setPosition] = useState<LatLng | null>(null)
    const map = useMapEvents({
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}
