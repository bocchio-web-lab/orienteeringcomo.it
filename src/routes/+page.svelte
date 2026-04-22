<script lang="ts">
    const PROFILE_IMG =
        "https://res.cloudinary.com/orienteeringcomo/image/upload/v1776814089/promo_riccardo_scalet.webp";

    function profileImage(width: number) {
        return `${PROFILE_IMG}?resize=${width}:*`;
    }
</script>

<div
    class="intro--banner m-auto flex flex-col items-center justify-center gap-4 py-12 text-center not-prose mx-8"
>
    <h1
        class="text-[3rem] font-extrabold tracking-tight leading-none sm:text-[4rem] md:text-[5rem]"
    >
        <span class="text-primary">Orienteering</span>
        <span class="text-secondary-foreground">Como</span>
    </h1>
    <p class="mt-4 px-4 sm:text-lg">
        Il sito di quelli che corrono per boschi e città alla ricerca di
        lanterne e con una mappa in mano.
    </p>
    <!-- Siamo gli artisti del perdersi esplorando -->
    <!-- Siamo gli artisti dell'esplorare, perdendosi -->
    <p class="italic">Ogni tanto ci perdiamo, ma in realtà esploriamo!</p>

    <img
        src={profileImage(800)}
        srcset={`
            ${profileImage(224)} 224w,
            ${profileImage(400)} 400w,
            ${profileImage(600)} 600w,
            ${profileImage(800)} 800w
        `}
        sizes="(min-width: 1024px) 800px, (min-width: 768px) 600px, (min-width: 640px) 400px, 224px"
        alt="Riccardo Scalet in azione durante una gara di orienteering"
        width="800"
        height="800"
        fetchpriority="high"
        decoding="async"
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
