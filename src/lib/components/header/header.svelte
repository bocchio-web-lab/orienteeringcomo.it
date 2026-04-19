<script lang="ts">
    import { Card } from "$lib/components/ui/card/index";
    import HeaderLogo from "./header-logo.svelte";
    import HeaderMenus from "./header-menus.svelte";
</script>

<header class="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-sm">
    <Card class="overflow-visible p-2 shadow-card-foreground/10">
        <div
            class="m-auto flex w-full max-w-(--breakpoint-xl) flex-col items-center gap-2 md:flex-row md:justify-between"
        >
            <HeaderLogo />
            <HeaderMenus />
        </div>
    </Card>
</header>
