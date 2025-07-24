'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState, useEffect } from 'react'
import { SelectCity, SelectMode } from './components/select'

export default function MyPage() {
    const Map = useMemo(() => dynamic(
        () => import('@/app/components/map'),
        { 
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    const [location, setLocation] = useState<number[]>( [51.107883, 17.038538] ); // Default to Wrocław
    const [mapMode, setMapMode] = useState<"view" | "create">();
    const [zones, setZones] = useState<{ points: number[][], description: string }[]>([]);

    useEffect(() => {
        fetch('/api/zones')
            .then(res => res.json())
            .then(data => setZones(data));
    }, []);
    const [currentPoints, setCurrentPoints] = useState<number[][]>([]);
    const [description, setDescription] = useState<string>("");

    return <div>
        <Map 
            location={location} 
            mode={mapMode} 
            zones={zones} 
            currentPoints={currentPoints} 
            setCurrentPoints={setCurrentPoints} 
        />
        <SelectCity setLocation={setLocation}/>
        <SelectMode setMode={setMapMode}/>
        {mapMode === "create" && (
            <div>
                <input 
                    type="text" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Введите описание зоны"
                />
                <button
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
