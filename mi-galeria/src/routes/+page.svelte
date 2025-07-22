<script lang="ts">
	// NINGÚN CAMBIO EN EL SCRIPT.
	// El código de esta sección es idéntico al anterior.
	import { onMount, tick } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger.js';
	import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin.js';
	import { images, type Image } from '$lib/gallery-data';

	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

	let selectedImage: Image | null = null;
	let selectedIndex: number | null = null;
	let hasLightboxBeenOpened = false;
	let isInfoBoxExpanded = true;
	let windowWidth = 0;
	$: isMobile = windowWidth < 768;
	let arrowsVisible = true;
	let inactivityTimer: ReturnType<typeof setTimeout>;
	let touchStartX = 0;
	const SWIPE_THRESHOLD = 50;
	let isSimplified = false;

	let prevBtn: HTMLButtonElement;
	let nextBtn: HTMLButtonElement;
	let heroContainer: HTMLElement;
	let heroContent: HTMLElement;
	let heroBackground: HTMLElement;
	let scrollWrapper: HTMLElement;
	let mainContent: HTMLElement;
	let bgImageWrappers: HTMLElement[] = [];

	type YearGroup = {
		year: number;
		images: Image[];
	};

	let galleryByYear: YearGroup[] = [];

	$: {
		const yearMap = new Map<number, Image[]>();
		images.forEach((image) => {
			const year = new Date(image.date).getFullYear();
			if (!yearMap.has(year)) {
				yearMap.set(year, []);
			}
			yearMap.get(year)?.push(image);
		});
		galleryByYear = Array.from(yearMap.entries()).map(([year, images]) => ({ year, images }));
	}

	function scrollToYear(year: number) {
		gsap.to(window, {
			duration: 1.5,
			scrollTo: {
				y: `#year-${year}`,
				offsetY: 100
			},
			ease: 'power2.inOut'
		});
	}

	async function openModal(image: Image, index: number) {
		if (!isSimplified) {
			const currentScrollY = window.scrollY;
			const heroHeight = heroContainer.offsetHeight;
			isSimplified = true;
			ScrollTrigger.killAll();
			await tick();
			const newScrollY = currentScrollY - heroHeight;
			window.scrollTo({ top: newScrollY, behavior: 'instant' });
		}

		gsap.set([document.body, document.documentElement], {
			overflow: 'hidden',
			touchAction: 'none'
		});

		selectedImage = image;
		selectedIndex = index;
		isInfoBoxExpanded = true;
		resetInactivityTimer();

		if (!hasLightboxBeenOpened) {
			await tick();
			const masterTl = gsap.timeline();
			masterTl.from([prevBtn, nextBtn], {
				x: (i) => (i === 0 ? -50 : 50),
				scale: 0.5,
				autoAlpha: 0,
				duration: 1.2,
				ease: 'elastic.out(1, 0.5)',
				stagger: 0.1
			});
			const pulseTl = gsap.timeline({ repeat: 2 });
			pulseTl
				.to([prevBtn, nextBtn], {
					boxShadow: '0 0 25px 5px rgba(255, 255, 255, 0.7)',
					duration: 0.4,
					ease: 'power1.inOut'
				})
				.to([prevBtn, nextBtn], {
					boxShadow: '0 0 0px 0px rgba(255, 255, 255, 0)',
					duration: 0.4,
					ease: 'power1.inOut'
				});
			masterTl.add(pulseTl);
			hasLightboxBeenOpened = true;
		}
	}

	function closeModal() {
		gsap.set([document.body, document.documentElement], {
			overflow: 'auto',
			touchAction: 'auto'
		});
		selectedImage = null;
		selectedIndex = null;
		clearTimeout(inactivityTimer);
	}

	onMount(() => {
		windowWidth = window.innerWidth;
		window.scrollTo(0, 0);
		let ctx = gsap.context(() => {
			const entryTl = gsap.timeline();
			entryTl.from(heroContent, { yPercent: -50, autoAlpha: 0, duration: 1.5, ease: 'power3.out' });
			let currentBgIndex = 0;
			const bgInterval = setInterval(() => {
				if (isSimplified) {
					clearInterval(bgInterval);
					return;
				}
				gsap.to(bgImageWrappers[currentBgIndex], { autoAlpha: 0, duration: 1.5, ease: 'power2.inOut' });
				currentBgIndex = (currentBgIndex + 1) % images.length;
				gsap.to(bgImageWrappers[currentBgIndex], { autoAlpha: 1, duration: 1.5, ease: 'power2.inOut' });
			}, 3000);
			gsap.to(bgImageWrappers[0], { autoAlpha: 1, duration: 1.5 });
			gsap.timeline({
				scrollTrigger: {
					trigger: scrollWrapper,
					start: 'top top',
					end: 'bottom bottom',
					scrub: 1
				}
			})
				.to(heroContent, {
					autoAlpha: 0,
					yPercent: -150,
					duration: 0.3
				})
				.to(
					heroBackground,
					{
						autoAlpha: 0,
						duration: 0.3
					},
					'<'
				);
		});
		return () => {
			ctx.revert();
		};
	});

	function toggleInfoBox() { isInfoBoxExpanded = !isInfoBoxExpanded; }
	function resetInactivityTimer() {
		if (!isMobile) return;
		clearTimeout(inactivityTimer);
		arrowsVisible = true;
		inactivityTimer = setTimeout(() => { arrowsVisible = false; }, 3000);
	}
	function handleTouchStart(event: TouchEvent) { touchStartX = event.touches[0].clientX; }
	function handleTouchEnd(event: TouchEvent) {
		const touchEndX = event.changedTouches[0].clientX;
		const swipeDistance = touchEndX - touchStartX;
		if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
			navigate(swipeDistance < 0 ? 'next' : 'prev');
		}
	}
	function navigate(direction: 'next' | 'prev') {
		if (selectedIndex === null) return;
		let newIndex =
			direction === 'next'
				? (selectedIndex + 1) % images.length
				: (selectedIndex - 1 + images.length) % images.length;
		selectedIndex = newIndex;
		resetInactivityTimer();
	}
	$: if (selectedIndex !== null) { selectedImage = images[selectedIndex]; }
	function handleBackdropInteraction(event: MouseEvent | KeyboardEvent) {
		if (event.target !== event.currentTarget) return;
		if (event instanceof KeyboardEvent && (event.key !== 'Enter' && event.key !== ' ')) return;
		closeModal();
	}
	function handleGlobalKeydown(event: KeyboardEvent) { 
		if (selectedIndex !== null) {
			if (event.key === 'Escape') closeModal();
			if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
				navigate(event.key === 'ArrowRight' ? 'next' : 'prev');
			}
		}
	}
	function handleImageTap(event: MouseEvent | KeyboardEvent) {
		if (event instanceof KeyboardEvent && (event.key !== 'Enter' && event.key !== ' ')) return;
		if (!isMobile || arrowsVisible) return;
		resetInactivityTimer();
	}
</script>

<!-- NINGÚN CAMBIO EN EL HTML -->
<svelte:head>
	<title>20 Aniversario - Galería de Recuerdos</title>
	<meta name="description" content="Una galería de fotos celebrando nuestros 20 años de historia." />
</svelte:head>

<svelte:window on:keydown={handleGlobalKeydown} />

<div class="scroll-wrapper" bind:this={scrollWrapper} class:simplified={isSimplified}>
	<div class="hero-container" bind:this={heroContainer}>
		<div class="hero-background-images" bind:this={heroBackground}>
			{#each images as image, i (image.id)}
				<div class="bg-image-wrapper" bind:this={bgImageWrappers[i]}>
					<img src={image.src} alt="" loading="lazy" />
				</div>
			{/each}
		</div>
		
		<div class="hero-content" bind:this={heroContent}>
			<div class="hero-title">
				<img src="/hero-title.gif" alt="Logo animado del 20 aniversario" />
			</div>
            
			<div class="arrow-container">
				<div class="scroll-arrow"></div>
				<div class="scroll-arrow"></div>
				<p class="scroll-prompt">Desliza para ver la galería</p>
			</div>
		</div>
	</div>

	<main bind:this={mainContent}>
		<h1 class="gallery-title">Galería de Recuerdos</h1>
		<p class="gallery-subtitle">Parroquia Jesús Maestro, La Florida: 20 años</p>

		<nav class="year-nav">
			{#each galleryByYear as yearGroup (yearGroup.year)}
				<button on:click={() => scrollToYear(yearGroup.year)}>
					{yearGroup.year}
				</button>
			{/each}
		</nav>

		<div class="timeline-gallery">
			{#each galleryByYear as yearGroup (yearGroup.year)}
				<section class="year-section" id={`year-${yearGroup.year}`}>
					<div class="year-marker">
						<h2 class="year-label">{yearGroup.year}</h2>
						<div class="timeline-line"></div>
					</div>
					<div class="image-list">
						{#each yearGroup.images as image (image.id)}
							{@const globalIndex = images.findIndex((img) => img.id === image.id)}
							<button class="gallery-item" on:click={() => openModal(image, globalIndex)}>
								<img src={image.src} alt={image.alt} loading="lazy" />
							</button>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	</main>
</div>

{#if selectedImage && selectedIndex !== null}
    <div class="modal-backdrop" role="dialog" aria-modal="true" tabindex="-1" on:click={handleBackdropInteraction} on:keydown={handleBackdropInteraction}>
        <div class="modal-content" role="button" tabindex="0" on:click|stopPropagation={handleImageTap} on:keydown|stopPropagation={handleImageTap} on:touchstart|passive={handleTouchStart} on:touchend|passive={handleTouchEnd} aria-label="Toca para mostrar los controles de navegación">
            <button class="close-btn" on:click|stopPropagation={closeModal} aria-label="Cerrar modal">×</button>
            <button class="nav-btn prev-btn" class:hidden={!arrowsVisible && isMobile} bind:this={prevBtn} on:click|stopPropagation={() => navigate('prev')} aria-label="Imagen anterior">‹</button>
            <button class="nav-btn next-btn" class:hidden={!arrowsVisible && isMobile} bind:this={nextBtn} on:click|stopPropagation={() => navigate('next')} aria-label="Siguiente imagen">›</button>
            <img src={selectedImage.src} alt={selectedImage.alt} />
        </div>
        <div class="info-box" class:collapsed={!isInfoBoxExpanded}>
            <button class="toggle-info-btn" on:click={toggleInfoBox} aria-label={isInfoBoxExpanded ? 'Ocultar información' : 'Mostrar información'}>
                {#if isInfoBoxExpanded}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                {/if}
            </button>
            <p class="info-counter">{selectedIndex + 1} / {images.length}</p>
            <h2 class="info-title">{selectedImage.title}</h2>
            <p class="info-description">{selectedImage.description}</p>
        </div>
    </div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
	/* Estilos globales y del hero (sin cambios hasta la sección de la flecha) */
	:global(body) { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #fdfcf9; color: #333; }
	.scroll-wrapper { position: relative; height: 200vh; }
	.scroll-wrapper.simplified { height: auto; }
	.scroll-wrapper.simplified .hero-container { display: none; }
	.hero-container { position: sticky; top: 0; width: 100%; height: 100vh; z-index: 10; display: flex; justify-content: center; align-items: center; pointer-events: none; overflow: hidden; }
	main { position: relative; z-index: 20; background-color: #fdfcf9; }
	.hero-background-images { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; }
	.bg-image-wrapper { position: absolute; width: 100%; height: 100%; opacity: 0; visibility: hidden; }
	.bg-image-wrapper img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%); opacity: 0.25; transform: scale(1.1); }
	.hero-content { display: flex; flex-direction: column; align-items: center; position: relative; z-index: 12; visibility: hidden; }
	.hero-title { width: clamp(500px, 80vw, 800px); }
	.hero-title img { width: 100%; height: auto; display: block; }
	
    /* --- CAMBIO INICIA: Estilos de la flecha responsiva --- */

	/* Estilos por defecto (Escritorio) */
	.arrow-container {
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.scroll-arrow {
		width: 20px;
		height: 20px;
		border: solid #333;
		border-width: 0 3px 3px 0;
		transform: rotate(45deg); /* Apunta hacia ABAJO */
		animation: bounce 2s infinite; /* Animación de REBOTE */
	}

	/* Ocultamos la segunda flecha en escritorio */
	.scroll-arrow:last-child {
		display: none;
	}

	/* Animación de rebote (para escritorio) */
	@keyframes bounce {
		0%, 20%, 50%, 80%, 100% {
			transform: translateY(0) rotate(45deg);
		}
		40% {
			transform: translateY(15px) rotate(45deg);
		}
		60% {
			transform: translateY(8px) rotate(45deg);
		}
	}

	/* Animación de deslizamiento hacia arriba (para móvil) */
	@keyframes move-up {
		0% {
			opacity: 0;
			transform: translateY(15px) rotate(-135deg);
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translateY(-15px) rotate(-135deg);
		}
	}
    /* --- CAMBIO TERMINA --- */

	.scroll-prompt { margin: 0.75rem 0 0 0; font-size: 0.875rem; color: #666; letter-spacing: 0.5px; font-weight: 300; }
	.gallery-title { text-align: center; font-size: 3rem; font-weight: 400; letter-spacing: 1px; margin: 4rem 1rem 0; font-family: 'Dancing Script', cursive; }
	.gallery-subtitle { text-align: center; font-size: 1rem; font-weight: 300; color: #777; letter-spacing: 0.5px; margin: 0.25rem 1rem 2rem; }
	.year-nav { display: flex; justify-content: center; align-items: center; gap: 1.5rem; margin-bottom: 4rem; padding: 0 1rem; }
	.year-nav button { background: none; border: none; font-size: 1.6rem; font-weight: 700; color: #555; cursor: pointer; transition: color 0.3s ease, transform 0.2s ease; padding: 0.5rem 1rem; }
	.year-nav button:hover, .year-nav button:focus { color: #000; transform: scale(1.1); }
	.timeline-gallery { max-width: 900px; margin: 0 auto; padding: 1rem 2rem; }
	.year-section { display: flex; gap: 2rem; margin-bottom: 4rem; }
	.year-marker { flex: 0 0 80px; position: relative; text-align: center; }
	.year-label { font-size: 2.5rem; font-weight: 700; color: #bbb; position: sticky; top: 4rem; margin: 0; }
	.timeline-line { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 2px; height: 100%; background-color: #e0e0e0; z-index: -1; }
	.image-list { flex: 1; display: flex; flex-direction: column; gap: 2.5rem; }
	.gallery-item { border: none; padding: 0; overflow: hidden; cursor: pointer; position: relative; visibility: visible; border-radius: 12px; width: 100%; }
	.gallery-item img { width: 100%; height: auto; object-fit: cover; transition: transform 0.3s ease; display: block; }
	.gallery-item:hover img { transform: scale(1.02); }
	.modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000; background-color: rgba(0, 0, 0, 0.9); display: flex; justify-content: center; align-items: center; }
	.modal-content { position: relative; max-width: 90vw; max-height: 90vh; }
	.modal-content img { display: block; width: auto; height: auto; max-width: 100%; max-height: 90vh; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); -webkit-user-select: none; user-select: none; }
	.close-btn { position: absolute; top: -40px; right: 0px; background: none; border: none; font-size: 2.5rem; color: white; cursor: pointer; line-height: 1; }
	.nav-btn { position: absolute; top: 50%; transform: translateY(-50%); background-color: rgba(0, 0, 0, 0.3); color: white; border: none; font-size: 2.5rem; cursor: pointer; z-index: 1001; padding: 0.5rem 1rem; line-height: 1; transition: background-color 0.2s ease, box-shadow 0.3s ease, opacity 0.4s ease; }
	.nav-btn.hidden { opacity: 0; pointer-events: none; }
	.nav-btn:hover { background-color: rgba(0, 0, 0, 0.6); }
	.prev-btn { left: -80px; border-radius: 8px 0 0 8px; }
	.next-btn { right: -80px; border-radius: 0 8px 8px 0; }
	.info-box { position: fixed; bottom: 0; left: 0; right: 0; background-color: rgba(255, 255, 255, 0.85); backdrop-filter: blur(4px); color: #333; padding: 1.5rem 2rem 1rem; z-index: 1002; text-align: center; transition: transform 0.4s ease-in-out; }
	.info-box.collapsed { transform: translateY(calc(100% - 30px)); }
	.toggle-info-btn { position: absolute; top: 0; left: 50%; transform: translate(-50%, -50%); width: 50px; height: 50px; background-color: transparent; border: none; display: flex; justify-content: center; align-items: center; cursor: pointer; padding: 0; }
	.toggle-info-btn::before { content: ''; position: absolute; z-index: -1; width: 30px; height: 30px; border-radius: 50%; background-color: #333; border: 2px solid white; transition: transform 0.2s ease; }
	.toggle-info-btn:hover::before, .toggle-info-btn:active::before { transform: scale(1.1); }
	.toggle-info-btn svg { width: 20px; height: 20px; color: white; }
	.info-counter { font-size: 0.875rem; font-weight: 500; color: #555; margin: 0 0 0.75rem 0; }
	.info-title { font-size: 1.25rem; font-weight: 600; margin: 0; }
	.info-description { font-size: 1rem; font-weight: 300; margin: 0.5rem 0 0; max-width: 800px; margin-left: auto; margin-right: auto; }
	
	/* --- CAMBIO INICIA: Media Query para sobrescribir estilos en móvil --- */
	@media (max-width: 768px) {
		.gallery-title { font-size: 2.2rem; }
		.gallery-subtitle { font-size: 0.9rem; margin-top: 0.1rem; margin-bottom: 1.5rem; }
		.year-nav { gap: 0.5rem; margin-bottom: 3rem; flex-wrap: wrap; }
		.year-nav button { font-size: 1.2rem; }

		/* Estilos para el contenedor de la flecha en móvil */
		.arrow-container {
			margin-top: 1.5rem;
			gap: 8px; /* Añadimos espacio entre las dos flechas */
		}

		/* Sobrescribimos los estilos de la flecha para móvil */
		.scroll-arrow {
			transform: rotate(-135deg); /* Apunta hacia ARRIBA */
			animation: move-up 2s ease-out infinite; /* Animación de DESLIZAMIENTO */
		}

		/* Mostramos la segunda flecha */
		.scroll-arrow:last-child {
			display: block;
			animation-delay: -0.5s; /* Efecto cascada */
		}
		
		/* El resto de los estilos responsivos permanecen igual */
		.timeline-gallery { padding: 0.5rem; }
		.year-section { gap: 1rem; margin-bottom: 3rem; }
		.year-marker { flex-basis: 50px; }
		.year-label { font-size: 1.8rem; top: 2rem; }
		.image-list { gap: 1.5rem; }
		.close-btn { top: 10px; right: 10px; color: #333; background-color: rgba(255, 255, 255, 0.7); border-radius: 50%; width: 30px; height: 30px; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; }
		.prev-btn { left: 10px; }
		.next-btn { right: 10px; }
		.info-box { padding: 1.25rem 1rem 0.75rem; }
		.info-box.collapsed { transform: translateY(calc(100% - 24px)); }
		.toggle-info-btn::before { width: 28px; height: 28px; }
		.toggle-info-btn svg { width: 18px; height: 18px; }
		.info-counter { font-size: 0.8rem; margin-bottom: 0.5rem; }
		.info-title { font-size: 1rem; }
		.info-description { font-size: 0.875rem; }
		.hero-title { width: 90vw; }
		.scroll-prompt { font-size: 0.8rem; }
	}
	/* --- CAMBIO TERMINA --- */
</style>