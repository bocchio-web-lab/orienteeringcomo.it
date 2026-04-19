export const contactEmail = "info@orienteeringcomo.it";

export const requestOptions = [
    {
        value: "team-building",
        label: "Team Building",
        subject: "Richiesta Team Building",
    },
    {
        value: "formazione",
        label: "Formazione",
        subject: "Richiesta Formazione",
    },
    {
        value: "scuole",
        label: "Attivita nelle scuole",
        subject: "Richiesta Attivita nelle scuole",
    },
    {
        value: "camp-estivi",
        label: "Camp estivi",
        subject: "Richiesta Camp estivi",
    },
    {
        value: "cartografia",
        label: "Cartografia",
        subject: "Richiesta Cartografia",
    },
    {
        value: "nuovo-socio",
        label: "Diventare tesserato",
        subject: "Richiesta Nuova Iscrizione",
    },
    {
        value: "altro",
        label: "Altro",
        subject: "Richiesta Informazioni",
    },
] as const;

export type RequestType = (typeof requestOptions)[number]["value"];
