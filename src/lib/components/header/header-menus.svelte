<script lang="ts">
    import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
    import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";

    // import { IsMobile } from "$lib/components/hooks/is-mobile.svelte.js";

    // const isMobile = new IsMobile();
    const isMobile = false;

    type SubLink = {
        label: string;
        anchor: string;
    };

    type MenuSection = {
        label: string;
        href: string;
        links: SubLink[];
    };

    const menuSections: MenuSection[] = [
        {
            label: "Chi siamo",
            href: "/chi-siamo",
            links: [
                { label: "Società", anchor: "società" },
                { label: "Tesserati", anchor: "tesserati" },
            ],
        },
        {
            label: "Gare",
            href: "/gare",
            links: [
                { label: "Gare future", anchor: "in-arrivo" },
                { label: "Gare passate", anchor: "passate" },
            ],
        },
        {
            label: "Attività",
            href: "/attivita",
            links: [
                { label: "Team Building", anchor: "team-building" },
                { label: "Formazione", anchor: "formazione" },
                {
                    label: "Attività nelle scuole",
                    anchor: "attività-nelle-scuole",
                },
                { label: "Camp estivi", anchor: "camp-estivi" },
                { label: "Cartografia", anchor: "cartografia" },
            ],
        },
        {
            label: "Mappe",
            href: "/mappe",
            links: [],
        },
        {
            label: "Contattaci",
            href: "/contattaci",
            links: [],
        },
    ];
</script>

<NavigationMenu.Root viewport={isMobile}>
    <NavigationMenu.List class="flex-wrap">
        {#each menuSections as section (section.href)}
            <!-- Mobile Menu Item -->
            <NavigationMenu.Item class="md:hidden">
                <NavigationMenu.Link
                    href={section.href}
                    class={navigationMenuTriggerStyle()}
                >
                    {section.label}
                </NavigationMenu.Link>
                <span class="sr-only">Vai alla pagina {section.label}</span>
            </NavigationMenu.Item>

            <!-- Desktop Menu Item -->
            <NavigationMenu.Item class="hidden md:block">
                {#if section.links.length === 0}
                    <NavigationMenu.Link
                        href={section.href}
                        class={navigationMenuTriggerStyle()}
                    >
                        {section.label}
                    </NavigationMenu.Link>
                    <span class="sr-only">Vai alla pagina {section.label}</span>
                {:else}
                    <NavigationMenu.Trigger class="cursor-pointer">
                        <NavigationMenu.Link href={section.href} class="py-1.5">
                            {section.label}
                        </NavigationMenu.Link>
                        <span class="sr-only"
                            >Apri sottomenu {section.label}</span
                        >
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <ul class="grid w-50 gap-4 p-2">
                            {#each section.links as link (link.anchor)}
                                <li>
                                    <NavigationMenu.Link
                                        href={`${section.href}#${link.anchor}`}
                                    >
                                        {link.label}
                                    </NavigationMenu.Link>
                                </li>
                            {/each}
                        </ul>
                    </NavigationMenu.Content>
                {/if}
            </NavigationMenu.Item>
        {/each}
    </NavigationMenu.List>
</NavigationMenu.Root>
