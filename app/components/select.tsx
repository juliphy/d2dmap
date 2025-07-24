import Select from "react-select";

const city_options = [
    {value: [51.107883, 17.038538], label: "Wrocław"},
    {value: [52.237049, 21.017532], label: "Warszawa"}
]

type SelectCityProps = {
    setLocation: (location: number[]) => void
}

type SelectModeProps = {
    setMode: (mode: "view" | "create") => void
}

type ModeOption = {
    value: "view" | "create";
    label: string;
};

export function SelectCity(props: SelectCityProps) {
    return <div className="my-2 text-black">
        <Select 
        defaultValue={{value: [52.237049, 21.017532], label: "Polska"}}
        onChange={
            (newLocation) => {
                if (newLocation === null) {
                    return;
                }
                props.setLocation(newLocation.value);
            }
        }
        options={city_options}/>
    </div>
}

export function SelectMode(props: SelectModeProps) {

    const options: ModeOption[] = [
        { value: "view", label: "Przegląd" },
        { value: "create", label: "Tworzenie" }
    ];
    
    return (
        <div className="my-2">
        <Select
            defaultValue={options[0]}
            onChange={(newMode: ModeOption | null) => {
                if (newMode === null) {
                    return;
                }
                props.setMode(newMode.value); // Теперь value — "view" | "create", ошибка ушла
            }}
            options={options}
        />
        </div>
    );
}
