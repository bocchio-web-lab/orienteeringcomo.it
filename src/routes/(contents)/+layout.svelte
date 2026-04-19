<script lang="ts">
    let { children } = $props();
</script>

<main
    class="prose prose-blue dark:prose-invert prose-headings:scroll-mt-24 prose-h1:text-center m-auto mt-8 mb-16 w-full max-w-4xl px-4 sm:px-6 lg:px-8"
>
    {@render children?.()}
</main>
