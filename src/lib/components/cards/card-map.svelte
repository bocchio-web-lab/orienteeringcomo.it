<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import type { Map } from "$lib/types";

    let { map }: { map: Map } = $props();

    const eventTypeClasses: Record<Map["type"], string> = {
        CO: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
        "CS/T": "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        MTBO: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        SCIO: "border-pink-500/30 bg-pink-500/10 text-pink-700 dark:text-pink-300",
    };

    const formattedDate = $derived.by(() => {
        if (!map.updated) return "Data non disponibile";

        // ADDED: The return statement was missing here!
        return new Intl.DateTimeFormat("it-IT", {
            month: "long",
            year: "numeric",
        }).format(map.updated);
    });

    const formattedScale = $derived.by(() => {
        if (!map.scale) return "1:?";
        return `1:${map.scale.toLocaleString("it-IT", { useGrouping: "always" })}`;
    });

    const formattedContours = $derived.by(() => {
        if (!map.contours) return "?m";
        return `${map.contours}m`;
    });

    const displayImage = $derived(
        map.image ??
            "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1200&auto=format&fit=crop",
    );
</script>

<Card.Root
    class="p-4 flex h-full flex-col overflow-hidden transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-md"
    role="button"
    tabindex={0}
>
    <div class="relative flex w-full items-center justify-center">
        <img
            src={displayImage}
            alt={`Immagine mappa ${map.name}`}
            class="max-h-[80vh] max-w-full object-contain rounded-sm"
            loading="lazy"
        />
    </div>

    <Card.Header class="space-y-3 p-0 md:space-y-0">
        <Card.Title
            class="flex flex-col items-center justify-between gap-2 text-lg leading-tight md:text-xl md:flex-row"
        >
            <span>{map.name}</span>
            <div>
                <span
                    class="shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium"
                >
                    {formattedScale}
                </span>
                <span
                    class="shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium"
                >
                    {formattedContours}
                </span>

                <span
                    class={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${eventTypeClasses[map.type]}`}
                >
                    {map.type}
                </span>
            </div>
        </Card.Title>

        <Card.Description class="text-xs text-center sm:text-sm md:text-left">
            Cartografia: {map.mapper ?? "Sconosciuta"}<br />
            Aggiornamento: {formattedDate}
        </Card.Description>
    </Card.Header>
</Card.Root>
