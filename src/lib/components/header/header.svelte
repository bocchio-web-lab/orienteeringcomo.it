<script lang="ts">
	import { Card } from "$lib/components/ui/card/index";
	import HeaderLogo from "./header-logo.svelte";
	import HeaderMenus from "./header-menus.svelte";
</script>

<header class="bg-background/90 sticky top-0 z-50 w-full backdrop-blur-sm">
	<Card class="shadow-card-foreground/10 overflow-visible p-2">
		<div
			class="m-auto flex w-full max-w-(--breakpoint-xl) flex-col items-center gap-2 md:flex-row md:justify-between"
		>
			<HeaderLogo />
			<HeaderMenus />
		</div>
	</Card>
</header>
