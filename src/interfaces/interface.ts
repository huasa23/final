export interface Driver {
    driver_number: number;
    name_acronym: string;
    team_colour: string;
}
export interface Location {
    x: number;
    y: number;
    date: string;
}

export interface Position {
    position: number;
    driver_number: number;
    time: string;
}

export interface CarData {
    driver_number: number;
    speed: number;
    rpm: number;
    throttle: number;
    brake: number;
}