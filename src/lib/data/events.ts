export type Event = {
    name: string;
    date: Date;
    location: string;
    description: string;
    image?: string;
    type: "competitive" | "promotional" | "social";
}

export type EventGroups = {
    sortedEvents: Event[];
    futureCompetitions: Event[];
    futurePromotionalSocial: Event[];
    pastEvents: Event[];
};


export const events: Event[] = [
    {
        name: "Gara Sociale 2024",
        date: new Date("2024-09-15"),
        location: "Parco di Villa Olmo, Como",
        description: "La nostra tradizionale gara sociale, aperta a tutti i membri della società. Un'occasione per divertirsi, competere e socializzare in un ambiente amichevole e accogliente.",
        type: "competitive",
    },
    {
        name: "Orienteering per Tutti",
        date: new Date("2024-10-20"),
        location: "Bosco di Cernobbio",
        description: "Un evento promozionale dedicato a chi vuole avvicinarsi all'orienteering. Saranno organizzati percorsi adatti a tutte le età e livelli di esperienza, con istruttori disponibili per guidare i partecipanti.",
        type: "promotional",
    },
    {
        name: "Cena Sociale di Fine Stagione",
        date: new Date("2024-11-30"),
        location: "Ristorante La Griglia, Como",
        description: "Un momento di convivialità per celebrare la fine della stagione. Tutti i membri sono invitati a partecipare a una cena speciale, con premi e riconoscimenti per i risultati ottenuti durante l'anno.",
        type: "social",
    },
];

export function getEventGroups(referenceDate: Date = new Date()): EventGroups {
    const now = referenceDate.getTime();

    const sortedEvents = [...events].sort(
        (a, b) => a.date.getTime() - b.date.getTime(),
    );

    const futureCompetitions = sortedEvents.filter(
        (event) => event.date.getTime() >= now && event.type === "competitive",
    );

    const futurePromotionalSocial = sortedEvents.filter(
        (event) =>
            event.date.getTime() >= now &&
            (event.type === "promotional" || event.type === "social"),
    );

    const pastEvents = sortedEvents.filter(
        (event) => event.date.getTime() < now,
    );

    return {
        sortedEvents,
        futureCompetitions,
        futurePromotionalSocial,
        pastEvents,
    };
}