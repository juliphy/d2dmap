'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState, useEffect } from 'react'
import { SelectCity, SelectMode } from './components/select'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Session } from 'next-auth'
import { useSearchParams } from 'next/navigation'

export default function MapPage() {
    const { data: session } = useSession()
    const Map = useMemo(() => dynamic(
        () => import('@/app/components/map'),
        { 
            loading: () => <p>Mapa się ładuje...</p>,
            ssr: false
        }
    ), [])



    const [location, setLocationState] = useState<number[]>( [52.237049, 21.017532] ); // Default to Poland
    const [zoom, setZoom] = useState<number>(13);
    const [mapMode, setMapMode] = useState<"view" | "create">();

    const setLocationAndZoom = (coords: number[], zoomLevel = 13) => {
        setLocationState(coords);
        setZoom(zoomLevel);
    };

    const [zones, setZones] = useState<{ id: number, points: number[][], name: string, hoursFR: number, fullPZ: number, pz35Plus: number, efficiency: number, color: string, user: { name: string } }[]>([]);
    const searchParams = useSearchParams();
    const zoneIdParam = searchParams.get('zoneId');

    useEffect(() => {
        fetch('/api/zones')
            .then(res => res.json())
            .then(data => setZones(data));
    }, []);

    useEffect(() => {
        if (zoneIdParam && zones.length > 0) {
            const zone = zones.find(z => z.id === Number(zoneIdParam));
            if (zone) {
                const lat = zone.points.reduce((sum, p) => sum + p[0], 0) / zone.points.length;
                const lng = zone.points.reduce((sum, p) => sum + p[1], 0) / zone.points.length;
                setLocationAndZoom([lat, lng], 16);
            }
        }
    }, [zoneIdParam, zones]);
    const [currentPoints, setCurrentPoints] = useState<number[][]>([]);
    const [name, setName] = useState<string>("");
    const [hoursFR, setHoursFR] = useState<string>("");
    const [fullPZ, setFullPZ] = useState<string>("");
    const [pz35Plus, setPz35Plus] = useState<string>("");

    return <div className="p-4 flex flex-col gap-4 max-w-screen-md mx-auto">
        <div className="self-end flex gap-4">
            <AdminButton session={session}/>

            {session ? (
                <button className="text-primary" onClick={() => signOut()}>Wyloguj</button>
            ) : (
                <button className="text-primary" onClick={() => signIn()}>Zaloguj się</button>
            )}
        </div>
        <Map
            location={location}

            zoom={zoom}
            mode={mapMode}
            zones={zones}
            currentPoints={currentPoints}
            setCurrentPoints={setCurrentPoints}
        />
        <SelectCity setLocation={(coords) => setLocationAndZoom(coords)}/>

        <SelectMode setMode={setMapMode}/>
        {mapMode === "create" && session && (
            <div className="flex flex-col gap-2">
                <input
                    className="border p-2 rounded"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nazwa strefy"
                />
                <input
                    className="border p-2 rounded"
                    type="number"
                    value={hoursFR}
                    onChange={(e) => setHoursFR(e.target.value)}
                    placeholder="Ile godzin FR pracowali"
                />
                <input
                    className="border p-2 rounded"
                    type="number"
                    value={fullPZ}
                    onChange={(e) => setFullPZ(e.target.value)}
                    placeholder="Ile PZ pełnych"
                />
                <input
                    className="border p-2 rounded"
                    type="number"
                    value={pz35Plus}
                    onChange={(e) => setPz35Plus(e.target.value)}
                    placeholder="Ile PZ 35+"
                />
                <button
                    className="btn-primary"
                    onClick={async () => {
                        if (currentPoints.length >= 3) {
                            const res = await fetch('/api/zones', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    points: currentPoints,
                                    name,
                                    hoursFR: Number(hoursFR),
                                    fullPZ: Number(fullPZ),
                                    pz35Plus: Number(pz35Plus)
                                })
                            })
                            if (res.ok) {
                                const newZone = await res.json()
                                setZones([...zones, newZone])
                                setCurrentPoints([])
                                setName("")
                                setHoursFR("")
                                setFullPZ("")
                                setPz35Plus("")
                            } else {
                                alert('got error: ' + res.statusText)
                            }
                        } else {
                            alert("Należy zaznaczyć co najmniej 3 punkty");
                        }
                    }}
                >
                    Utwórz strefę
                </button>
            </div>
        )}
    </div>
}

type AdminButtonProps = {
    session: Session | null
}

function AdminButton(props: AdminButtonProps) {
    if (!props.session || props.session.user.role !== "ADMIN") {
        return <></>
    }

    return <Link className="text-primary" href="/admin/zones">Panel admina</Link>

}
