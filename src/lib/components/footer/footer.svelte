<script lang="ts">
    import { Card } from "$lib/components/ui/card/index";
    import LogoOriComoBelow from "$lib/components/logo/oricomo-below.svelte";

    const currentYear = new Date().getFullYear();

    const footerData = {
        contactEmail: "info@orienteeringcomo.it",
        contactPhone: "+39 3487100208",
        address: "Viale Vittorio Veneto 9, 22079 Villa Guardia (CO)",
    };
</script>

<footer class="bottom-0 mt-auto w-full border-t bg-background">
    <Card class="rounded-none border-0 py-0 shadow-none">
        <div class="mx-auto w-full max-w-(--breakpoint-md) px-4 py-2">
            <div class="flex justify-evenly gap-8 m-auto items-center flex-row">
                <LogoOriComoBelow className="w-20 h-auto md:w-24" />
                <div class="text-center">
                    <p>
                        <a
                            href={`mailto:${footerData.contactEmail}`}
                            class="text-primary underline"
                        >
                            {footerData.contactEmail}
                        </a>
                    </p>
                    <p>
                        <a
                            href={`tel:${footerData.contactPhone.replace(/\s/g, "")}`}
                            class="text-primary underline"
                        >
                            {footerData.contactPhone}
                        </a>
                    </p>
                    <p>
                        <a
                            href="https://maps.app.goo.gl/MRPQuu67AEVXqtTx9"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-primary underline"
                        >
                            {footerData.address}
                        </a>
                    </p>
                </div>
            </div>

            <div
                class="border-t pt-4 pb-2 text-center text-xs text-muted-foreground"
            >
                <p>
                    &copy; {currentYear} Orienteering Como. Tutti i diritti riservati.
                </p>
            </div>
        </div>
    </Card>
</footer>
