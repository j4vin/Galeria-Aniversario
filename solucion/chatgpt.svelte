<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { Flip } from 'gsap/Flip';

	gsap.registerPlugin(ScrollTrigger, Flip);

	type Image = { id: number; src: string; alt: string };
	const totalImages = 15;
	const images: Image[] = Array.from({ length: totalImages }, (_, i) => ({
		id: i,
		src: `/images/img_${i + 1}.jpg`,
		alt: `Fotografía de aniversario ${i + 1}`
	}));

	let selectedImage: Image | null = null;
	function openModal(image: Image) {
		selectedImage = image;
	}
	function closeModal() {
		selectedImage = null;
	}
	function handleModalClose(event: MouseEvent | KeyboardEvent) {
		if (event instanceof KeyboardEvent) {
			if (event.key === 'Enter' || event.key === ' ') closeModal();
		} else {
			closeModal();
		}
	}
	function handleGlobalKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && selectedImage) closeModal();
	}

	let heroContainer: HTMLElement;
	let heroTitle: HTMLElement;
	let heroArrow: HTMLElement;
	let heroImages: HTMLElement[] = [];
	const animatedImages: Image[] = images.slice(0, 6);

	let galleryItems: HTMLElement[] = [];

	let windowWidth = 0;
	let windowHeight = 0;

	function updateImagePositions() {
		if (!heroImages.length || !windowWidth || !windowHeight) return;
		heroImages.forEach((imgElement, index) => {
			const baseRadiusX = windowWidth * 0.35;
			let baseRadiusY = windowHeight * 0.3;
			if (index === 1 || index === 4) {
				baseRadiusY *= 0.7;
			}
			const angle = (index / 6) * 2 * Math.PI + Math.PI / 2;
			const finalX = baseRadiusX * Math.cos(angle);
			const finalY = baseRadiusY * Math.sin(angle);
			const finalRotation = -15 + index * 10;
			gsap.set(imgElement, {
				x: finalX,
				y: finalY,
				xPercent: -50,
				yPercent: -50,
				rotation: finalRotation
			});
		});
	}

	$: if (windowWidth && windowHeight) {
		updateImagePositions();
		ScrollTrigger.refresh();
	}

	onMount(() => {
		updateImagePositions();
		const animatedGalleryItems = galleryItems.slice(0, 6);
		const staticGalleryItems = galleryItems.slice(6);

		gsap.set(animatedGalleryItems, { visibility: 'hidden' });
		gsap.set(staticGalleryItems, { autoAlpha: 0 });

		const entryTl = gsap.timeline();
		entryTl.from(heroTitle, { yPercent: -150, autoAlpha: 0, duration: 1.5, ease: 'power3.out' });
		entryTl.from(heroArrow, { yPercent: 150, autoAlpha: 0, duration: 1.5, ease: 'power3.out' }, '<');
		entryTl.from(
			heroImages,
			{
				scale: 0,
				autoAlpha: 0,
				duration: 1.2,
				stagger: 0.08,
				ease: 'power3.out'
			},
			'<0.2'
		);

		entryTl.then(() => {
			const scrollTl = gsap.timeline({
				scrollTrigger: {
					trigger: 'main',
					start: 'top top',
					end: '+=1200',
					scrub: 1,
					pin: '.hero-container',
					pinSpacing: true
				}
			});

			scrollTl.to([heroTitle, heroArrow], {
				autoAlpha: 0,
				yPercent: (i) => (i === 0 ? -150 : 150),
				duration: 0.3
			});

            gsap.set(animatedGalleryItems, { visibility: 'visible' }); // ← antes del estado inicial

			const state = Flip.getState(heroImages);
			
			gsap.set(animatedGalleryItems, { visibility: 'visible' });

			const flipAnimation = Flip.from(state, {
				targets: animatedGalleryItems,
				duration: 1,
				ease: 'power2.inOut',
				stagger: 0.05,
				absolute: true
			});

			scrollTl.add(flipAnimation, '<');
			scrollTl.to(heroImages, { autoAlpha: 0, duration: 0.1 }, '<');
			
			scrollTl.to(staticGalleryItems, {
				autoAlpha: 1,
				stagger: 0.05,
				duration: 0.5
			}, "-=0.5");
		});
	});
</script>

<svelte:window
	bind:innerWidth={windowWidth}
	bind:innerHeight={windowHeight}
	on:keydown={handleGlobalKeydown}
/>

<div class="hero-container" bind:this={heroContainer}>
	<h1 class="hero-title" bind:this={heroTitle}>20 años</h1>
	<div class="orbit-images">
		{#each animatedImages as image, i (image.id)}
            <div class="hero-image" bind:this={heroImages[i]} data-flip-id={`img_${image.id}`}>
                <img src={image.src} alt={image.alt} />
            </div>
        {/each}
	</div>
	<div class="arrow-container" bind:this={heroArrow}>
		<div class="arrow-down"></div>
	</div>
</div>

<main>
	<h1 class="gallery-title">Aniversario 20 Años</h1>
	<div class="image-gallery">
		{#each images as image, i (image.id)}
            <button
                class="gallery-item"
                on:click={() => openModal(image)}
                bind:this={galleryItems[i]}
                data-flip-id={`img_${image.id}`}
            >
                <img src={image.src} alt={image.alt} />
            </button>
        {/each}

	</div>
</main>

{#if selectedImage}
	<div
		class="modal-backdrop"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		on:click={handleModalClose}
		on:keydown={handleModalClose}
	>
		<div class="modal-content">
			<button class="close-btn" on:click={closeModal} aria-label="Cerrar modal">×</button>
			<img src={selectedImage.src} alt={selectedImage.alt} />
		</div>
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
		background-color: #fdfcf9;
		color: #333;
	}
	.gallery-title {
		text-align: center;
		font-size: 2.5rem;
		font-weight: 300;
		letter-spacing: 2px;
		margin: 4rem 1rem;
	}
	.image-gallery {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		padding: 1rem;
	}

	.gallery-item {
		border: none;
		padding: 0;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		cursor: pointer;
		position: relative;
	}

	.gallery-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}
	.gallery-item:hover img {
		transform: scale(1.05);
	}

	.hero-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: auto;
		overflow: hidden;
	}
	.hero-title {
		position: relative;
		z-index: 12;
		font-size: clamp(2.5rem, 10vw, 5rem);
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #2c2c2c;
	}
	.orbit-images {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.hero-image {
		position: absolute;
		top: 50%;
		left: 50%;
		width: clamp(100px, 20vw, 180px);
		aspect-ratio: 1 / 1;
	}
	.hero-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		border-radius: 8px;
	}
	.arrow-container {
		position: absolute;
		bottom: 5%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 12;
	}
	.arrow-down {
		width: 20px;
		height: 20px;
		border: solid #333;
		border-width: 0 3px 3px 0;
		transform: rotate(45deg);
		animation: bounce 2s infinite;
	}
	@keyframes bounce {
		0%,
		20%,
		50%,
		80%,
		100% {
			transform: translateY(0) rotate(45deg);
		}
		40% {
			transform: translateY(-15px) rotate(45deg);
		}
		60% {
			transform: translateY(-8px) rotate(45deg);
		}
	}

	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
		background-color: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(8px);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.modal-content {
		position: relative;
		max-width: 90vw;
		max-height: 90vh;
	}
	.modal-content img {
		display: block;
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 90vh;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
	}
	.close-btn {
		position: absolute;
		top: -40px;
		right: 0px;
		background: none;
		border: none;
		font-size: 2.5rem;
		color: white;
		cursor: pointer;
		line-height: 1;
	}

	@media (max-width: 768px) {
		.gallery-title {
			font-size: 2rem;
			margin: 2rem 1rem;
		}
		.image-gallery {
			grid-template-columns: 1fr;
			gap: 0.5rem;
			padding: 0.5rem;
		}
		.close-btn {
			top: 10px;
			right: 10px;
			color: #333;
			background-color: rgba(255, 255, 255, 0.7);
			border-radius: 50%;
			width: 30px;
			height: 30px;
			font-size: 1.5rem;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>