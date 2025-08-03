'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState, useEffect } from 'react'
import { SelectCity, SelectMode } from './components/select'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Session } from 'next-auth'
import type { Zone } from './components/map'

export default function MyPage() {
    const { data: session } = useSession()
    const Map = useMemo(() => dynamic(
        () => import('@/app/components/map'),
        { 
            loading: () => <p>Mapa się ładuje...</p>,
            ssr: false
        }
    ), [])


    const [location, setLocation] = useState<number[]>( [52.237049, 21.017532] ); // Default to Poland
    const [mapMode, setMapMode] = useState<"view" | "create">();
    const [zones, setZones] = useState<Zone[]>([]);

    useEffect(() => {
        fetch('/api/zones')
            .then(res => res.json())
            .then(data => setZones(data as Zone[]));
    }, []);
    const [currentPoints, setCurrentPoints] = useState<number[][]>([]);
    const [description, setDescription] = useState<string>("");
    const [duration, setDuration] = useState<number>(1);
    const [durationUnit, setDurationUnit] = useState<'days' | 'weeks' | 'months'>('days');

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
            mode={mapMode}
            zones={zones}
            currentPoints={currentPoints}
            setCurrentPoints={setCurrentPoints}
        />
        <SelectCity setLocation={setLocation}/>
        <SelectMode setMode={setMapMode}/>
        {mapMode === "create" && session && (
            <div className="flex flex-col gap-2">
                <input
                    className="border p-2 rounded"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Wpisz opis strefy"
                />
                <div className="flex gap-2">
                    <input
                        className="border p-2 rounded w-full"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        min={1}
                    />
                    <select
                        className="border p-2 rounded"
                        value={durationUnit}
                        onChange={(e) => setDurationUnit(e.target.value as 'days' | 'weeks' | 'months')}
                    >
                        <option value="days">Dni</option>
                        <option value="weeks">Tygodnie</option>
                        <option value="months">Miesiące</option>
                    </select>
                </div>
                <button
                    className="btn-primary"
                    onClick={async () => {
                        if (currentPoints.length >= 3) {
                            const res = await fetch('/api/zones', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ points: currentPoints, description, duration, durationUnit })
                            })
                            if (res.ok) {
                                const newZone = await res.json()
                                setZones([...zones, newZone])
                                setCurrentPoints([])
                                setDescription("")
                                setDuration(1)
                                setDurationUnit('days')
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

    return <Link className="text-primary" href="/admin">Panel admina</Link>

}
