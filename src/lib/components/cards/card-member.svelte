<script lang="ts">
	import * as Card from "$lib/components/ui/card/index";
	import type { Member } from "$lib/types";

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

<Card.Root
	class="relative h-full overflow-visible p-5 transition-transform duration-300 ease-out hover:z-10 hover:scale-[1.02] sm:p-6"
>
	<div
		class={`flex flex-col-reverse items-center gap-5 md:items-start md:gap-10 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
	>
		<img
			src={member.image ?? getDeterministicFallback(member.name)}
			alt={`Foto profilo di ${member.name}`}
			class={`h-28 w-28 shrink-0 rounded-full object-cover sm:h-32 sm:w-32 md:h-40 md:w-40 ${reverse ? "" : "scale-x-[-1]"}`}
			loading="lazy"
		/>

		<div class="w-full text-center md:text-left">
			<Card.Header class="mb-5 space-y-3 px-0">
				<Card.Title
					class="mb-0 flex justify-center gap-2.5 text-xl md:justify-between"
				>
					{member.name}
				</Card.Title>

				<Card.Description
					class="text-muted-foreground mb-0 text-xs sm:text-sm"
				>
					{member.role}
				</Card.Description>
			</Card.Header>

			<Card.Content class="px-0">
				<p class="leading-relaxed">{member.bio}</p>
			</Card.Content>
		</div>
	</div>
</Card.Root>
