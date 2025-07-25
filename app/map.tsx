'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState, useEffect } from 'react'
import { SelectCity, SelectMode } from './components/select'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Session } from 'next-auth'

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
    const [zones, setZones] = useState<{ points: number[][], description: string, color: string }[]>([]);

    useEffect(() => {
        fetch('/api/zones')
            .then(res => res.json())
            .then(data => setZones(data));
    }, []);
    const [currentPoints, setCurrentPoints] = useState<number[][]>([]);
    const [description, setDescription] = useState<string>("");

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
                <button
                    className="btn-primary"
                    onClick={async () => {
                        if (currentPoints.length >= 3) {
                            const res = await fetch('/api/zones', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ points: currentPoints, description })
                            })
                            if (res.ok) {
                                const newZone = await res.json()
                                setZones([...zones, newZone])
                                setCurrentPoints([])
                                setDescription("")
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
