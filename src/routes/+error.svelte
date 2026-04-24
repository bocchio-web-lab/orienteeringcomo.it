<script lang="ts">
	import { page } from "$app/state";
</script>

<div
	class="m-auto flex flex-col items-center justify-center gap-4 py-8 text-center"
>
	<h1
		class="mb-0 text-[3rem] font-extrabold tracking-tight sm:text-[4rem] md:text-[5rem]"
	>
		{#if page.status === 404}
			Hai perso l'orientamento?
		{:else}
			Ops, qualcosa è andato storto!
		{/if}
	</h1>
	<p>Non ti preoccupare, torna all'ultimo punto noto e riattacca!</p>
</div>
