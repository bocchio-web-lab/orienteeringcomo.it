<script lang="ts">
    import "./layout.css";
    import { page } from "$app/state";
    import favicon from "$lib/assets/favicon.svg";
    import Header from "$lib/components/header/header.svelte";
    import Footer from "$lib/components/footer/footer.svelte";

    let { children } = $props();
    let isHome = $derived(page.url.pathname === "/");
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>Orienteering Como</title>
    <meta
        name="description"
        content="Orienteering Como è un'associazione sportiva dilettantistica che promuove l'orienteering, uno sport all'aria aperta che combina corsa e navigazione con mappa e bussola. Offriamo allenamenti, gare e attività sociali per tutti i livelli, dai principianti agli atleti esperti. Unisciti a noi per esplorare nuovi territori e vivere l'emozione dell'orienteering!"
    />
</svelte:head>

<Header />

<main
    class={`${isHome ? "" : "prose prose-a:text-primary dark:prose-invert prose-headings:scroll-mt-24 prose-h1:text-center m-auto mt-8 mb-16 w-full max-w-4xl px-4 sm:px-6 lg:px-8"}`}
>
    {@render children?.()}
</main>

<Footer />
