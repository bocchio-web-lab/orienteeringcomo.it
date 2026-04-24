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
	contours: number;
	latitude: number;
	longitude: number;
	location: string;
	updated?: Date | null;
	mapper?: string | null;
	code?: string | null;
	standard?: "ISOM" | "ISSprOM" | null;
	image?: string | null;
	file?: string | null;
};
