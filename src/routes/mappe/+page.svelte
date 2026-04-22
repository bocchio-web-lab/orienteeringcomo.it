<script lang="ts">
    import "leaflet/dist/leaflet.css";
    import { onMount } from "svelte";
    import CardMap from "$lib/components/cards/card-map.svelte";
    import { Input } from "$lib/components/ui/input";
    import * as Select from "$lib/components/ui/select";
    import OriComoLogo from "$lib/assets/oricomo-below.svg";
    import type { Map as TeamMap } from "$lib/types";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    let searchQuery = $state("");
    let typeFilter = $state<"all" | TeamMap["type"]>("all");
    let mapElement = $state<HTMLDivElement>();
    let L: typeof import("leaflet") | undefined;
    let leafletMap: import("leaflet").Map | undefined;
    let leafletLayer: import("leaflet").LayerGroup | undefined;
    let defaultIcon: import("leaflet").DivIcon | undefined;

    const typeOptions = [
        { value: "all", label: "Tutti" },
        { value: "CO", label: "CO" },
        { value: "CS/T", label: "CS/T" },
        { value: "MTBO", label: "MTBO" },
        { value: "SCIO", label: "SCIO" },
    ] as const;

    const filteredMaps = $derived.by(() =>
        data.maps.filter((mapItem) => {
            const normalizedQuery = searchQuery.trim().toLowerCase();
            const matchesType =
                typeFilter === "all" || mapItem.type === typeFilter;
            const matchesText =
                normalizedQuery.length === 0 ||
                mapItem.name.toLowerCase().includes(normalizedQuery) ||
                mapItem.location.toLowerCase().includes(normalizedQuery);

            return matchesType && matchesText;
        }),
    );

    function renderMarkers(): void {
        if (!L || !leafletMap || !leafletLayer || !defaultIcon) return;

        leafletLayer.clearLayers();

        for (const mapItem of data.maps) {
            const isFiltered = filteredMaps.includes(mapItem);

            const marker = L.marker([mapItem.latitude, mapItem.longitude], {
                icon: defaultIcon,
                opacity: isFiltered ? 1 : 0.5,
            });

            marker.bindPopup(`
                <div class="text-center">
                    <strong>${mapItem.name}</strong><br>
                    <small class="text-muted-foreground">Scala 1:${mapItem.scale} &middot; Equidistanza ${mapItem.contours}m</small><br>
                    <button
                        class="mt-2 rounded px-3 py-1 text-sm bg-primary text-primary-foreground cursor-pointer hover:bg-primary/80"
                        onclick="{
                            document.getElementById('search').value = '${mapItem.name}';
                            document.getElementById('search').dispatchEvent(new Event('input'));
                            document.getElementById('filters').scrollIntoView({ behavior: 'smooth' });
                        }">
                        Vai alla mappa
                    </button>
                </div>
            `);

            marker.on("click", () =>
                leafletMap?.panTo([mapItem.latitude, mapItem.longitude]),
            );

            marker.addTo(leafletLayer);
        }
    }

    $effect(() => {
        if (filteredMaps && leafletLayer) {
            renderMarkers();
        }
    });

    onMount(() => {
        const setup = async () => {
            if (!mapElement) return;

            L = await import("leaflet");

            defaultIcon = L.divIcon({
                html: `<img src="${OriComoLogo}" alt="Marker" class="w-8 h-8 bg-white rounded-md" style="padding: 2px;" />`,
                className: "",
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, 8],
            });

            leafletMap = L.map(mapElement, {
                zoomControl: false,
                scrollWheelZoom: true,
            }).fitBounds(data.maps.map((map) => [map.latitude, map.longitude]));

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(leafletMap);

            leafletLayer = L.layerGroup().addTo(leafletMap);
            renderMarkers();
        };

        void setup();

        return () => {
            leafletMap?.remove();
            leafletMap = undefined;
            leafletLayer = undefined;
            L = undefined;
        };
    });
</script>

<h1 id="mappe">Mappe</h1>

<p>
    In questa sezione troverai le mappe di proprietà della società, realizzate e
    utilizzate per le nostre gare e sessioni di allenamento. Vuoi utilizzare le
    nostre mappe per scuole, eventi o altri progetti?
    <a href="/contattaci">Contattaci per richiedere l'autorizzazione.</a>
</p>

<blockquote
    class="font-normal rounded-lg border-l-4 border-amber-500 bg-amber-500/10 p-5 text-amber-900"
>
    <strong>&#9888; Copyright e Condizioni d'Uso</strong><br />
    Le mappe sono protette da diritto d'autore e sono fornite
    <strong>esclusivamente per uso personale</strong> degli appassionati. È severamente
    vietata la riproduzione, distribuzione o l'utilizzo commerciale senza il nostro
    permesso esplicito.
</blockquote>

<h2>Esplora l'archivio</h2>

<p>
    Clicca direttamente sui marker per visualizzare il nome della mappa, la
    scala e l'equidistanza. Usa i filtri per cercare mappe specifiche per nome,
    località o tipologia.
</p>

{#if data.dbError}
    <p
        class="not-prose mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
        {data.dbError}
    </p>
{/if}

<div
    id="map-container"
    class="relative z-0 h-105 overflow-hidden rounded-2xl border border-border scroll-mt-33 md:scroll-mt-22"
>
    <div bind:this={mapElement} class="h-full w-full"></div>
</div>

<div
    id="filters"
    class="my-4 space-y-4 grid gap-2 items-start scroll-mt-33 md:grid-cols-[2fr_1fr] md:scroll-mt-22"
>
    <div class="space-y-2">
        <Input
            id="search"
            type="search"
            placeholder="Cerca per nome o località..."
            bind:value={searchQuery}
        />
    </div>
    <div class="space-y-2">
        <Select.Root type="single" name="mapTypeFilter" bind:value={typeFilter}>
            <Select.Trigger class="w-full mb-0">
                {typeOptions.find((option) => option.value === typeFilter)
                    ?.label ?? "Tutti"}
            </Select.Trigger>
            <Select.Content>
                <Select.Group>
                    <Select.Label>Tipo mappa</Select.Label>
                    {#each typeOptions as option (option.value)}
                        <Select.Item value={option.value} label={option.label}>
                            {option.label}
                        </Select.Item>
                    {/each}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    </div>
</div>

<div class="grid gap-4 not-prose">
    {#if filteredMaps.length > 0}
        {#each filteredMaps as mapItem}
            <CardMap map={mapItem} />
        {/each}
    {:else}
        <p class="text-sm text-muted-foreground">
            Nessuna mappa trovata con i filtri attuali.
        </p>
    {/if}
</div>
