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
    futureEvents: Event[];
    pastEvents: Event[];
};


export const events: Event[] = [
    {
        name: "Lombardia Sprint Tour (3° Tappa)",
        date: new Date("2025-11-09"),
        location: "Sagnino, Como",
        description: "Terreno caratterizzato da un misto di aree urbane e bosco. Intricata rete di edifici e ristretti spazi aperti che richiedono una attenta lettura della mappa e rapidi cambi di direzione. Il terreno è prevalentemente pianeggiante, ma con alcune leggere salite che aggiungono varietà al percorso.",
        type: "competitive",
    },
    {
        name: "Festa Sociale",
        date: new Date("2025-09-06"),
        location: "Pianure di Loveno, Menaggio, Como",
        description: "Una giornata dedicata alla socializzazione e al divertimento per tutti i soci, seguita da una cena conviviale a base di grigliata mista. Il terreno è boschivo con vegetazione fitta, con zone sassose che richiedono precisione nella lettura della mappa. Il dislivello è moderato.",
        type: "social",
    },
    {
        name: "Trofeo Lombardia (4° Prova)",
        date: new Date("2024-09-14"),
        location: "Boschi di Lanzo d'Intelvi Nord, Como",
        description: "Bosco di faggi e castagni ad alta visibiltà e con percorribilità da buona a ottima.",
        type: "competitive",
    }
];

export function getEventGroups(referenceDate: Date = new Date()): EventGroups {
    const now = referenceDate.getTime();
    const sortedEvents = [...events].sort((a, b) => b.date.getTime() - a.date.getTime());
    const futureEvents = sortedEvents.filter((event) => event.date.getTime() >= now);
    const pastEvents = sortedEvents.filter((event) => event.date.getTime() < now);

    return {
        sortedEvents,
        futureEvents,
        pastEvents,
    };
}