<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Textarea } from "$lib/components/ui/textarea";
    import * as Select from "$lib/components/ui/select";
    import { CONTACTS } from "$lib";

    const subjects = [
        {
            value: "nuovo-socio",
            label: "Diventare tesserato",
        },
        {
            value: "team-building",
            label: "Team Building",
        },
        {
            value: "formazione",
            label: "Formazione",
        },
        {
            value: "scuole",
            label: "Attività nelle scuole",
        },
        {
            value: "camp-estivi",
            label: "Camp estivi",
        },
        {
            value: "cartografia",
            label: "Cartografia",
        },
        { value: "altro", label: "Altro" },
    ] as const;

    const resetStatus = () => ({
        isSubmitting: false,
        message: "",
        error: "",
    });

    const resetForm = () => ({
        name: "",
        email: "",
        request: subjects[0].value as (typeof subjects)[number]["value"],
        message: "",
    });

    let form = $state({ ...resetForm() });
    let status = $state({ ...resetStatus() });

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        status = { ...resetStatus(), isSubmitting: true };

        try {
            const formElement = event.currentTarget as HTMLFormElement;
            const formData = new FormData(formElement);
            formData.set(
                "subject",
                form.request === "altro"
                    ? "Richiesta Informazioni"
                    : "Richiesta " +
                          (subjects.find((opt) => opt.value === form.request)
                              ?.label ?? "Sconosciuta"),
            );

            const response = await fetch("/contattaci", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams(formData as any).toString(),
            });

            if (!response.ok) throw new Error("Netlify submission failed");

            status.message =
                "Richiesta inviata con successo. Ti risponderemo al più presto.";

            form = { ...resetForm() };
            formElement.reset(); // Syncs any uncontrolled DOM inputs
        } catch {
            status.error =
                "Invio non riuscito. Riprova tra poco o scrivici via email diretta.";
        } finally {
            status.isSubmitting = false;
        }
    };
</script>

<h1>Contattaci</h1>

<p>Ogni richiesta è diversa, raccontaci cosa hai in mente :)</p>
<p>
    Utilizza il modulo qui sotto per inviarci una richiesta o scrivici
    direttamente all'indirizzo email <a href={`mailto:${CONTACTS.EMAIL}`}>
        {CONTACTS.EMAIL}
    </a>. Siamo sempre felici di rispondere a domande, discutere idee o
    semplicemente fare due chiacchiere sull'orienteering!
</p>

<div class="not-prose mt-6 rounded-3xl border border-border p-5 sm:p-6">
    {#if status.message}
        <p
            class="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300"
        >
            {status.message}
        </p>
    {/if}

    {#if status.error}
        <p
            class="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
            {status.error}
        </p>
    {/if}

    <form
        class="space-y-4"
        name="contact"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onsubmit={handleSubmit}
    >
        <Input type="hidden" name="form-name" value="contact" />
        <Input type="text" name="bot-field" tabindex={-1} class="hidden" />

        <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
                <Label for="name">Nome</Label>
                <Input
                    name="name"
                    type="text"
                    bind:value={form.name}
                    minlength={2}
                    required
                    placeholder="Il tuo nome"
                />
            </div>

            <div class="space-y-2">
                <Label for="email">Email</Label>
                <Input
                    name="email"
                    type="email"
                    bind:value={form.email}
                    required
                    placeholder="esempio@dominio.it"
                />
            </div>
        </div>

        <div class="space-y-2">
            <Label for="subject">Tipo richiesta</Label>
            <Select.Root type="single" name="subject" bind:value={form.request}>
                <Select.Trigger class="w-full">
                    {subjects.find((opt) => opt.value === form.request)
                        ?.label ?? subjects[0].label}
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Tipo richiesta</Select.Label>
                        {#each subjects as option (option.value)}
                            <Select.Item
                                value={option.value}
                                label={option.label}
                            >
                                {option.label}
                            </Select.Item>
                        {/each}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
        </div>

        <div class="space-y-2">
            <Label for="message">Messaggio</Label>
            <Textarea
                name="message"
                bind:value={form.message}
                minlength={10}
                required
                class="min-h-36"
                placeholder="Descrivi la tua richiesta..."
            />
        </div>

        <Button
            type="submit"
            size="lg"
            disabled={status.isSubmitting}
            class="w-full cursor-pointer bg-black"
        >
            {status.isSubmitting ? "Invio in corso..." : "Invia richiesta"}
        </Button>
    </form>
</div>
