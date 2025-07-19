'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
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
                    onClick={() => {
                        if (currentPoints.length >= 3) {
                            setZones([...zones, { points: currentPoints, description }]);
                            setCurrentPoints([]);
                            setDescription("");
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
