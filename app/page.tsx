'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState, useEffect } from 'react'
import { SelectCity, SelectMode } from './components/select'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function MyPage() {
    const { data: session } = useSession()
    const Map = useMemo(() => dynamic(
        () => import('@/app/components/map'),
        { 
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    const [location, setLocation] = useState<number[]>( [51.107883, 17.038538] ); // Default to Wrocław
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
        <div className="self-end flex gap-2">
            {session ? (
                <button className="text-blue-600" onClick={() => signOut()}>Sign out</button>
            ) : (
                <button className="text-blue-600" onClick={() => signIn()}>Sign in</button>
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
                    placeholder="Введите описание зоны"
                />
                <button
                    className="bg-blue-600 text-white py-2 px-4 rounded"
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
                                alert('Ошибка сохранения зоны')
                            }
                        } else {
                            alert("Зона требует минимум 3 точек!");
                        }
                    }}
                >
                    Сохранить зону
                </button>
            </div>
        )}
    </div>
}
