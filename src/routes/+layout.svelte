<script lang="ts">
	import "./layout.css";
	import { page } from "$app/state";
	import Seo from "$lib/components/seo/seo.svelte";
	import Header from "$lib/components/header/header.svelte";
	import Footer from "$lib/components/footer/footer.svelte";

	let { children } = $props();
	let isHome = $derived(page.url.pathname === "/");

	const seoByPath: Record<string, { title: string; description: string }> = {
		"/": {
			title: "Orienteering Como",
			description:
				"Il sito di quelli che corrono per boschi e citta alla ricerca di lanterne e con una mappa in mano.",
		},
		"/attivita": {
			title: "Attivita",
			description:
				"Scopri tutte le attivita che offriamo per promuovere l'orienteering sul territorio comasco.",
		},
		"/gare": {
			title: "Gare",
			description:
				"Scopri tutte le gare di orienteering organizzate e in programma.",
		},
		"/chi-siamo": {
			title: "Chi siamo",
			description:
				"Scopri chi siamo, la nostra storia e i nostri tesserati dal 1992.",
		},
		"/contattaci": {
			title: "Contattaci",
			description:
				"Contattaci tramite modulo o email per gare, attivita, formazione e collaborazioni.",
		},
		"/mappe": {
			title: "Mappe",
			description:
				"Archivio delle mappe della societa con dettagli, filtri e visualizzazione geografica.",
		},
	};

	const currentSeo = $derived(
		seoByPath[page.url.pathname] ?? {
			title: "Pagina",
			description:
				"Pagina del sito Orienteering Como dedicata alle attivita della societa.",
		},
	);
</script>

<Seo title={currentSeo.title} description={currentSeo.description} />

<Header />

<main
	class={`${isHome ? "" : "prose prose-a:text-primary dark:prose-invert prose-headings:scroll-mt-24 prose-h1:text-center m-auto mt-8 mb-16 w-full max-w-4xl px-4 sm:px-6 lg:px-8"}`}
>
	{@render children?.()}
</main>

<Footer />
