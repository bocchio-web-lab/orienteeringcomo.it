<script lang="ts">
	import { Card } from "$lib/components/ui/card/index";

	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-background bottom-0 mt-auto w-full border-t">
	<Card class="rounded-none border-0 py-0 shadow-none">
		<div class="mx-auto w-full max-w-(--breakpoint-xl) p-4">
			<p class="text-muted-foreground text-center text-xs">
				&copy; {currentYear} Orienteering Como. Tutti i diritti riservati.
			</p>
		</div>
	</Card>
</footer>
