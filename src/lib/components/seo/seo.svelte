<script lang="ts">
    import { page } from "$app/state";

    let {
        title = "Home",
        description = "Orienteering Como promuove l'orienteering sul territorio comasco con gare, attivita e formazione per tutti i livelli.",
        image = "https://hips.hearstapps.com/hmg-prod/images/riccardo-scalet-1-644b6d7189381.jpg",
    } = $props<{
        title?: string;
        description?: string;
        image?: string;
    }>();

    const faviconSvg = "/favicon.svg";
    const faviconIco = "/favicon.ico";
    const appleTouchIcon = "/apple-touch-icon.png";
    const siteName = "Orienteering Como";
    const siteDomain = "orienteeringcomo.it";
    const siteUrl = "https://orienteeringcomo.it";

    const absolutePageUrl = $derived(
        `${siteUrl}${page.url.pathname.toString()}`,
    );

    const absoluteImage = $derived(
        image.startsWith("http://") || image.startsWith("https://")
            ? image
            : `${siteUrl}${image.startsWith("/") ? image : `/${image}`}`,
    );

    const pageTitle = $derived(`${title}`);

    const schema = $derived(
        JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: pageTitle,
            url: absolutePageUrl,
            image: absoluteImage,
        }),
    );
</script>

<svelte:head>
    <title>{pageTitle}</title>
    <link rel="icon" href={faviconSvg} type="image/svg+xml" />
    <link rel="alternate icon" href={faviconIco} type="image/x-icon" />
    <link rel="apple-touch-icon" href={appleTouchIcon} />
    <meta name="description" content={description} />

    <meta property="og:site_name" content={siteName} />
    <meta property="og:url" content={absolutePageUrl} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={absoluteImage} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:domain" content={siteDomain} />
    <meta property="twitter:url" content={absolutePageUrl} />
    <meta name="twitter:title" content={pageTitle} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={absoluteImage} />

    <link rel="canonical" href={absolutePageUrl} />

    {@html `<script type="application/ld+json">${schema}</script>`}
</svelte:head>
