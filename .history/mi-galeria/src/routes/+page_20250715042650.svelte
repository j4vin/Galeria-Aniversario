<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/dist/ScrollTrigger.js';
    import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin.js';
    import { images, type Image } from '$lib/gallery-data';

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // --- Variables de Estado ---
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
    
    // --- Referencias a Elementos del DOM ---
    let prevBtn: HTMLButtonElement;
    let nextBtn: HTMLButtonElement;
    let heroContainer: HTMLElement;
    let heroContent: HTMLElement;
    let heroBackground: HTMLElement;
    let scrollWrapper: HTMLElement;
    let mainContent: HTMLElement;
    let bgImageWrappers: HTMLElement[] = [];
    
    // --- LÓGICA DEL MODAL ---
    async function openModal(image: Image, index: number) {
        if (!isSimplified) {
            isSimplified = true;
            ScrollTrigger.killAll();
            
            gsap.to(window, {
                scrollTo: { y: 0, autoKill: false },
                duration: 1, ease: 'power2.inOut'
            });
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
                x: (i) => i === 0 ? -50 : 50, scale: 0.5, autoAlpha: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)', stagger: 0.1
            });
            const pulseTl = gsap.timeline({ repeat: 2 });
            pulseTl.to([prevBtn, nextBtn], {
                boxShadow: '0 0 25px 5px rgba(255, 255, 255, 0.7)', duration: 0.4, ease: 'power1.inOut'
            }).to([prevBtn, nextBtn], {
                boxShadow: '0 0 0px 0px rgba(255, 255, 255, 0)', duration: 0.4, ease: 'power1.inOut'
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
    
    // --- onMount: Configuración inicial de la página ---
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
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                }
            })
            .to(heroContent, {
                autoAlpha: 0, yPercent: -150, duration: 0.3
            })
            .to(heroBackground, {
                autoAlpha: 0, duration: 0.3
            }, "<");
        });

        return () => {
            ctx.revert();
        };
    });

    // --- FUNCIONES AUXILIARES (sin cambios) ---
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
        let newIndex = direction === 'next' ? (selectedIndex + 1) % images.length : (selectedIndex - 1 + images.length) % images.length;
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

<!-- (El resto del HTML y el CSS no necesitan cambios) -->

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
                <div class="arrow-down"></div>
                <p class="scroll-prompt">Desliza para ver la galería</p>
            </div>
        </div>

    </div>
    <main bind:this={mainContent}>
        <h1 class="gallery-title">Aniversario 20 Años</h1>
        <p class="gallery-subtitle">Una colección de nuestros momentos favoritos.</p>
        <div class="image-gallery">
            {#each images as image, i (image.id)}
                <button class="gallery-item" on:click={() => openModal(image, i)}>
                    <img src={image.src} alt={image.alt} loading="lazy" />
                </button>
            {/each}
        </div>
    </main>
</div>

{#if selectedImage && selectedIndex !== null}
    <div
        class="modal-backdrop" role="dialog" aria-modal="true" tabindex="-1"
        on:click={handleBackdropInteraction} on:keydown={handleBackdropInteraction}
    >
        <div 
            class="modal-content" role="button" tabindex="0"
            on:click|stopPropagation={handleImageTap} on:keydown|stopPropagation={handleImageTap}
            on:touchstart|passive={handleTouchStart}
            on:touchend|passive={handleTouchEnd}
            aria-label="Toca para mostrar los controles de navegación"
        >
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

    :global(body) { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #fdfcf9; color: #333; }
    
    .scroll-wrapper { position: relative; height: 200vh; }
    .scroll-wrapper.simplified { height: auto; }
    .scroll-wrapper.simplified .hero-container { display: none; }
    .hero-container { position: sticky; top: 0; width: 100%; height: 100vh; z-index: 10; display: flex; justify-content: center; align-items: center; pointer-events: none; overflow: hidden; }
    main { position: relative; z-index: 20; background-color: #fdfcf9; }
    .hero-background-images { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; }
    .bg-image-wrapper { position: absolute; width: 100%; height: 100%; opacity: 0; visibility: hidden; }
    .bg-image-wrapper img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%); opacity: 0.25; transform: scale(1.1); }
    
    .gallery-title { 
        text-align: center; 
        font-size: 3rem;
        font-weight: 400;
        letter-spacing: 1px; 
        margin: 4rem 1rem 0;
        font-family: 'Dancing Script', cursive;
    }

    .gallery-subtitle {
        text-align: center;
        font-size: 1rem;
        font-weight: 300;
        color: #777;
        letter-spacing: 0.5px;
        margin: 0.25rem 1rem 4rem;
    }

    .image-gallery { display: grid; grid-template-columns: repeat(3, minmax(0, 25%)); gap: 2rem; justify-content: center; padding: 1rem; }
    .gallery-item { border: none; padding: 0; aspect-ratio: 1 / 1; overflow: hidden; cursor: pointer; position: relative; visibility: visible; border-radius: 12px; }
    .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
    .gallery-item:hover img { transform: scale(1.05); }

    .hero-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 12;
        visibility: hidden;
    }
    .hero-title {
        width: clamp(500px, 80vw, 800px);
    }
    .hero-title img {
        width: 100%;
        height: auto;
        display: block;
    }
    .arrow-container { 
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .arrow-down { width: 20px; height: 20px; border: solid #333; border-width: 0 3px 3px 0; transform: rotate(45deg); animation: bounce 2s infinite; }
    @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0) rotate(45deg); } 40% { transform: translateY(-15px) rotate(45deg); } 60% { transform: translateY(-8px) rotate(45deg); } }
    .scroll-prompt {
        margin: 0.75rem 0 0 0;
        font-size: 0.875rem;
        color: #666;
        letter-spacing: 0.5px;
        font-weight: 300;
    }
    .modal-backdrop { 
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000; 
        background-color: rgba(0, 0, 0, 0.9); 
        display: flex; justify-content: center; align-items: center; 
    }
    .modal-content { position: relative; max-width: 90vw; max-height: 90vh; }
    .modal-content img { 
        display: block; width: auto; height: auto; max-width: 100%; max-height: 90vh; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        -webkit-user-select: none;
        user-select: none;
    }
    .close-btn { position: absolute; top: -40px; right: 0px; background: none; border: none; font-size: 2.5rem; color: white; cursor: pointer; line-height: 1; }
    .nav-btn { position: absolute; top: 50%; transform: translateY(-50%); background-color: rgba(0, 0, 0, 0.3); color: white; border: none; font-size: 2.5rem; cursor: pointer; z-index: 1001; padding: 0.5rem 1rem; line-height: 1; transition: background-color 0.2s ease, box-shadow 0.3s ease, opacity 0.4s ease; }
    .nav-btn.hidden { opacity: 0; pointer-events: none; }
    .nav-btn:hover { background-color: rgba(0, 0, 0, 0.6); }
    .prev-btn { left: -80px; border-radius: 8px 0 0 8px; }
    .next-btn { right: -80px; border-radius: 0 8px 8px 0; }
    .info-box {
        position: fixed; bottom: 0; left: 0; right: 0;
        background-color: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(4px); color: #333;
        padding: 1.5rem 2rem 1rem; z-index: 1002; text-align: center;
        transition: transform 0.4s ease-in-out;
    }
    .info-box.collapsed { transform: translateY(calc(100% - 30px)); }
    .toggle-info-btn {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        background-color: transparent;
        border: none; 
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding: 0;
    }
    .toggle-info-btn::before {
        content: '';
        position: absolute;
        z-index: -1;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #333;
        border: 2px solid white;
        transition: transform 0.2s ease;
    }
    .toggle-info-btn:hover::before,
    .toggle-info-btn:active::before {
        transform: scale(1.1);
    }
    .toggle-info-btn svg {
        width: 20px;
        height: 20px;
        color: white;
    }
    .info-counter {
        font-size: 0.875rem;
        font-weight: 500;
        color: #555;
        margin: 0 0 0.75rem 0;
    }
    .info-title { font-size: 1.25rem; font-weight: 600; margin: 0; }
    .info-description { font-size: 1rem; font-weight: 300; margin: 0.5rem 0 0; max-width: 800px; margin-left: auto; margin-right: auto; }
    
    @media (max-width: 768px) {
        .gallery-title { font-size: 2.2rem; }
        .gallery-subtitle { font-size: 0.9rem; margin-top: 0.1rem; margin-bottom: 2rem; }
        .image-gallery { grid-template-columns: 1fr; gap: 0.5rem; padding: 0.5rem; }
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
        .arrow-container { margin-top: 1.5rem; }
        .scroll-prompt { font-size: 0.8rem; }
    }
</style>