// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
        document.querySelector('.navbar-links').classList.toggle('active');
    });

    // Flag toggle
    document.getElementById('flag-icon').addEventListener('click', function() {
        const flagImage = document.getElementById('flag-image');
        if (flagImage.src.includes('us.svg')) {
            flagImage.src = './images/flags/dk.svg';
            flagImage.alt = 'Danish Flag';
        } else {
            flagImage.src = './images/flags/us.svg';
            flagImage.alt = 'American Flag';
        }
    });

    // Carousel functionality
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    let scrollPosition = 0;
    const imageBox = document.querySelector('.image-box');
    let imageBoxWidth = imageBox ? imageBox.offsetWidth + 16 : 316; // Image width + gap

    function updateCarousel() {
        carouselWrapper.style.transform = `translateX(${scrollPosition}px)`;
    }

    prevButton.addEventListener('click', () => {
        scrollPosition += imageBoxWidth;
        if (scrollPosition > 0) scrollPosition = 0;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        const maxScroll = -(carouselWrapper.scrollWidth - carouselWrapper.clientWidth);
        scrollPosition -= imageBoxWidth;
        if (scrollPosition < maxScroll) scrollPosition = maxScroll;
        updateCarousel();
    });

    // Draggable functionality for touch devices
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;

    carouselWrapper.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        carouselWrapper.style.transition = 'none';
    });

    carouselWrapper.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        carouselWrapper.style.transform = `translateX(${scrollPosition + deltaX}px)`;
    });

    carouselWrapper.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const currentX = e.changedTouches[0].clientX;
        const deltaX = currentX - startX;
        scrollPosition += deltaX;
        isDragging = false;
        carouselWrapper.style.transition = 'transform 0.3s ease-in-out';

        // Snap to nearest image
        const maxScroll = -(carouselWrapper.scrollWidth - carouselWrapper.clientWidth);
        if (scrollPosition > 0) scrollPosition = 0;
        if (scrollPosition < maxScroll) scrollPosition = maxScroll;
        updateCarousel();
    });

    // For mouse devices
    carouselWrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        carouselWrapper.style.transition = 'none';
        carouselWrapper.style.cursor = 'grabbing';
    });

    carouselWrapper.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentX = e.pageX;
        const deltaX = currentX - startX;
        carouselWrapper.style.transform = `translateX(${scrollPosition + deltaX}px)`;
    });

    carouselWrapper.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        const currentX = e.pageX;
        const deltaX = currentX - startX;
        scrollPosition += deltaX;
        isDragging = false;
        carouselWrapper.style.transition = 'transform 0.3s ease-in-out';
        carouselWrapper.style.cursor = 'grab';

        // Snap to nearest image
        const maxScroll = -(carouselWrapper.scrollWidth - carouselWrapper.clientWidth);
        if (scrollPosition > 0) scrollPosition = 0;
        if (scrollPosition < maxScroll) scrollPosition = maxScroll;
        updateCarousel();
    });

    carouselWrapper.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            carouselWrapper.style.transition = 'transform 0.3s ease-in-out';
            carouselWrapper.style.cursor = 'grab';
            updateCarousel();
        }
    });

    // Responsive adjustments
    function handleResize() {
        const newImageBoxWidth = document.querySelector('.image-box') ? 
            document.querySelector('.image-box').offsetWidth + 16 : 316;
        if (Math.abs(imageBoxWidth - newImageBoxWidth) > 10) {
            imageBoxWidth = newImageBoxWidth;
            updateCarousel();
        }
    }

    window.addEventListener('resize', handleResize);
});