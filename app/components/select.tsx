import { useState } from "react";

// Coordinates for supported cities
const cities: { name: string; coords: number[] }[] = [
    { name: "Wrocław", coords: [51.107883, 17.038538] },
    { name: "Warszawa", coords: [52.237049, 21.017532] },
];

type SelectCityProps = {
    // Allows passing optional zoom level when changing location
    setLocation: (location: number[], zoom?: number) => void;
};

type SelectModeProps = {
    setMode: (mode: "view" | "create") => void;
};

export function SelectCity(props: SelectCityProps) {
    const [selected, setSelected] = useState<string | null>(null);

    const toggleCity = (city: string, coords: number[]) => {
        if (selected === city) {
            setSelected(null);
            // Reset to whole Poland view
            props.setLocation([52.237049, 21.017532], 6);
        } else {
            setSelected(city);
            props.setLocation(coords, 13);
        }
    };

    return (
        <div className="flex gap-4 justify-center my-2">
            {cities.map((city) => (
                <label key={city.name} className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={selected === city.name}
                        onChange={() => toggleCity(city.name, city.coords)}
                    />
                    {city.name}
                </label>
            ))}
        </div>
    );
}

export function SelectMode(props: SelectModeProps) {
    const [mode, setMode] = useState<"view" | "create">("view");

    const handleClick = (newMode: "view" | "create") => {
        setMode(newMode);
        props.setMode(newMode);
    };

    return (
        <div className="flex justify-center my-2">
            <button
                className={`px-4 py-2 border rounded-l ${
                    mode === "create" ? "bg-primary text-white" : "bg-white text-black"
                }`}
                onClick={() => handleClick("create")}
            >
                Tworzenie
            </button>
            <button
                className={`px-4 py-2 border rounded-r ${
                    mode === "view" ? "bg-primary text-white" : "bg-white text-black"
                }`}
                onClick={() => handleClick("view")}
            >
                Przegląd
            </button>
        </div>
    );
}
