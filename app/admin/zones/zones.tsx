import { useEffect, useState } from "react";

export default function Zones() {
    const [zones, setZones] = useState<{ 
        points: number[][],
        createdAt: Date,
        name: string,
        hoursFR: number,
        fullPZ: number,
        pz35Plus: number,
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
                    key={zone.createdAt.toString()} 
                    className="flex justify-between items-stretch border rounded-2xl p-4 shadow-md bg-[#181818] border-[#818181] relative w-full max-w-xl"
                >
                    {/* LEFT SIDE: Info */}
                    <div className="flex flex-col justify-center gap-2">
                        <p>PZ: <span className="font-medium">{zone.fullPZ}</span></p>
                        <p>PZ+35: <span className="font-medium">{zone.pz35Plus}</span></p>
                        <p>Efektywność: <span className="font-medium">{zone.efficiency}</span></p>
                        <p>Ilość godzin: <span className="font-medium">{zone.hoursFR}</span></p>
                        <p>Od: {zone.user.name}</p>
                    </div>

                    {/* RIGHT SIDE: Name and Date */}
                    <div className="flex flex-col justify-between text-right w-40">
                        <p className="text-sm text-gray-500">{formatDate(new Date(zone.createdAt))}</p>
                        <h1 className="text-lg font-bold">{zone.name}</h1>
                        <a className="text-primary cursor-pointer antialiased font-medium">Go to zone</a>
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
