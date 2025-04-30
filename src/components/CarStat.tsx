/**
 * Car stat component for a singular car
 * @author Xingyu Zhou
 * */

import {RefObject, useEffect, useState} from "react";
import TimePartitionedLoader from "../services/TimePartitionedLoader.ts";
import CarData from "../interfaces/CarData.ts";
import styled from "styled-components";

const START_S = "2023-10-29T20:00:00.000000+00:00";
const START = Date.parse(START_S);
const EMPTY = {
    driver_number: 0,
    speed: 0,
    rpm: 0,
    throttle: 0,
    brake: 0,
    drs: 0,
    date: "",
    session_key: 0,
    meeting_key: 0
}

const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
    padding: 1rem;
    background: #e0e0e0;
    color: #1e1e2f;
    border-radius: 8px;
    box-sizing: border-box;
    margin: 1mm;
`;

const StatCard = styled.div`
    background: #e0e0e0;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    text-align: center;
`;

const Label = styled.div`
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
    opacity: 0.75;
`;

const Value = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
`;

const BarContainer = styled.div`
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 0.5rem;
`;

const Bar = styled.div<{ ratio: number }>`
    width: ${p => Math.min(100, Math.max(0, p.ratio * 100))}%;
    height: 100%;
    background: #60c;
`;

const BarStatWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

export default function CarStat({timeRef, driverNumber}: {
    timeRef: RefObject<HTMLDivElement | null>,
    driverNumber: number
}) {
    const [fetcher, setFetcher] = useState<TimePartitionedLoader<CarData> | null>(null);
    const carData = getCarData(timeRef.current?.textContent);

    function getCarData(displayTime: string | null | undefined): CarData {
        if (displayTime) {
            const [minute, second] = displayTime.split(':');
            const date = new Date(START + Number(minute) * 60 * 1000 + Number(second) * 1000);
            return fetcher?.query(date) || EMPTY;
        } else {
            return EMPTY;
        }
    }

    useEffect(() => {
        const fetcher = new TimePartitionedLoader<CarData>("car_data_" + driverNumber);
        setFetcher(fetcher);
        fetcher.query(new Date(START));
    }, [driverNumber]);

    return (
        <Container>
            <StatCard>
                <Label>Driver #{carData.driver_number}</Label>
            </StatCard>
            <StatCard>
                <Label>Speed (km/h)</Label>
                <Value>{carData.speed.toFixed(0)}</Value>
            </StatCard>
            <StatCard>
                <Label>RPM</Label>
                <Value>{carData.rpm.toLocaleString()}</Value>
            </StatCard>
            <BarStatWrapper>
                <StatCard style={{padding: "2mm", width: "50%", marginRight: "1mm"}}>
                    <Label>Throttle</Label>
                    <BarContainer>
                        <Bar ratio={carData.throttle}/>
                    </BarContainer>
                </StatCard>
                <StatCard style={{padding: "2mm", width: "50%", marginLeft: "1mm"}}>
                    <Label>Brake</Label>
                    <BarContainer>
                        <Bar ratio={carData.brake}/>
                    </BarContainer>
                </StatCard>
            </BarStatWrapper>
            <StatCard>
                <Label>DRS</Label>
                <Value>{carData.drs ? "ON" : "OFF"}</Value>
            </StatCard>
        </Container>
    )
}