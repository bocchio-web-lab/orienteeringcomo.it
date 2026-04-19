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
            label: "Gare ed eventi",
            href: "/gare-ed-eventi",
            links: [
                { label: "Gare future", anchor: "gare-future" },
                { label: "Eventi futuri", anchor: "eventi-futuri" },
                {
                    label: "Gare ed eventi passati",
                    anchor: "gare-ed-eventi-passati",
                },
            ],
        },
        {
            label: "Servizi",
            href: "/servizi",
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
    ];
</script>

<NavigationMenu.Root viewport={isMobile}>
    <NavigationMenu.List class="flex-wrap">
        {#each menuSections as section (section.href)}
            <NavigationMenu.Item>
                <NavigationMenu.Trigger class="cursor-pointer">
                    <NavigationMenu.Link href={section.href}>
                        {section.label}
                    </NavigationMenu.Link>
                    <span class="sr-only">Apri sottomenu {section.label}</span>
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
            </NavigationMenu.Item>
        {/each}

        <NavigationMenu.Item>
            <NavigationMenu.Link
                href="/contatti"
                class={navigationMenuTriggerStyle()}
            >
                Contattaci
            </NavigationMenu.Link>
        </NavigationMenu.Item>
    </NavigationMenu.List>
</NavigationMenu.Root>
