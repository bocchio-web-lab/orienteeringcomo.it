<script lang="ts">
    import * as Card from "$lib/components/ui/card/index";
    import type { Event } from "$lib/types";

    let {
        event,
        reverse = false,
    }: {
        event: Event;
        reverse?: boolean;
    } = $props();

    let isLightboxOpen = $state(false);

    const eventTypeLabel: Record<Event["type"], string> = {
        competitive: "Gara competitiva",
        promotional: "Evento promozionale",
        social: "Evento sociale",
    };

    const eventTypeClasses: Record<Event["type"], string> = {
        competitive:
            "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
        promotional:
            "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        social: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    };

    const formattedDate = $derived.by(() =>
        new Intl.DateTimeFormat("it-IT", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(event.date),
    );

    const displayImage = $derived(
        event.image ??
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPwCnadEGicy0n_gYh1dtwygeMPBR3BZ9ahg&s",
    );

    function openLightbox() {
        isLightboxOpen = true;
    }

    function closeLightbox() {
        isLightboxOpen = false;
    }

    function onCardKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openLightbox();
        }
    }

    function onGlobalKeydown(event: KeyboardEvent) {
        if (event.key === "Escape" && isLightboxOpen) {
            closeLightbox();
        }
    }
</script>

<svelte:window onkeydown={onGlobalKeydown} />

<Card.Root
    class="relative h-full overflow-visible p-5 transition-transform duration-300 ease-out hover:z-10 hover:scale-[1.02] sm:p-6"
    role="button"
    tabindex={0}
    onkeydown={onCardKeydown}
    onclick={openLightbox}
>
    <div
        class={`flex flex-col-reverse items-center gap-5 md:items-start md:gap-10 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
    >
        <img
            src={displayImage}
            alt={`Immagine evento ${event.name}`}
            class={`h-28 w-28 shrink-0 rounded-full object-cover sm:h-32 sm:w-32 md:h-40 md:w-40 ${reverse ? "" : "scale-x-[-1]"}`}
            loading="lazy"
        />

        <div class="w-full text-center md:text-left">
            <Card.Header class="space-y-3 mb-5 px-0">
                <Card.Title
                    class="text-xl flex gap-2.5 mb-0 justify-center md:justify-between"
                >
                    {event.name}
                    <span
                        class={`hidden rounded-full border px-2.5 py-1 text-xs font-medium ${eventTypeClasses[event.type]} md:block`}
                    >
                        {eventTypeLabel[event.type]}
                    </span>
                </Card.Title>

                <Card.Description
                    class="text-muted-foreground text-xs mb-0 sm:text-sm"
                >
                    {formattedDate}
                    &middot;{" "}
                    {event.location}
                </Card.Description>
                <span
                    class={`rounded-full border px-2.5 py-1 text-xs font-medium ${eventTypeClasses[event.type]} md:hidden`}
                >
                    {eventTypeLabel[event.type]}
                </span>
            </Card.Header>

            <Card.Content class="px-0">
                <p class="leading-relaxed">{event.description}</p>
            </Card.Content>
        </div>
    </div>
</Card.Root>

{#if isLightboxOpen}
    <div
        class="fixed inset-0 z-999 flex items-center justify-center bg-black/85 p-4"
        role="dialog"
        aria-modal="true"
        aria-label={`Anteprima immagine evento ${event.name}`}
        tabindex={-1}
        onkeydown={onGlobalKeydown}
    >
        <button
            type="button"
            class="absolute inset-0"
            aria-label="Chiudi anteprima"
            onclick={closeLightbox}
        ></button>

        <button
            type="button"
            class="absolute top-4 right-4 z-10 rounded-full border border-white/25 bg-black/40 px-3 py-1 text-sm text-white transition-colors hover:bg-black/60"
            onclick={closeLightbox}
        >
            Chiudi
        </button>

        <div class="relative z-10 max-h-[90vh] max-w-[95vw]">
            <img
                src={displayImage}
                alt={`Immagine evento ${event.name}`}
                class="max-h-[90vh] max-w-[95vw] rounded-2xl object-contain shadow-2xl"
            />
        </div>
    </div>
{/if}
