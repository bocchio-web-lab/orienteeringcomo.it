<svelte:head>
    <title>Orienteering Como</title>
    <meta
        name="description"
        content="Il sito di quelli che corrono per boschi e città alla ricerca di lanterne e con una mappa in mano. Ogni tanto ci perdiamo, ma in realtà esploriamo!"
    />
</svelte:head>

<div
    class="intro--banner m-auto flex flex-col items-center justify-center gap-4 py-12 text-center not-prose mx-8"
>
    <h1
        class="text-[3rem] font-extrabold tracking-tight sm:text-[4rem] md:text-[5rem]"
    >
        <span class="text-primary">Orienteering</span>
        <span class="text-secondary-foreground">Como</span>
    </h1>
    <p class="px-4 sm:text-lg">
        Il sito di quelli che corrono per boschi e città alla ricerca di
        lanterne e con una mappa in mano.
    </p>
    <p class="italic">Ogni tanto ci perdiamo, ma in realtà esploriamo!</p>

    <img
        src="https://hips.hearstapps.com/hmg-prod/images/riccardo-scalet-1-644b6d7189381.jpg"
        alt="Riccardo Scalet in azione durante una gara di orienteering"
        class="mx-auto m-4 h-56 w-56 rounded-full object-cover sm:h-100 sm:w-100 md:h-150 md:w-150 lg:h-200 lg:w-200"
    />
</div>

<style>
    .intro--banner {
        animation: fadeIn 1s ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
