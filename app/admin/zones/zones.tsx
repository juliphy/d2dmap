import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import trashIcon from "@/public/trash.svg"
export default function Zones() {
    const [zones, setZones] = useState<{
        id: number,
        points: number[][],
        createdAt: Date,
        name: string,
        hoursFR: number,
        fullPZ: number,
        pz35Plus: number,
        yellowStatusDate: Date,
        greenStatusDate: Date,
        efficiency: number,
        color: string,
        user: { name: string }
    }[]>([]);

    useEffect(() => {
        fetch('/api/zones')
            .then(res => res.json())
            .then(data => setZones(data));
    }, []);

    return (
        <div className="flex flex-col items-center gap-6">
            {zones.map((zone) => (
                <div
                    key={zone.id}
                    className="flex justify-between items-stretch border rounded-2xl p-4 shadow-md dark:bg-[#181818] border-[#818181] relative w-full max-w-xl"
                >
                    {/* LEFT SIDE: Info */}
                    <div className="flex flex-col justify-center gap-2">
                        <h1 className="font-semibold">{zone.name}</h1>
                        <p>PZ: <span className="font-medium">{zone.fullPZ}</span></p>
                        <p>PZ+35: <span className="font-medium">{zone.pz35Plus}</span></p>
                        <p>Efektywność: <span className="font-medium">{zone.efficiency}</span></p>
                        <p>Ilość godzin: <span className="font-medium">{zone.hoursFR}</span></p>
                        <p>Od: {zone.user.name}</p>
                    </div>

                    {/* RIGHT SIDE: Name and Date */}
                    <div className="flex flex-col justify-between text-right w-40">
                        <div>
                        <p className="text-sm text-red-500">{formatDate(new Date(zone.createdAt))}</p>
                        <p className="text-sm text-yellow-500">{formatDate(new Date(zone.yellowStatusDate))}</p>
                        <p className="text-sm text-green-500">{formatDate(new Date(zone.greenStatusDate))}</p>
                        </div>
                        <div className="flex ml-6 flex-row gap-4 items-right">
                            <Link className="text-primary cursor-pointer antialiased font-medium" href={`/map?zoneId=${zone.id}`}>Pokaż strefę</Link>
                            <Image
                                className="cursor-pointer"
                                color="#1CABE2"
                                src={trashIcon}
                                alt="delete zone"
                                width={24}
                                height={24}
                                onClick={async () => {
                                    const res = await fetch(`/api/zones?id=${zone.id}`, {
                                        method: 'DELETE'
                                    });
                                    if (res.ok) {
                                        setZones(prev => prev.filter(z => z.id !== zone.id));
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function formatDate(d: Date): string {
    const day = d.getDate().toString().padStart(2, '0');    
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); 
    const year = d.getFullYear();
    const timeHours = d.getHours().toString().padStart(2, '0');
    const timeMinutes = d.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year} ${timeHours}:${timeMinutes}`;
}
