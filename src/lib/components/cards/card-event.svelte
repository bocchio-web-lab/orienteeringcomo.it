<script lang="ts">
    import * as Card from "$lib/components/ui/card/index";
    import type { Event } from "$lib/data/events";

    let {
        event,
        reverse = false,
    }: {
        event: Event;
        reverse?: boolean;
    } = $props();
</script>

<Card.Root class="h-full p-6 transition-transform hover:scale-[1.2]">
    <div
        class={`flex flex-col-reverse items-center gap-5 md:items-start ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
    >
        <img
            src={event.image ??
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPwCnadEGicy0n_gYh1dtwygeMPBR3BZ9ahg&s"}
            alt={`Foto profilo di ${event.name}`}
            class={`h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32 md:h-40 md:w-40 ${reverse ? "" : "scale-x-[-1]"}`}
            loading="lazy"
        />

        <div class="w-full text-center md:text-left">
            <Card.Header>
                <Card.Title>{event.name}</Card.Title>
                <Card.Description>{event.location}</Card.Description>
            </Card.Header>
            <Card.Content>{event.description}</Card.Content>
        </div>
    </div>
</Card.Root>
