export type EventType = "competitive" | "promotional" | "social";

export type Event = {
    id?: number;
    name: string;
    date: Date;
    type: EventType;
    location: string;
    description: string;
    image?: string | null;
};

export type Member = {
    id?: number;
    name: string;
    role: string;
    bio: string;
    image?: string | null;
};

export type Map = {
    id: number;
    name: string;
    type: "CO" | "CS/T" | "MTBO" | "SCIO";
    scale: number;
    contours: number | null;
    latitude: number;
    longitude: number;
    location: string;
    created?: Date | null;
    updated?: Date | null;
    mapper?: string | null;
    notes?: string | null;
    image?: string | null;
};
