<script lang="ts">
    import { Button } from "$lib/components/ui/button/index";
    import { Label } from "$lib/components/ui/label/index";
    import { contactEmail, requestOptions } from "$lib/config/contact";

    const inputClass =
        "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

    let fullName = $state("");
    let email = $state("");
    let requestType = $state<(typeof requestOptions)[number]["value"]>(
        requestOptions[0].value,
    );
    let message = $state("");
    let isSubmitting = $state(false);
    let submitMessage = $state("");
    let submitError = $state("");

    const selectedOption = $derived(
        requestOptions.find((option) => option.value === requestType) ??
            requestOptions[0],
    );

    const selectedSubject = $derived(selectedOption.subject);

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();

        const formElement = event.currentTarget as HTMLFormElement;
        const formData = new FormData(formElement);

        isSubmitting = true;
        submitError = "";
        submitMessage = "";

        try {
            const response = await fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams(
                    formData as unknown as Record<string, string>,
                ).toString(),
            });

            if (!response.ok) {
                throw new Error("Netlify submission failed");
            }

            submitMessage =
                "Richiesta inviata con successo. Ti risponderemo al piu presto.";

            fullName = "";
            email = "";
            requestType = requestOptions[0].value;
            message = "";
            formElement.reset();
        } catch {
            submitError =
                "Invio non riuscito. Riprova tra poco o scrivici via email diretta.";
        } finally {
            isSubmitting = false;
        }
    }
</script>

<svelte:head>
    <title>Contatti</title>
</svelte:head>

<h1>Contatti</h1>

<p>Ogni richiesta è diversa, raccontaci cosa hai in mente :)</p>
<p>
    Utilizza il modulo qui sotto per inviarci una richiesta o scrivici
    direttamente all'indirizzo email <a
        href={`mailto:${contactEmail}`}
        class="hover:text-foreground transition-colors">{contactEmail}</a
    >. Siamo sempre felici di rispondere a domande, discutere idee o
    semplicemente fare due chiacchiere sull'orienteering!
</p>

<div class="not-prose mt-6 rounded-3xl border border-border p-5 sm:p-6">
    {#if submitMessage}
        <p
            class="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300"
        >
            {submitMessage}
        </p>
    {/if}

    {#if submitError}
        <p
            class="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
            {submitError}
        </p>
    {/if}

    <form
        class="space-y-4"
        name="contact"
        method="POST"
        action="/"
        data-netlify="true"
        onsubmit={handleSubmit}
    >
        <input type="hidden" name="form-name" value="contact" />

        <input
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
            class="hidden"
            aria-hidden="true"
        />

        <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
                <Label for="fullName">Nome</Label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    bind:value={fullName}
                    minlength="2"
                    required
                    class={inputClass}
                    placeholder="Il tuo nome"
                />
            </div>

            <div class="space-y-2">
                <Label for="email">Email</Label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    bind:value={email}
                    required
                    class={inputClass}
                    placeholder="nome@azienda.it"
                />
            </div>
        </div>

        <div class="space-y-2">
            <Label for="requestType">Tipo richiesta</Label>
            <select
                id="requestType"
                name="requestType"
                bind:value={requestType}
                class={inputClass}
            >
                {#each requestOptions as option}
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>
            <input type="hidden" name="subject" value={selectedSubject} />
        </div>

        <div class="space-y-2">
            <Label for="message">Messaggio</Label>
            <textarea
                id="message"
                name="message"
                bind:value={message}
                minlength="10"
                required
                rows="6"
                class={inputClass}
                placeholder="Descrivi la tua richiesta..."
            ></textarea>
        </div>

        <div class="flex flex-wrap items-center gap-3">
            <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                class="w-full cursor-pointer"
            >
                {isSubmitting ? "Invio in corso..." : "Invia richiesta"}
            </Button>
        </div>
    </form>
</div>
