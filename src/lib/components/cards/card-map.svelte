<script lang="ts">
	import { onMount } from "svelte";
	import * as Card from "$lib/components/ui/card";
	import type { Map } from "$lib/types";

	let { id, map }: { id: string; map: Map } = $props();
	let container = $state<HTMLDivElement>();

	let view = $state({
		zoom: 1,
		pan: { x: 0, y: 0 },
		isFullscreen: false,
		isPanning: false,
	});

	let pointer = {
		id: null as number | null,
		startX: 0,
		startY: 0,
		panStartX: 0,
		panStartY: 0,
	};

	const ZOOM = { MIN: 1, MAX: 5, STEP: 0.5 };

	const eventTypeClasses: Record<Map["type"], string> = {
		CO: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
		"CS/T": "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
		MTBO: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
		SCIO: "border-pink-500/30 bg-pink-500/10 text-pink-700 dark:text-pink-300",
	};

	function syncFullscreenState() {
		view.isFullscreen =
			!!document.fullscreenElement &&
			document.fullscreenElement === container;
		if (!view.isFullscreen) {
			view.isPanning = false;
			pointer.id = null;
			view.zoom = 1;
			view.pan = { x: 0, y: 0 };
		}
	}

	async function openFullscreen() {
		if (!container || !map.image) return;
		view.zoom = 1;
		view.pan = { x: 0, y: 0 };

		if (document.fullscreenEnabled && container.requestFullscreen) {
			await container.requestFullscreen();
		} else {
			window.open(map.image, "_blank", "noopener,noreferrer");
		}
	}

	function updatePan(nextX: number, nextY: number) {
		if (!container || view.zoom <= 1) {
			view.pan = { x: 0, y: 0 };
			return;
		}
		const maxOffsetX = ((view.zoom - 1) * container.clientWidth) / 2;
		const maxOffsetY = ((view.zoom - 1) * container.clientHeight) / 2;

		view.pan = {
			x: Math.max(-maxOffsetX, Math.min(maxOffsetX, nextX)),
			y: Math.max(-maxOffsetY, Math.min(maxOffsetY, nextY)),
		};
	}

	function updateZoom(nextZoom: number) {
		view.zoom = Math.min(ZOOM.MAX, Math.max(ZOOM.MIN, nextZoom));
		if (view.zoom <= 1) view.pan = { x: 0, y: 0 };
		else updatePan(view.pan.x, view.pan.y);
	}

	function isControl(target: EventTarget | null) {
		return (target as HTMLElement)?.closest?.(
			".fullscreen-toolbar, .fullscreen-close",
		);
	}

	function onPointerDown(e: PointerEvent) {
		if (
			isControl(e.target) ||
			!view.isFullscreen ||
			view.zoom <= 1 ||
			(e.pointerType === "mouse" && e.button !== 0)
		)
			return;
		e.preventDefault();
		e.stopPropagation();

		view.isPanning = true;
		pointer = {
			id: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
			panStartX: view.pan.x,
			panStartY: view.pan.y,
		};
		container?.setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!view.isPanning || pointer.id !== e.pointerId) return;
		e.preventDefault();
		e.stopPropagation();

		updatePan(
			pointer.panStartX + (e.clientX - pointer.startX),
			pointer.panStartY + (e.clientY - pointer.startY),
		);
	}

	function onPointerUp(e: PointerEvent) {
		if (pointer.id !== e.pointerId) return;
		e.stopPropagation();

		view.isPanning = false;
		pointer.id = null;
		container?.releasePointerCapture(e.pointerId);
	}

	function onWheel(e: WheelEvent) {
		if (!view.isFullscreen) return;
		e.stopPropagation();
		e.preventDefault();

		const rect = container?.getBoundingClientRect();
		if (!rect) return;

		const offsetX = e.clientX - rect.left - rect.width / 2;
		const offsetY = e.clientY - rect.top - rect.height / 2;

		const zoomFactor = 1 - e.deltaY * 0.0025;
		const newZoom = Math.min(
			ZOOM.MAX,
			Math.max(ZOOM.MIN, view.zoom * zoomFactor),
		);

		const ratio = 1 - newZoom / view.zoom;
		const newPanX = view.pan.x + (offsetX - view.pan.x) * ratio;
		const newPanY = view.pan.y + (offsetY - view.pan.y) * ratio;

		view.zoom = newZoom;
		updatePan(newPanX, newPanY);
	}

	onMount(() => {
		document.addEventListener("fullscreenchange", syncFullscreenState);
		document.addEventListener(
			"webkitfullscreenchange",
			syncFullscreenState,
		);
		return () => {
			document.removeEventListener(
				"fullscreenchange",
				syncFullscreenState,
			);
			document.removeEventListener(
				"webkitfullscreenchange",
				syncFullscreenState,
			);
		};
	});
</script>

<Card.Root
	{id}
	class={`focus:ring-secondary-foreground flex h-full flex-col gap-4 overflow-hidden p-4 transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-md focus:ring-2 ${map.image ? "cursor-pointer" : "cursor-default"}`}
	role="button"
	tabindex={0}
	aria-label={`Apri la mappa ${map.name} a schermo intero`}
	onclick={() => !view.isFullscreen && openFullscreen()}
	onkeydown={(e: KeyboardEvent) => {
		if (e.key === "Escape" && view.isFullscreen) {
			document.exitFullscreen();
		} else if ((e.key === "Enter" || e.key === " ") && !view.isFullscreen) {
			e.preventDefault();
			openFullscreen();
		}
	}}
>
	{#if map.image}
		<div
			bind:this={container}
			data-fullscreen={view.isFullscreen ? "true" : "false"}
			data-panning={view.isPanning ? "true" : "false"}
			class="map-image-container relative flex w-full items-center justify-center"
			role="application"
			aria-label={`Viewer mappa ${map.name}: trascina per spostare, usa Ctrl + rotella o i pulsanti per lo zoom`}
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointercancel={onPointerUp}
			onwheel={onWheel}
		>
			<img
				src={map.image}
				alt={`Immagine mappa ${map.name}`}
				class="map-image max-h-full max-w-full rounded-sm object-contain"
				style={`transform: translate3d(${view.pan.x}px, ${view.pan.y}px, 0) scale(${view.zoom});`}
				loading="lazy"
			/>

			<div class="fullscreen-toolbar" aria-label="Controlli zoom mappa">
				<button
					type="button"
					class="fullscreen-action cursor-pointer"
					aria-label="Riduci zoom"
					onclick={(e) => {
						e.stopPropagation();
						updateZoom(view.zoom - ZOOM.STEP);
					}}
				>
					-
				</button>
				<button
					type="button"
					class="fullscreen-action cursor-pointer"
					aria-label="Reimposta zoom"
					onclick={(e) => {
						e.stopPropagation();
						updateZoom(1);
					}}
				>
					{Math.round(view.zoom * 100)}%
				</button>
				<button
					type="button"
					class="fullscreen-action cursor-pointer"
					aria-label="Aumenta zoom"
					onclick={(e) => {
						e.stopPropagation();
						updateZoom(view.zoom + ZOOM.STEP);
					}}
				>
					+
				</button>
			</div>

			<button
				type="button"
				class="fullscreen-close cursor-pointer"
				aria-label="Chiudi schermo intero"
				onclick={async (e) => {
					e.stopPropagation();
					await document.exitFullscreen();
				}}
			>
				Chiudi
			</button>
		</div>
	{:else}
		<div
			class="bg-muted flex h-42 items-center justify-center rounded-md p-4 text-center"
		>
			<span class="text-muted-foreground text-sm">
				File mappa non pubblico. <br />
				Contattare la società per maggiori informazioni.
			</span>
		</div>
	{/if}

	<Card.Header class="px-0 text-center">
		<Card.Title class="text-lg leading-tight">
			<span>{map.name}</span>
		</Card.Title>

		<div class="mt-1 text-xs font-medium">
			<span class="shrink-0 rounded-full border px-2.5 py-1">
				1:{map.scale.toLocaleString("it-IT", {
					useGrouping: "always",
				})}
			</span>
			<span class="shrink-0 rounded-full border px-2.5 py-1">
				{map.contours ?? "?"}m
			</span>
			<span
				class={`shrink-0 rounded-full border px-2.5 py-1 ${eventTypeClasses[map.type]}`}
			>
				{map.type}
			</span>
		</div>

		{#if map.updated || map.mapper}
			<div class="text-muted-foreground mt-2 text-center text-xs">
				Cartografia ({map.updated
					? map.updated.getFullYear()
					: "????"}): {map.mapper ? map.mapper : "?"}
			</div>
		{/if}
	</Card.Header>
</Card.Root>

<style>
	.fullscreen-close {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		border: 0;
		border-radius: 9999px;
		padding: 0.4rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: white;
		background: rgb(0 0 0 / 0.65);
		opacity: 0;
		pointer-events: none;
		transition: opacity 150ms ease;
	}

	.fullscreen-toolbar {
		position: absolute;
		bottom: 0.75rem;
		left: 50%;
		display: flex;
		gap: 0.5rem;
		transform: translateX(-50%);
		opacity: 0;
		pointer-events: none;
		transition: opacity 150ms ease;
	}

	.fullscreen-action {
		border: 0;
		border-radius: 9999px;
		min-width: 2.25rem;
		padding: 0.35rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 700;
		color: white;
		background: rgb(0 0 0 / 0.65);
	}

	.map-image {
		transition: transform 150ms ease;
		transform-origin: center center;
		will-change: transform;
	}

	:global(.map-image-container:fullscreen),
	:global(.map-image-container:-webkit-full-screen) {
		overflow: hidden;
		touch-action: none;
		/* cursor: grab; */
		background: black;
	}

	:global(.map-image-container[data-panning="true"]:fullscreen),
	:global(.map-image-container[data-panning="true"]:-webkit-full-screen) {
		cursor: grabbing;
	}

	:global(.map-image-container:fullscreen) .fullscreen-close {
		opacity: 1;
		pointer-events: auto;
	}

	:global(.map-image-container:fullscreen) .fullscreen-toolbar {
		opacity: 1;
		pointer-events: auto;
	}

	:global(.map-image-container:-webkit-full-screen) .fullscreen-close {
		opacity: 1;
		pointer-events: auto;
	}

	:global(.map-image-container:-webkit-full-screen) .fullscreen-toolbar {
		opacity: 1;
		pointer-events: auto;
	}

	:global(.map-image-container:fullscreen) img,
	:global(.map-image-container:-webkit-full-screen) img {
		width: 100%;
		height: 100%;
		border-radius: 0;
	}
</style>
