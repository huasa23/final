import DateAvailable from "./DateAvailable.ts";

/**
 * Representation of car data
 * @author Xingyu Zhou
 * */
export default interface CarData extends DateAvailable {
    driver_number: number;
    speed: number;
    rpm: number;
    throttle: number;
    brake: number;
    drs: number;
    date: string;
    session_key: number;
    meeting_key: number;
}