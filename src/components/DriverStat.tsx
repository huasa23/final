import {useEffect, useState} from "react";
import CarDataFetcher from "../services/CarDataFetcher.ts";
import CarData from "../interfaces/CarData.ts";

export default function DriverStat() {
    const [date, setDate] = useState("");
    const [fetcher, setFetcher] = useState<CarDataFetcher<CarData> | null>(null);

    useEffect(() => {
        setFetcher(new CarDataFetcher("car_data_1"));
    }, []);
    return (
        <>
            <input id={"car-data-test"} value={date} onChange={event => setDate(event.target.value)}/>
            <button onClick={() => {
                console.log(fetcher?.query(date))
            }}>fetch</button>
        </>
    )
}