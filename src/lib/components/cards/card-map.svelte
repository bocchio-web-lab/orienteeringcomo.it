<script lang="ts">
    import { onMount } from "svelte";
    import * as Card from "$lib/components/ui/card";
    import type { Map } from "$lib/types";

    let { map }: { map: Map } = $props();
    let imageContainer = $state<HTMLDivElement>();
    let zoomLevel = $state(1);
    let panX = $state(0);
    let panY = $state(0);
    let isFullscreen = $state(false);
    let isPanning = $state(false);
    let activePointerId = $state<number | null>(null);
    let pointerStartX = $state(0);
    let pointerStartY = $state(0);
    let panStartX = $state(0);
    let panStartY = $state(0);

    const ZOOM_MIN = 1;
    const ZOOM_MAX = 4;
    const ZOOM_STEP = 0.25;

    function syncFullscreenState(): void {
        const target = imageContainer;
        if (!target) {
            isFullscreen = false;
            return;
        }

        const fullscreenElement =
            document.fullscreenElement ??
            (document as Document & { webkitFullscreenElement?: Element })
                .webkitFullscreenElement ??
            null;

        isFullscreen = fullscreenElement === target;

        if (!isFullscreen) {
            isPanning = false;
            activePointerId = null;
            zoomLevel = 1;
            panX = 0;
            panY = 0;
        }
    }

    function clampPan(nextX: number, nextY: number): { x: number; y: number } {
        const target = imageContainer;
        if (!target || zoomLevel <= 1) return { x: 0, y: 0 };

        const maxOffsetX = ((zoomLevel - 1) * target.clientWidth) / 2;
        const maxOffsetY = ((zoomLevel - 1) * target.clientHeight) / 2;

        return {
            x: Math.max(-maxOffsetX, Math.min(maxOffsetX, nextX)),
            y: Math.max(-maxOffsetY, Math.min(maxOffsetY, nextY)),
        };
    }

    function setPan(nextX: number, nextY: number): void {
        const clamped = clampPan(nextX, nextY);
        panX = clamped.x;
        panY = clamped.y;
    }

    const eventTypeClasses: Record<Map["type"], string> = {
        CO: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
        "CS/T": "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        MTBO: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        SCIO: "border-pink-500/30 bg-pink-500/10 text-pink-700 dark:text-pink-300",
    };

    const formattedDate = $derived.by(() => {
        if (!map.updated) return "Data non disponibile";

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

    async function openFullscreen(): Promise<void> {
        const target = imageContainer;
        if (!target) return;

        zoomLevel = 1;
        panX = 0;
        panY = 0;

        if (document.fullscreenEnabled && target.requestFullscreen) {
            await target.requestFullscreen();
            return;
        }

        window.open(displayImage, "_blank", "noopener,noreferrer");
    }

    async function closeFullscreen(event?: Event): Promise<void> {
        event?.stopPropagation();

        if (!document.fullscreenElement) return;
        zoomLevel = 1;
        panX = 0;
        panY = 0;
        await document.exitFullscreen();
    }

    function updateZoom(nextZoom: number, event?: Event): void {
        event?.stopPropagation();
        zoomLevel = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nextZoom));

        if (zoomLevel <= 1) {
            panX = 0;
            panY = 0;
            return;
        }

        setPan(panX, panY);
    }

    function zoomIn(event?: Event): void {
        updateZoom(zoomLevel + ZOOM_STEP, event);
    }

    function zoomOut(event?: Event): void {
        updateZoom(zoomLevel - ZOOM_STEP, event);
    }

    function resetZoom(event?: Event): void {
        updateZoom(1, event);
        panX = 0;
        panY = 0;
    }

    function isControlTarget(target: EventTarget | null): boolean {
        const element = target as HTMLElement | null;
        if (!element) return false;

        return !!element.closest(".fullscreen-toolbar, .fullscreen-close");
    }

    function handleImagePointerDown(event: PointerEvent): void {
        if (isControlTarget(event.target)) return;
        if (!isFullscreen || zoomLevel <= 1) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;

        event.stopPropagation();
        event.preventDefault();

        isPanning = true;
        activePointerId = event.pointerId;
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
        panStartX = panX;
        panStartY = panY;
        imageContainer?.setPointerCapture(event.pointerId);
    }

    function handleImagePointerMove(event: PointerEvent): void {
        if (isControlTarget(event.target)) return;
        if (!isFullscreen || !isPanning || activePointerId !== event.pointerId)
            return;

        event.stopPropagation();
        event.preventDefault();

        const deltaX = event.clientX - pointerStartX;
        const deltaY = event.clientY - pointerStartY;
        setPan(panStartX + deltaX, panStartY + deltaY);
    }

    function handleImagePointerUp(event: PointerEvent): void {
        if (isControlTarget(event.target) && activePointerId === null) return;
        if (activePointerId !== event.pointerId) return;

        event.stopPropagation();
        isPanning = false;
        activePointerId = null;
        imageContainer?.releasePointerCapture(event.pointerId);
    }

    function handleImageWheel(event: WheelEvent): void {
        if (!isFullscreen) return;

        event.stopPropagation();

        if (event.ctrlKey) {
            event.preventDefault();
            updateZoom(zoomLevel - event.deltaY * 0.0025, event);
            return;
        }

        if (zoomLevel <= 1) return;

        event.preventDefault();
        setPan(panX - event.deltaX, panY - event.deltaY);
    }

    async function handleCardKeydown(event: KeyboardEvent): Promise<void> {
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        await openFullscreen();
    }

    onMount(() => {
        const onFullscreenChange = () => {
            syncFullscreenState();
        };

        document.addEventListener("fullscreenchange", onFullscreenChange);
        document.addEventListener(
            "webkitfullscreenchange",
            onFullscreenChange as EventListener,
        );

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                onFullscreenChange,
            );
            document.removeEventListener(
                "webkitfullscreenchange",
                onFullscreenChange as EventListener,
            );
        };
    });
</script>

<Card.Root
    class="p-4 flex h-full cursor-pointer flex-col gap-4 overflow-hidden transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-md"
    role="button"
    tabindex={0}
    aria-label={`Apri la mappa ${map.name} a schermo intero`}
    onclick={() => {
        if (!isFullscreen) void openFullscreen();
    }}
    onkeydown={(event) => {
        void handleCardKeydown(event);
    }}
>
    <div
        bind:this={imageContainer}
        data-fullscreen={isFullscreen ? "true" : "false"}
        data-panning={isPanning ? "true" : "false"}
        class="map-image-container relative flex w-full items-center justify-center"
        role="application"
        aria-label={`Viewer mappa ${map.name}: trascina per spostare, usa Ctrl + rotella o i pulsanti per lo zoom`}
        onpointerdown={handleImagePointerDown}
        onpointermove={handleImagePointerMove}
        onpointerup={handleImagePointerUp}
        onpointercancel={handleImagePointerUp}
        onwheel={handleImageWheel}
    >
        <img
            src={displayImage}
            alt={`Immagine mappa ${map.name}`}
            class="map-image max-h-full max-w-full object-contain rounded-sm"
            style={`transform: translate3d(${panX}px, ${panY}px, 0) scale(${zoomLevel});`}
            loading="lazy"
        />
        <div class="fullscreen-toolbar" aria-label="Controlli zoom mappa">
            <button
                type="button"
                class="fullscreen-action"
                aria-label="Riduci zoom"
                onclick={(event) => {
                    zoomOut(event);
                }}
            >
                -
            </button>
            <button
                type="button"
                class="fullscreen-action"
                aria-label="Reimposta zoom"
                onclick={(event) => {
                    resetZoom(event);
                }}
            >
                {Math.round(zoomLevel * 100)}%
            </button>
            <button
                type="button"
                class="fullscreen-action"
                aria-label="Aumenta zoom"
                onclick={(event) => {
                    zoomIn(event);
                }}
            >
                +
            </button>
        </div>
        <button
            type="button"
            class="fullscreen-close"
            aria-label="Chiudi schermo intero"
            onclick={(event) => {
                void closeFullscreen(event);
            }}
        >
            Chiudi
        </button>
    </div>

    <Card.Header class="text-center px-0">
        <Card.Title class="text-lg leading-tight">
            <span>{map.name}</span>
        </Card.Title>

        <div class="text-xs font-medium mt-1">
            <span class="shrink-0 rounded-full border px-2.5 py-1">
                {formattedScale}
            </span>
            <span class="shrink-0 rounded-full border px-2.5 py-1">
                {formattedContours}
            </span>

            <span
                class={`shrink-0 rounded-full border px-2.5 py-1 ${eventTypeClasses[map.type]}`}
            >
                {map.type}
            </span>
        </div>

        <div class="text-xs text-muted-foreground text-center mt-2">
            Cartografia: {map.mapper ?? "Sconosciuta"}<br />
            Aggiornamento: {formattedDate}
        </div>
    </Card.Header>
</Card.Root>

<style>
    .fullscreen-close {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        border: 0;
        border-radius: 9999px;
        padding: 0.4rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: white;
        background: rgb(0 0 0 / 0.65);
        opacity: 0;
        pointer-events: none;
        transition: opacity 150ms ease;
    }

    .fullscreen-toolbar {
        position: absolute;
        bottom: 0.75rem;
        left: 50%;
        display: flex;
        gap: 0.5rem;
        transform: translateX(-50%);
        opacity: 0;
        pointer-events: none;
        transition: opacity 150ms ease;
    }

    .fullscreen-action {
        border: 0;
        border-radius: 9999px;
        min-width: 2.25rem;
        padding: 0.35rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 700;
        color: white;
        background: rgb(0 0 0 / 0.65);
    }

    .map-image {
        transition: transform 150ms ease;
        transform-origin: center center;
        will-change: transform;
    }

    :global(.map-image-container:fullscreen),
    :global(.map-image-container:-webkit-full-screen) {
        overflow: hidden;
        touch-action: none;
        cursor: grab;
        background: black;
    }

    :global(.map-image-container[data-panning="true"]:fullscreen),
    :global(.map-image-container[data-panning="true"]:-webkit-full-screen) {
        cursor: grabbing;
    }

    :global(.map-image-container:fullscreen) .fullscreen-close {
        opacity: 1;
        pointer-events: auto;
    }

    :global(.map-image-container:fullscreen) .fullscreen-toolbar {
        opacity: 1;
        pointer-events: auto;
    }

    :global(.map-image-container:-webkit-full-screen) .fullscreen-close {
        opacity: 1;
        pointer-events: auto;
    }

    :global(.map-image-container:-webkit-full-screen) .fullscreen-toolbar {
        opacity: 1;
        pointer-events: auto;
    }

    :global(.map-image-container:fullscreen) img,
    :global(.map-image-container:-webkit-full-screen) img {
        width: 100%;
        height: 100%;
        border-radius: 0;
    }
</style>
