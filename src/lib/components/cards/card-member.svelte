<script lang="ts">
    import * as Card from "$lib/components/ui/card/index";
    import type { Member } from "$lib/data/members";

    let {
        member,
        reverse = false,
    }: {
        member: Member;
        reverse?: boolean;
    } = $props();

    function getDeterministicFallback(seed: string): string {
        const codeSum = Array.from(seed).reduce(
            (sum, char) => sum + char.charCodeAt(0),
            0,
        );

        return codeSum % 2 === 0
            ? "https://www.shutterstock.com/image-vector/default-placeholder-fitness-trainer-tshirt-260nw-1058724782.jpg"
            : "https://www.shutterstock.com/image-vector/default-placeholder-fitness-trainer-tshirt-260nw-1058724830.jpg";
    }
</script>

<Card.Root class="h-full p-6 transition-transform hover:scale-[1.2]">
    <div
        class={`flex flex-col-reverse items-center gap-5 md:items-start ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
    >
        <img
            src={member.image ?? getDeterministicFallback(member.name)}
            alt={`Foto profilo di ${member.name}`}
            class={`h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32 md:h-40 md:w-40 ${reverse ? "" : "scale-x-[-1]"}`}
            loading="lazy"
        />

        <div class="w-full text-center md:text-left">
            <Card.Header>
                <Card.Title>{member.name}</Card.Title>
                <Card.Description>{member.role}</Card.Description>
            </Card.Header>
            <Card.Content>{member.bio}</Card.Content>
        </div>
    </div>
</Card.Root>
