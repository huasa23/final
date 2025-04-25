import styled from "styled-components";
import CarStat from "./CarStat.tsx";
import {RefObject} from "react";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

/**
 * Wrapper containing two CarStat components, created for styling
 * @author Xingyu Zhou
 * */
export default function CarStatBar({timeRef}: {timeRef: RefObject<HTMLDivElement | null>}) {
    return (
        <Wrapper>
            <CarStat timeRef={timeRef} driverNumber={1}/>
            <CarStat timeRef={timeRef} driverNumber={2}/>
        </Wrapper>
    )
}