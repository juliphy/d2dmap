import { MapContainer, Marker, Popup, TileLayer, useMap, Polyline, Polygon } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { useEffect, useState, Dispatch, SetStateAction, useRef } from "react"
import { LatLng, LatLngExpression } from "leaflet"
import { useMapEvents } from "react-leaflet"

type MapProps = {
    location: number[]
    zoom: number
    mode: "view" | "create" | undefined
    zones: { id: number, points: number[][], name: string, hoursFR: number, fullPZ: number, pz35Plus: number, efficiency: number, color: string, user: { name: string } }[]
    currentPoints: number[][]
    setCurrentPoints: Dispatch<SetStateAction<number[][]>>
}

function CreateZoneHandler({ mode, setCurrentPoints }: { mode: "view" | "create" | undefined, setCurrentPoints: Dispatch<SetStateAction<number[][]>> }) {
    useMapEvents({
        click: (e) => {
            if (mode === "create") {
                setCurrentPoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
            }
        },
    });
    return null;
}

export default function MyMap(props: MapProps) {
    return (
        <MapContainer className="w-full h-128" center={{ lat: 52.237049, lng: 21.017532 }} zoom={6} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyTo location={props.location} zoom={props.zoom} />
            <LocationMarker />
            <CreateZoneHandler mode={props.mode} setCurrentPoints={props.setCurrentPoints} />
            {props.zones.map((zone) => (
                <Polygon
                    key={zone.id}
                    positions={zone.points as LatLngExpression[]}
                    pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.5 }}
                >
                    <Popup>
                        <div>
                            <p><b>Nazwa:</b> {zone.name}<br/>
                            <b>Godziny FR:</b> {zone.hoursFR}<br/>
                            <b>PZ pełnych:</b> {zone.fullPZ}<br/>
                            <b>PZ 35+:</b> {zone.pz35Plus}<br/>
                            <b>Efektywność:</b> {zone.efficiency.toFixed(2)}<br/>
                            <b>Wysłane przez:</b> {zone.user.name}
                            </p>
                        </div>
                    </Popup>
                </Polygon>
            ))}
            {props.mode === "create" && props.currentPoints.length > 0 && (
                <Polyline 
                    positions={props.currentPoints as LatLngExpression[]} 
                    pathOptions={{ color: 'red' }} 
                />
            )}
        </MapContainer>
    );
}

function FlyTo({ location, zoom }: { location: number[], zoom: number }) {
    const map = useMap();
    const first = useRef(true);
    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        if (location) {
            map.flyTo([location[0], location[1]], zoom);
        }
    }, [location, map, zoom]);
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
